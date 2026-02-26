"use client";
import { useState } from "react";
import { Play, Loader2, Film } from "lucide-react";
import { generateVideo } from "@/lib/api/video-gen";

const DURATION_OPTIONS = [5, 10, 15, 30];
const STYLES = ["Cinematic", "Anime", "Documentary", "Surrealist", "Noir"];

export function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(10);
  const [style, setStyle] = useState("Cinematic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "queued" | "processing" | "done" | "error">("idle");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setStatus("queued");
    setVideoUrl(null);
    try {
      const result = await generateVideo({ prompt, duration, style,
        onStatusChange: (s) => setStatus(s as typeof status) });
      setVideoUrl(result.url);
      setJobId(result.jobId);
      setStatus("done");
    } catch { setStatus("error"); }
    finally { setIsGenerating(false); }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2"><Film className="w-5 h-5 text-violet-400" />Video Generation</h2>
        <p className="text-sm text-zinc-400">Turn your text descriptions into cinematic videos.</p>
      </div>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3}
        placeholder="Describe your video scene in detail..."
        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 resize-none" />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Duration</label>
          <div className="flex gap-2">
            {DURATION_OPTIONS.map((d) => (
              <button key={d} onClick={() => setDuration(d)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${duration === d ? "bg-violet-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>
                {d}s
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Style</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500">
            {STYLES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()}
        className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-xl font-semibold transition-colors">
        {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" />{status === "queued" ? "Queued..." : "Processing..."}</> : <><Play className="w-4 h-4" />Generate Video</>}
      </button>
      {videoUrl && <video src={videoUrl} controls className="w-full rounded-xl border border-zinc-800" />}
    </div>
  );
}
