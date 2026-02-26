type EventName = "chat_message" | "image_generated" | "video_generated" | "story_created" | "character_created" | "group_discussion_started" | "subscription_started";

interface TrackParams { event: EventName; userId?: string; properties?: Record<string, unknown>; }

export async function track({ event, userId, properties }: TrackParams) {
  if (process.env.NODE_ENV !== "production") { console.log(`[Analytics] ${event}`, { userId, ...properties }); return; }
  // Production: send to PostHog / Mixpanel / Segment
  await fetch(`${process.env.ANALYTICS_URL}/capture`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, distinct_id: userId ?? "anonymous", properties: { ...properties, $timestamp: new Date().toISOString() } }),
  });
}
