// ============================================================
// Shared types used across web and api
// ============================================================

export type Model =
  | "cleus-uncensored"
  | "gpt-4o"
  | "gpt-4o-mini"
  | "o1-preview"
  | "claude-3-opus"
  | "claude-3-sonnet"
  | "claude-3-haiku"
  | "gemini-1.5-pro"
  | "gemini-1.5-flash"
  | "llama-3-70b"
  | "grok-2";

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  model?: Model;
  attachments?: string[];
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: Model;
  createdAt: string;
  updatedAt: string;
}

export interface GroupDiscussionMessage {
  model: Model;
  content: string;
  role: "debate" | "critique" | "consensus";
  createdAt: string;
}

export interface AICharacter {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
  personality: string;
  isPublic: boolean;
}

export interface StoryConfig {
  title: string;
  plot: string;
  style: "default" | "novel" | "screenplay" | "dialogue" | "comic";
  generationMode: "full" | "chapter-by-chapter";
  characters: Array<{ name: string; description: string }>;
  places: Array<{ name: string; description: string }>;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  category: string;
}

export interface ImageGenRequest {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: string;
  style?: string;
  numImages?: number;
}

export interface VideoGenRequest {
  prompt: string;
  duration?: number;
  style?: string;
  referenceImageUrl?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  plan: "FREE" | "PRO" | "ENTERPRISE";
  credits: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}
