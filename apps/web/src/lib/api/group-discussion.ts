import type { GroupDiscussionMessage, Model } from "@cleus/shared";

interface StartDiscussionParams {
  prompt: string;
  models: Model[];
  onMessage: (msg: GroupDiscussionMessage) => void;
  onConsensus: (text: string) => void;
}

export async function startGroupDiscussion({ prompt, models, onMessage, onConsensus }: StartDiscussionParams) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group-discussion/start`, {
    method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
    body: JSON.stringify({ prompt, models }),
  });
  if (!response.ok || !response.body) throw new Error("Failed to start discussion");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = decoder.decode(value).split("\n").filter(Boolean);
    for (const line of lines) {
      try {
        const event = JSON.parse(line);
        if (event.type === "message") onMessage(event.data);
        if (event.type === "consensus") onConsensus(event.data);
      } catch {}
    }
  }
}
