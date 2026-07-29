import type { CreateProjectDto } from "@/schema/project.schema";
import axios from "axios";

export const getProjects = async (page: number, limit: number = 1) => {
  const response = await axios.get(
    `/api/projects?limit=${limit}&page=${page}`,
  );
  return response.data;
};

export const createProject = async (project: CreateProjectDto) => {
  const response = await axios.post("/api/projects", project);
  return response.data;
};