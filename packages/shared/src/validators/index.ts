import { z } from "zod";
export const emailSchema = z.string().email("Invalid email address");
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Must contain uppercase").regex(/[0-9]/, "Must contain number");
export const usernameSchema = z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, hyphens and underscores");
export const promptSchema = z.string().min(1, "Prompt is required").max(4000, "Prompt too long");
