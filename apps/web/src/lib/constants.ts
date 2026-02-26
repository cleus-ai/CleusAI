export const AVAILABLE_MODELS = [
  { id: "cleus-uncensored", name: "Cleus (Uncensored)", provider: "cleus", badge: "Flagship" },
  { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "openai" },
  { id: "claude-3-opus", name: "Claude 3 Opus", provider: "anthropic" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "anthropic" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "google" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "google" },
  { id: "llama-3-70b", name: "Llama 3 70B", provider: "meta" },
  { id: "grok-2", name: "Grok 2", provider: "xai" },
] as const;

export const IMAGE_STYLES = ["Photorealistic", "Anime", "Cyberpunk", "Oil Painting", "Sketch", "Cinematic", "Minimalist", "Watercolor", "3D Render"];
export const ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4", "21:9"];
export const MAX_FILE_SIZE_MB = 10;
export const SUPPORTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
