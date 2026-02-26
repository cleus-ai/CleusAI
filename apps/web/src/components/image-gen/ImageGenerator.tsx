"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Wand2, RefreshCw } from "lucide-react";
import { generateImage } from "@/lib/api/image-gen";

const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3"] as const;
const STYLE_PRESETS = [
  "Photorealistic",
  "Anime",
  "Cyberpunk",
  "Oil Painting",
  "Sketch",
  "Cinematic",
  "Minimalist",
] as const;

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");
  const [style, setStyle] = useState<string>("Photorealistic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [numImages, setNumImages] = useState(1);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const images = await generateImage({
        prompt,
        negativePrompt,
        aspectRatio,
        style,
        numImages,
      });
      setGeneratedImages(images);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-full">
      {/* Controls */}
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="Describe the image you want to create..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Negative Prompt</label>
          <input
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="What to avoid..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Style</label>
          <div className="flex flex-wrap gap-2">
            {STYLE_PRESETS.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  style === s
                    ? "bg-violet-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
            >
              {ASPECT_RATIOS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Number of Images: {numImages}
            </label>
            <input
              type="range"
              min={1}
              max={4}
              value={numImages}
              onChange={(e) => setNumImages(Number(e.target.value))}
              className="w-full accent-violet-500"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-xl font-semibold transition-colors"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              Generate
            </>
          )}
        </button>
      </div>

      {/* Output */}
      <div className="space-y-4">
        {isGenerating && (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: numImages }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-zinc-900 border border-zinc-800 animate-pulse"
              />
            ))}
          </div>
        )}
        {!isGenerating && generatedImages.length > 0 && (
          <div className={`grid gap-3 ${numImages > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            {generatedImages.map((url, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group rounded-xl overflow-hidden"
              >
                <img src={url} alt={`Generated ${i}`} className="w-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <a
                    href={url}
                    download={`cleus-gen-${i}.png`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-sm rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {!isGenerating && generatedImages.length === 0 && (
          <div className="flex items-center justify-center h-64 rounded-xl bg-zinc-900/50 border border-dashed border-zinc-700">
            <p className="text-zinc-500 text-sm">Your generated images will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
