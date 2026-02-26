import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { rateLimiter } from "./middleware/rate-limiter";
import { errorHandler } from "./middleware/error-handler";
import { authRouter } from "./routes/auth";
import { chatRouter } from "./routes/chat";
import { imageRouter } from "./routes/images";
import { videoRouter } from "./routes/videos";
import { storyRouter } from "./routes/story";
import { charactersRouter } from "./routes/characters";
import { newsRouter } from "./routes/news";
import { groupDiscussionRouter } from "./routes/group-discussion";
import { webhookRouter } from "./routes/webhooks";
import { registerSocketHandlers } from "./services/socket.service";
import { logger } from "./utils/logger";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: process.env.FRONTEND_URL ?? "http://localhost:3000", credentials: true },
});

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(rateLimiter);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/images", imageRouter);
app.use("/api/videos", videoRouter);
app.use("/api/story", storyRouter);
app.use("/api/characters", charactersRouter);
app.use("/api/news", newsRouter);
app.use("/api/group-discussion", groupDiscussionRouter);
app.use("/api/webhooks", webhookRouter);

// Health check
app.get("/health", (_, res) => res.json({ status: "ok", ts: new Date().toISOString() }));

// Error handler (must be last)
app.use(errorHandler);

// Socket.IO
registerSocketHandlers(io);

const PORT = process.env.PORT ?? 8080;
httpServer.listen(PORT, () => logger.info(`API server running on port ${PORT}`));

export { io };
