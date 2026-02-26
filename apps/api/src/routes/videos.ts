import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { videoQueue } from "../jobs/video.queue";
import { prisma } from "../utils/prisma";

export const videoRouter = Router();
videoRouter.use(authenticate);

videoRouter.post("/generate", validate(z.object({ prompt: z.string().min(3), duration: z.number().optional(), style: z.string().optional() })), async (req: any, res, next) => {
  try {
    const video = await prisma.generatedVideo.create({ data: { userId: req.userId, prompt: req.body.prompt, model: "luma-dream-machine", status: "PENDING" } });
    await videoQueue.add("generate", { videoId: video.id, ...req.body });
    res.json({ jobId: video.id, status: "PENDING" });
  } catch (e) { next(e); }
});

videoRouter.get("/status/:jobId", authenticate, async (req: any, res, next) => {
  try {
    const video = await prisma.generatedVideo.findFirst({ where: { id: req.params.jobId, userId: req.userId } });
    if (!video) return res.status(404).json({ error: "Job not found" });
    res.json({ status: video.status, url: video.videoUrl });
  } catch (e) { next(e); }
});
