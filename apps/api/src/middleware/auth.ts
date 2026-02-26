import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export async function authenticate(req: any, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token ?? req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Authentication required" });
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
