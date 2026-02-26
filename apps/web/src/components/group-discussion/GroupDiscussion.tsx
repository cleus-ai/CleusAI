"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GroupDiscussionMessage, Model } from "@cleus/shared";
import { AVAILABLE_MODELS } from "@/lib/constants";
import { startGroupDiscussion } from "@/lib/api/group-discussion";

const MODEL_AVATARS: Record<string, string> = {
  "gpt-4o": "/avatars/gpt.png",
  "gemini-1.5-pro": "/avatars/gemini.png",
  "claude-3-opus": "/avatars/claude.png",
  "grok-2": "/avatars/grok.png",
  "cleus-uncensored": "/avatars/cleus.png",
};

export function GroupDiscussion() {
  const [prompt, setPrompt] = useState("");
  const [selectedModels, setSelectedModels] = useState<Model[]>([
    "gpt-4o",
    "gemini-1.5-pro",
    "claude-3-opus",
  ]);
  const [messages, setMessages] = useState<GroupDiscussionMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [consensus, setConsensus] = useState<string | null>(null);

  const toggleModel = (model: Model) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  const handleStart = async () => {
    if (!prompt.trim() || selectedModels.length < 2) return;
    setMessages([]);
    setConsensus(null);
    setIsRunning(true);

    await startGroupDiscussion({
      prompt,
      models: selectedModels,
      onMessage: (msg) => setMessages((prev) => [...prev, msg]),
      onConsensus: (text) => {
        setConsensus(text);
        setIsRunning(false);
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Group Discussion Mode</h2>
        <p className="text-sm text-zinc-400">
          Ask one question and watch multiple AI models debate and reach a consensus.
        </p>
      </div>

      {/* Model Selection */}
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_MODELS.filter((m) => m.id !== "cleus-uncensored").map((m) => (
          <button
            key={m.id}
            onClick={() => toggleModel(m.id as Model)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedModels.includes(m.id as Model)
                ? "bg-violet-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Prompt Input */}
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleStart()}
          placeholder="Ask a question to all models..."
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
        />
        <button
          onClick={handleStart}
          disabled={isRunning || !prompt.trim() || selectedModels.length < 2}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-lg font-medium transition-colors"
        >
          {isRunning ? "Discussing..." : "Start"}
        </button>
      </div>

      {/* Discussion Feed */}
      <AnimatePresence>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800"
          >
            <img
              src={MODEL_AVATARS[msg.model] ?? "/avatars/default.png"}
              alt={msg.model}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div className="space-y-1">
              <p className="text-xs font-medium text-violet-400">{msg.model}</p>
              <p className="text-sm text-zinc-300">{msg.content}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Consensus */}
      {consensus && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-xl bg-violet-950/50 border border-violet-700"
        >
          <p className="text-xs font-semibold text-violet-400 mb-2 uppercase tracking-wider">
            Consensus
          </p>
          <p className="text-sm text-white leading-relaxed">{consensus}</p>
        </motion.div>
      )}
    </div>
  );
}
