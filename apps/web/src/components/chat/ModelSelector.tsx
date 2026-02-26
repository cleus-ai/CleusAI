"use client";
import { useChatStore } from "@/store/chat.store";
import { AVAILABLE_MODELS } from "@/lib/constants";
import type { Model } from "@cleus/shared";

export function ModelSelector() {
  const { selectedModel, setSelectedModel } = useChatStore();
  return (
    <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value as Model)}
      className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-violet-500">
      {AVAILABLE_MODELS.map((m) => (
        <option key={m.id} value={m.id}>{m.name}</option>
      ))}
    </select>
  );
}
