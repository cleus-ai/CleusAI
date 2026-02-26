import type { ImageGenRequest } from "@cleus/shared";

export async function generateImage(params: ImageGenRequest): Promise<string[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Image generation failed");
  const data = await res.json();
  return data.urls;
}

export async function editImage(referenceUrl: string, prompt: string): Promise<string> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images/edit`, {
    method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
    body: JSON.stringify({ referenceUrl, prompt }),
  });
  if (!res.ok) throw new Error("Image edit failed");
  const data = await res.json();
  return data.url;
}
