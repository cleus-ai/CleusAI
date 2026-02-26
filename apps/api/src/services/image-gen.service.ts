import Replicate from "replicate";
import { logger } from "../utils/logger";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export interface ImageGenParams {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: string;
  style?: string;
  numImages?: number;
  model?: "flux-1.1-pro" | "sdxl" | "nanobanana-pro";
}

const STYLE_SUFFIX_MAP: Record<string, string> = {
  Anime: ", anime style, highly detailed, vibrant colors",
  Cyberpunk: ", cyberpunk aesthetic, neon lights, dark atmosphere",
  "Oil Painting": ", oil painting, brushstrokes, classical art style",
  Sketch: ", pencil sketch, black and white, detailed linework",
  Cinematic: ", cinematic lighting, anamorphic lens, film grain",
  Minimalist: ", minimalist, clean lines, negative space",
};

const ASPECT_MAP: Record<string, { width: number; height: number }> = {
  "1:1":  { width: 1024, height: 1024 },
  "16:9": { width: 1280, height: 720 },
  "9:16": { width: 720,  height: 1280 },
  "4:3":  { width: 1024, height: 768 },
};

export async function generateImages(params: ImageGenParams): Promise<string[]> {
  const {
    prompt,
    negativePrompt = "",
    aspectRatio = "1:1",
    style = "Photorealistic",
    numImages = 1,
    model = "flux-1.1-pro",
  } = params;

  const styleSuffix = STYLE_SUFFIX_MAP[style] ?? "";
  const enhancedPrompt = prompt + styleSuffix;
  const dimensions = ASPECT_MAP[aspectRatio] ?? ASPECT_MAP["1:1"];

  logger.info(`Generating ${numImages} image(s) with model=${model}, prompt="${enhancedPrompt.slice(0, 80)}..."`);

  const replicateModel =
    model === "flux-1.1-pro"
      ? "black-forest-labs/flux-1.1-pro"
      : model === "nanobanana-pro"
      ? "cleus-ai/nanobanana-pro:latest"
      : "stability-ai/sdxl:39ed52f2319f9daed17f04db5e2d63f94ef3f59b";

  const outputs = await Promise.all(
    Array.from({ length: numImages }, () =>
      replicate.run(replicateModel as `${string}/${string}`, {
        input: {
          prompt: enhancedPrompt,
          negative_prompt: negativePrompt,
          width: dimensions.width,
          height: dimensions.height,
          num_inference_steps: 30,
          guidance_scale: 7.5,
        },
      })
    )
  );

  return outputs.flat().map(String).filter(Boolean);
}
