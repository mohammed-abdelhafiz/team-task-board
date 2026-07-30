import { api } from "@/lib/axios";
import type { TaskPayload, TaskPriority, TaskStatus } from "@/types/task";

export const getTasks = async (
  projectId: string,
  filters: { status?: TaskStatus; priority?: TaskPriority; assignedTo?: string } = {},
) => (await api.get(`/projects/${projectId}/tasks`, { params: filters })).data;

export const createTask = async (projectId: string, data: TaskPayload) =>
  (await api.post(`/projects/${projectId}/tasks`, data)).data;

export const updateTask = async (projectId: string, taskId: string, data: Partial<TaskPayload>) =>
  (await api.patch(`/projects/${projectId}/tasks/${taskId}`, data)).data;

export const deleteTask = async (projectId: string, taskId: string) =>
  (await api.delete(`/projects/${projectId}/tasks/${taskId}`)).data;
