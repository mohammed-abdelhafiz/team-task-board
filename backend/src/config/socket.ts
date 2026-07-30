import { Server } from "socket.io";

let io: Server | undefined;

export function setSocketServer(server: Server) {
  io = server;
}

export function emitProjectUpdate(projectId: string) {
  io?.to(`project:${projectId}`).emit("tasks:changed", { projectId });
}
