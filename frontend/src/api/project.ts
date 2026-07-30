import type { CreateProjectDto } from "@/schema/project.schema";
import { api } from "@/lib/axios";

export const getProjects = async (page: number, limit: number = 1) => {
  const response = await api.get(`/projects?limit=${limit}&page=${page}`);
  return response.data;
};

export const createProject = async (project: CreateProjectDto) => {
  const response = await api.post("/projects", project);
  return response.data;
};

export const getProject = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

export const updateProject = async (projectId: string, data: { title?: string; description?: string }) =>
  (await api.patch(`/projects/${projectId}`, data)).data;

export const deleteProject = async (projectId: string) =>
  (await api.delete(`/projects/${projectId}`)).data;

export const addProjectMember = async (projectId: string, email: string) =>
  (await api.post(`/projects/${projectId}/members`, { email })).data;

export const removeProjectMember = async (projectId: string, userId: string) =>
  (await api.delete(`/projects/${projectId}/members/${userId}`)).data;
