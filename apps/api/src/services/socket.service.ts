import { Server } from "socket.io";
import { logger } from "../utils/logger";

export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);
    socket.on("join:conversation", (conversationId: string) => socket.join(`conv:${conversationId}`));
    socket.on("leave:conversation", (conversationId: string) => socket.leave(`conv:${conversationId}`));
    socket.on("disconnect", () => logger.info(`Socket disconnected: ${socket.id}`));
  });
}
