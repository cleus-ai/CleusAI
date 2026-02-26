import type { Model, Message } from "@cleus/shared";

interface SendMessageParams {
  conversationId: string;
  content: string;
  model: Model;
  onChunk: (chunk: string) => void;
  onDone: (fullContent: string) => void;
}

export async function sendMessage({ conversationId, content, model, onChunk, onDone }: SendMessageParams) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ conversationId, content, model }),
  });

  if (!response.ok) throw new Error(`Chat error: ${response.statusText}`);
  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullContent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    fullContent += chunk;
    onChunk(chunk);
  }

  onDone(fullContent);
}

export async function getConversations(): Promise<{ id: string; title: string; updatedAt: string }[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversations`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
}

export async function deleteConversation(id: string): Promise<void> {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversations/${id}`, { method: "DELETE", credentials: "include" });
}
