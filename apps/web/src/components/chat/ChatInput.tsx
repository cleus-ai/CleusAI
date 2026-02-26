"use client";
import { useState, useRef } from "react";
import { Send, Paperclip, X } from "lucide-react";

interface ChatInputProps { onSend: (content: string, attachments?: File[]) => void; disabled?: boolean; }

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!value.trim() && files.length === 0) return;
    onSend(value, files.length > 0 ? files : undefined);
    setValue("");
    setFiles([]);
  };

  return (
    <div className="p-4 border-t border-zinc-800">
      {files.length > 0 && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded-lg text-xs text-zinc-300">
              {f.name}
              <button onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}><X className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2 items-end">
        <button onClick={() => fileRef.current?.click()} className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
          <Paperclip className="w-5 h-5" />
        </button>
        <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
        <textarea value={value} onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          rows={1} placeholder="Message Cleus..." disabled={disabled}
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-violet-500 text-sm" />
        <button onClick={handleSend} disabled={disabled || (!value.trim() && files.length === 0)}
          className="p-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-xl transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
