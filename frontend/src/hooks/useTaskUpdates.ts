import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

export function useTaskUpdates(projectId: string) {
  const client = useQueryClient();
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || undefined;
    const socket = io(socketUrl, { withCredentials: true });
    socket.emit("project:join", projectId);
    socket.on("tasks:changed", () => client.invalidateQueries({ queryKey: ["tasks", projectId] }));
    return () => { socket.disconnect(); };
  }, [client, projectId]);
}
