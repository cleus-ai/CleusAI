"use client";
import ReactMarkdown from "react-markdown";
import { clsx } from "clsx";
import { Avatar } from "@/components/ui/Avatar";
import type { Message } from "@cleus/shared";

interface MessageBubbleProps { message: Message; isStreaming?: boolean; }

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";
  return (
    <div className={clsx("flex gap-3", isUser && "flex-row-reverse")}>
      <Avatar name={isUser ? "You" : "Cleus"} size="sm" className={isUser ? "bg-zinc-700" : "bg-violet-700"} />
      <div className={clsx("max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed", isUser ? "bg-zinc-800 text-zinc-100 rounded-tr-sm" : "bg-zinc-900 text-zinc-200 rounded-tl-sm border border-zinc-800")}>
        {message.attachments?.map((url, i) => <img key={i} src={url} alt="attachment" className="rounded-lg mb-2 max-h-48 object-cover" />)}
        <ReactMarkdown>{message.content}</ReactMarkdown>
        {isStreaming && <span className="inline-block w-1 h-4 bg-violet-400 animate-pulse ml-0.5" />}
      </div>
    </div>
  );
}
