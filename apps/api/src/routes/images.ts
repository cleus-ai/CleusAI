import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { generateImages } from "../services/image-gen.service";
import { prisma } from "../utils/prisma";

export const imageRouter = Router();
imageRouter.use(authenticate);

const generateSchema = z.object({
  prompt: z.string().min(3).max(1000),
  negativePrompt: z.string().optional(),
  aspectRatio: z.enum(["1:1", "16:9", "9:16", "4:3", "3:4"]).optional(),
  style: z.string().optional(),
  numImages: z.number().int().min(1).max(4).optional(),
  model: z.enum(["flux-1.1-pro", "sdxl", "nanobanana-pro"]).optional(),
});

imageRouter.post("/generate", validate(generateSchema), async (req: any, res, next) => {
  try {
    const urls = await generateImages(req.body);
    const [w, h] = (req.body.aspectRatio ?? "1:1").split(":").map(Number);
    await prisma.generatedImage.createMany({ data: urls.map((url) => ({ userId: req.userId, prompt: req.body.prompt, imageUrl: url, model: req.body.model ?? "flux-1.1-pro", style: req.body.style, width: w * 100, height: h * 100 })) });
    res.json({ urls });
  } catch (e) { next(e); }
});

imageRouter.get("/history", async (req: any, res, next) => {
  try {
    const images = await prisma.generatedImage.findMany({ where: { userId: req.userId }, orderBy: { createdAt: "desc" }, take: 50 });
    res.json({ images });
  } catch (e) { next(e); }
});
