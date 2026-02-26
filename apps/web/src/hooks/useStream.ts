import { useState, useCallback } from "react";
export function useStream() {
  const [content, setContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const startStream = useCallback(async (url: string, body: object) => {
    setContent(""); setIsStreaming(true);
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!response.body) throw new Error("No stream body");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let full = "";
    while (true) { const { done, value } = await reader.read(); if (done) break; const c = decoder.decode(value); full += c; setContent(p => p + c); }
    setIsStreaming(false);
    return full;
  }, []);
  return { content, isStreaming, startStream, reset: () => setContent("") };
}
