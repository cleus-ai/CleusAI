import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Model, Message } from "@cleus/shared";
import { logger } from "../utils/logger";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? "");

export type StreamCallback = (chunk: string) => void;

interface ChatParams {
  model: Model;
  messages: Message[];
  systemPrompt?: string;
  onChunk?: StreamCallback;
}

const MODEL_ROUTING: Record<string, "anthropic" | "openai" | "google" | "cleus"> = {
  "claude-3-opus": "anthropic",
  "claude-3-sonnet": "anthropic",
  "claude-3-haiku": "anthropic",
  "gpt-4o": "openai",
  "gpt-4o-mini": "openai",
  "o1-preview": "openai",
  "gemini-1.5-pro": "google",
  "gemini-1.5-flash": "google",
  "cleus-uncensored": "cleus",
  "llama-3-70b": "cleus",
  "grok-2": "cleus",
};

export async function streamChat({ model, messages, systemPrompt, onChunk }: ChatParams): Promise<string> {
  const provider = MODEL_ROUTING[model] ?? "cleus";

  switch (provider) {
    case "anthropic":
      return streamAnthropic({ model, messages, systemPrompt, onChunk });
    case "openai":
      return streamOpenAI({ model, messages, systemPrompt, onChunk });
    case "google":
      return streamGemini({ model, messages, systemPrompt, onChunk });
    default:
      return streamCleus({ model, messages, systemPrompt, onChunk });
  }
}

async function streamAnthropic({ model, messages, systemPrompt, onChunk }: ChatParams) {
  let fullText = "";
  const stream = await anthropic.messages.stream({
    model,
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      fullText += event.delta.text;
      onChunk?.(event.delta.text);
    }
  }
  return fullText;
}

async function streamOpenAI({ model, messages, systemPrompt, onChunk }: ChatParams) {
  let fullText = "";
  const stream = await openai.chat.completions.create({
    model,
    stream: true,
    messages: [
      ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
      ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ],
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content ?? "";
    fullText += delta;
    onChunk?.(delta);
  }
  return fullText;
}

async function streamGemini({ model, messages, systemPrompt, onChunk }: ChatParams) {
  let fullText = "";
  const genModel = gemini.getGenerativeModel({ model });
  const chat = genModel.startChat({
    systemInstruction: systemPrompt,
    history: messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessageStream(lastMessage?.content ?? "");
  for await (const chunk of result.stream) {
    const text = chunk.text();
    fullText += text;
    onChunk?.(text);
  }
  return fullText;
}

async function streamCleus({ model, messages, systemPrompt, onChunk }: ChatParams) {
  // Cleus internal uncensored model via internal inference endpoint
  const response = await fetch(`${process.env.CLEUS_INFERENCE_URL}/v1/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CLEUS_INFERENCE_KEY}`,
    },
    body: JSON.stringify({ model, messages, systemPrompt, stream: true }),
  });

  if (!response.body) throw new Error("No response body from Cleus inference");

  let fullText = "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value);
    fullText += text;
    onChunk?.(text);
  }

  return fullText;
}
