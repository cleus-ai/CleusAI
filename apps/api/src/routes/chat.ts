import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { prisma } from "../utils/prisma";
import { streamChat } from "../services/ai-provider.service";

export const chatRouter = Router();
chatRouter.use(authenticate);

const streamSchema = z.object({ conversationId: z.string(), content: z.string().min(1), model: z.string() });

chatRouter.post("/stream", validate(streamSchema), async (req: any, res, next) => {
  try {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");

    const { conversationId, content, model } = req.body;
    const conversation = await prisma.conversation.findFirst({ where: { id: conversationId, userId: req.userId }, include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } } });
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });

    await prisma.message.create({ data: { conversationId, role: "user", content } });

    let fullContent = "";
    await streamChat({
      model: model as any,
      messages: [...conversation.messages, { id: "tmp", role: "user", content, createdAt: new Date().toISOString() }] as any,
      onChunk: (chunk) => { fullContent += chunk; res.write(chunk); },
    });

    await prisma.message.create({ data: { conversationId, role: "assistant", content: fullContent, model } });
    res.end();
  } catch (e) { next(e); }
});

chatRouter.get("/conversations", async (req: any, res, next) => {
  try {
    const conversations = await prisma.conversation.findMany({ where: { userId: req.userId }, orderBy: { updatedAt: "desc" }, take: 50, select: { id: true, title: true, model: true, updatedAt: true } });
    res.json(conversations);
  } catch (e) { next(e); }
});

chatRouter.post("/conversations", async (req: any, res, next) => {
  try {
    const conv = await prisma.conversation.create({ data: { userId: req.userId, title: req.body.title ?? "New Chat", model: req.body.model ?? "cleus-uncensored" } });
    res.status(201).json(conv);
  } catch (e) { next(e); }
});

chatRouter.delete("/conversations/:id", async (req: any, res, next) => {
  try {
    await prisma.conversation.deleteMany({ where: { id: req.params.id, userId: req.userId } });
    res.json({ success: true });
  } catch (e) { next(e); }
});
