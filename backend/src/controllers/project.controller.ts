import { Request, Response } from "express";

import * as projectService from "@/services/project.service";
import {
  createProjectSchema,
  updateProjectSchema,
} from "@/validators/project.validator";

export async function createProject(req: Request, res: Response) {
  const data = createProjectSchema.parse(req.body);

  const project = await projectService.createProject(req.user._id, data);

  res.status(201).json({
    success: true,
    project,
  });
}

export async function getProjects(req: Request, res: Response) {
  const projects = await projectService.getProjects(req.user._id);

  res.status(200).json({
    success: true,
    count: projects.length,
    projects,
  });
}

export async function getProject(req: Request, res: Response) {
  const project = await projectService.getProjectById(
    req.params.id as string,
    req.user._id,
  );

  res.json({
    success: true,
    project,
  });
}

export async function updateProject(req: Request, res: Response) {
  const data = updateProjectSchema.parse(req.body);

  const project = await projectService.updateProject(
    req.params.id as string,
    req.user,
    data,
  );

  res.status(200).json({
    success: true,
    project,
  });
}

export async function deleteProject(req: Request, res: Response) {
  await projectService.deleteProject(req.params.id as string, req.user);

  res.status(204).send();
}
