import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";

export const authRouter = Router();

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
const registerSchema = z.object({ email: z.string().email(), username: z.string().min(3).max(30), password: z.string().min(8) });

authRouter.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existing) return res.status(409).json({ error: "Email or username already taken" });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, username, passwordHash } });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({ id: user.id, email: user.email, username: user.username, plan: user.plan, credits: user.credits });
  } catch (e) { next(e); }
});

authRouter.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) return res.status(401).json({ error: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ id: user.id, email: user.email, username: user.username, plan: user.plan, credits: user.credits });
  } catch (e) { next(e); }
});

authRouter.post("/logout", (req, res) => { res.clearCookie("token"); res.json({ success: true }); });
authRouter.get("/me", authenticate, async (req: any, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { id: true, email: true, username: true, avatarUrl: true, plan: true, credits: true } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (e) { next(e); }
});
