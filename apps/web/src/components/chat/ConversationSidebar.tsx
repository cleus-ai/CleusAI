"use client";
import { useChatStore } from "@/store/chat.store";
import { Plus, Trash2, MessageSquare } from "lucide-react";
import { clsx } from "clsx";

export function ConversationSidebar() {
  const { conversations, activeConversationId, createConversation, deleteConversation, setActiveConversation } = useChatStore();
  return (
    <aside className="w-60 flex flex-col bg-zinc-950 border-r border-zinc-800">
      <div className="p-3 border-b border-zinc-800">
        <button onClick={() => createConversation()} className="w-full flex items-center gap-2 px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {conversations.map((c) => (
          <div key={c.id} onClick={() => setActiveConversation(c.id)}
            className={clsx("group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors", activeConversationId === c.id ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200")}>
            <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs truncate flex-1">{c.title}</span>
            <button onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }}
              className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
