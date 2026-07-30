import "dotenv/config";

import app from "./app";
import { connectDB } from "./config/db";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { setSocketServer } from "@/config/socket";
import { verifyToken } from "@/utils/jwt-token";
import User from "@/models/user.model";
import Project from "@/models/project.model";
import { Types } from "mongoose";

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  const httpServer = createServer(app);
  const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL || true, credentials: true } });
  io.use(async (socket, next) => {
    try {
      const cookieToken = socket.handshake.headers.cookie?.match(/(?:^|;\s*)token=([^;]+)/)?.[1];
      const token = cookieToken || socket.handshake.auth.token;
      if (typeof token !== "string") return next(new Error("Unauthorized"));
      const user = await User.findById(verifyToken(token).userId);
      if (!user) return next(new Error("Unauthorized"));
      socket.data.userId = user._id.toString();
      next();
    } catch { next(new Error("Unauthorized")); }
  });
  io.on("connection", (socket) => socket.on("project:join", async (projectId: string) => {
    if (!Types.ObjectId.isValid(projectId)) return;
    const project = await Project.exists({ _id: projectId, members: socket.data.userId });
    if (project) socket.join(`project:${projectId}`);
  }));
  setSocketServer(io);
  httpServer.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
