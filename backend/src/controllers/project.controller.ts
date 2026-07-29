import { Request, Response } from "express";

import * as projectService from "@/services/project.service";
import {
  AddMemberSchema,
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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await projectService.getProjects(req.user._id, page, limit);

  res.status(200).json({
    success: true,
    ...result,
  });
}

export async function getProject(req: Request, res: Response) {
  const project = await projectService.getProjectById(
    req.params.projectId as string,
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
    req.params.projectId as string,
    req.user,
    data,
  );

  res.status(200).json({
    success: true,
    project,
  });
}

export async function deleteProject(req: Request, res: Response) {
  await projectService.deleteProject(req.params.projectId as string, req.user);

  res.status(204).send();
}

export async function addMember(req: Request, res: Response) {
  const data = AddMemberSchema.parse(req.body);

  const project = await projectService.addMember(
    req.params.projectId as string,
    req.user._id,
    data,
  );

  res.status(200).json({
    success: true,
    project,
  });
}

export async function removeMember(req: Request, res: Response) {
  const project = await projectService.removeMember(
    req.params.projectId as string,
    req.user._id,
    req.params.userId as string,
  );

  res.status(200).json({
    success: true,
    project,
  });
}