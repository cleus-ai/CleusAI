import type { VideoGenRequest } from "@cleus/shared";

interface VideoGenResult { url: string; jobId: string; }
interface VideoGenParams extends VideoGenRequest { onStatusChange?: (status: string) => void; }

export async function generateVideo(params: VideoGenParams): Promise<VideoGenResult> {
  const { onStatusChange, ...body } = params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/generate`, {
    method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Video generation failed");
  const { jobId } = await res.json();

  // Poll for completion
  return new Promise((resolve, reject) => {
    const poll = setInterval(async () => {
      try {
        const statusRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/status/${jobId}`, { credentials: "include" });
        const { status, url } = await statusRes.json();
        onStatusChange?.(status);
        if (status === "COMPLETED") { clearInterval(poll); resolve({ url, jobId }); }
        if (status === "FAILED") { clearInterval(poll); reject(new Error("Video generation failed")); }
      } catch (e) { clearInterval(poll); reject(e); }
    }, 3000);
  });
}
