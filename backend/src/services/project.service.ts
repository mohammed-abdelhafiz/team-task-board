import { Types } from "mongoose";

import Project from "@/models/project.model";
import {
  AddMemberDto,
  CreateProjectDto,
  UpdateProjectDto,
} from "@/validators/project.validator";
import { AppError } from "@/utils/app-error";
import { authorizeProjectManagement } from "@/utils/project-permission";
import User, { IUser } from "@/models/user.model";
import Task from "@/models/task.model";
import TaskAudit from "@/models/task-audit.model";

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

export async function getProjects(
  userId: Types.ObjectId,
  page: number = 1,
  limit: number = 10,
) {
  const skip = (page - 1) * limit;
  const total = await Project.countDocuments({ members: userId });
  const projects = await Project.find({ members: userId })
    .populate("owner", "fullName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(total / limit);
  const nextPage = page < totalPages ? page + 1 : undefined;

  return {
    projects,
    total,
    page,
    limit,
    totalPages,
    nextPage,
  };
}

export async function getProjectById(
  projectId: string,
  userId: Types.ObjectId,
) {
  if (!Types.ObjectId.isValid(projectId)) {
    throw new AppError("Invalid project id", 400);
  }
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
  if (!Types.ObjectId.isValid(projectId)) {
    throw new AppError("Invalid project id", 400);
  }
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
  if (!Types.ObjectId.isValid(projectId)) {
    throw new AppError("Invalid project id", 400);
  }
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  authorizeProjectManagement(project, user);

  await Promise.all([
    project.deleteOne(),
    Task.deleteMany({ project: project._id }),
    TaskAudit.deleteMany({ project: project._id }),
  ]);
}

export async function addMember(
  projectId: string,
  currentUserId: Types.ObjectId,
  data: AddMemberDto,
) {
  if (!Types.ObjectId.isValid(projectId)) {
    throw new AppError("Invalid project id", 400);
  }
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const currentUser = await User.findById(currentUserId);

  if (!currentUser) {
    throw new AppError("User not found", 404);
  }

  authorizeProjectManagement(project, currentUser);

  const user = data.userId
    ? await User.findById(data.userId)
    : await User.findOne({ email: data.email?.toLowerCase() });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const alreadyMember = project.members.some((member) =>
    member.equals(user._id),
  );

  if (alreadyMember) {
    throw new AppError("User is already a member", 400);
  }

  project.members.push(user._id);

  await project.save();

  await project.populate("members", "fullName email");

  return project;
}

export async function removeMember(
  projectId: string,
  currentUserId: Types.ObjectId,
  memberId: string,
) {
  if (!Types.ObjectId.isValid(projectId)) {
    throw new AppError("Invalid project id", 400);
  }
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const currentUser = await User.findById(currentUserId);

  if (!currentUser) {
    throw new AppError("User not found", 404);
  }

  authorizeProjectManagement(project, currentUser);

  if (!Types.ObjectId.isValid(memberId)) {
    throw new AppError("Invalid user id", 400);
  }

  if (project.owner.equals(memberId)) {
    throw new AppError("Project owner cannot be removed", 400);
  }

  const memberObjectId = new Types.ObjectId(memberId);

  const isMember = project.members.some((member) =>
    member.equals(memberObjectId),
  );

  if (!isMember) {
    throw new AppError("User is not a member", 404);
  }

  project.members = project.members.filter(
    (member) => !member.equals(memberObjectId),
  );

  await Promise.all([
    project.save(),
    Task.updateMany(
      { project: project._id, assignedTo: memberObjectId },
      { $unset: { assignedTo: 1 } },
    ),
  ]);

  await project.populate("members", "fullName email");

  return project;
}
