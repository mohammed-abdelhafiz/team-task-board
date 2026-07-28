import { Types } from "mongoose";

import Project from "@/models/project.model";
import {
  CreateProjectDto,
  UpdateProjectDto,
} from "@/validators/project.validator";
import { AppError } from "@/utils/app-error";
import { authorizeProjectManagement } from "@/utils/project-permission";
import { IUser } from "@/models/user.model";

export async function createProject(
  userId: Types.ObjectId,
  data: CreateProjectDto,
) {
  const project = await Project.create({
    title: data.title,
    description: data.description,
    owner: userId,
    members: [userId],
  });

  return project;
}

export async function getProjects(userId: Types.ObjectId) {
  return Project.find({
    members: userId,
  })
    .populate("owner", "fullName email")
    .sort({ createdAt: -1 });
}

export async function getProjectById(
  projectId: string,
  userId: Types.ObjectId,
) {
  const project = await Project.findOne({
    _id: projectId,
    members: userId,
  })
    .populate("owner", "fullName email")
    .populate("members", "fullName email");

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
}

export async function updateProject(
  projectId: string,
  user: IUser,
  data: UpdateProjectDto,
) {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  authorizeProjectManagement(project, user);

  Object.assign(project, data);

  await project.save();

  return project;
}

export async function deleteProject(projectId: string, user: IUser) {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  authorizeProjectManagement(project, user);

  await project.deleteOne();
}
