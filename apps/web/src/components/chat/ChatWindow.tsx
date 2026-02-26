"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/chat.store";
import { ModelSelector } from "./ModelSelector";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { sendMessage } from "@/lib/api/chat";

export function ChatWindow() {
  const {
    conversations,
    activeConversationId,
    isGenerating,
    streamingContent,
    selectedModel,
    createConversation,
    addMessage,
    setIsGenerating,
    appendStreamChunk,
    clearStream,
  } = useChatStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeConversation?.messages, streamingContent]);

  const handleSend = async (content: string, attachments?: File[]) => {
    let convId = activeConversationId;
    if (!convId) {
      convId = createConversation(content.slice(0, 40));
    }

    addMessage(convId, {
      id: crypto.randomUUID(),
      role: "user",
      content,
      attachments: attachments?.map((f) => URL.createObjectURL(f)),
      createdAt: new Date().toISOString(),
    });

    setIsGenerating(true);
    clearStream();

    try {
      await sendMessage({
        conversationId: convId,
        content,
        model: selectedModel,
        onChunk: appendStreamChunk,
        onDone: (fullContent) => {
          addMessage(convId!, {
            id: crypto.randomUUID(),
            role: "assistant",
            content: fullContent,
            model: selectedModel,
            createdAt: new Date().toISOString(),
          });
          clearStream();
          setIsGenerating(false);
        },
      });
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <h2 className="text-sm font-medium text-zinc-300">
          {activeConversation?.title ?? "New Chat"}
        </h2>
        <ModelSelector />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeConversation?.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {streamingContent && (
          <MessageBubble
            message={{
              id: "streaming",
              role: "assistant",
              content: streamingContent,
              createdAt: new Date().toISOString(),
            }}
            isStreaming
          />
        )}
        {isGenerating && !streamingContent && (
          <div className="flex gap-1 pl-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        )}
      </div>

      <ChatInput onSend={handleSend} disabled={isGenerating} />
    </div>
  );
}
