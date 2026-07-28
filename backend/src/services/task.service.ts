import { Types } from "mongoose";

import Project from "@/models/project.model";
import Task from "@/models/task.model";
import { AppError } from "@/utils/app-error";
import { CreateTaskDto, UpdateTaskDto } from "@/validators/task.validator";
import { ITask } from "@/models/task.model";
import { TaskQueryDto } from "@/validators/task.validator";

export async function createTask(
  projectId: string,
  userId: Types.ObjectId,
  data: CreateTaskDto,
) {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const isMember = project.members.some((member) => member.equals(userId));

  if (!isMember) {
    throw new AppError("You are not a member of this project", 403);
  }

  const task = await Task.create({
    ...data,
    project: project._id,
    createdBy: userId,
  });

  return task;
}

export async function getTasks(
  projectId: string,
  userId: Types.ObjectId,
  query: TaskQueryDto,
) {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const isMember = project.members.some((member) => member.equals(userId));

  if (!isMember) {
    throw new AppError("You are not a member of this project", 403);
  }

  const filter: {
    project: Types.ObjectId;
    status?: typeof query.status;
    priority?: typeof query.priority;
    assignedTo?: Types.ObjectId;
  } = {
    project: project._id,
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.priority) {
    filter.priority = query.priority;
  }

  if (query.assignedTo) {
    if (!Types.ObjectId.isValid(query.assignedTo)) {
      throw new AppError("Invalid assignedTo id", 400);
    }

    filter.assignedTo = new Types.ObjectId(query.assignedTo);
  }

  const skip = (query.page - 1) * query.limit;
  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(query.limit),

    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      pages: Math.ceil(total / query.limit),
    },
  };
}

export async function getTaskById(
  projectId: string,
  taskId: string,
  userId: Types.ObjectId,
) {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const isMember = project.members.some((member) => member.equals(userId));

  if (!isMember) {
    throw new AppError("You are not a member of this project", 403);
  }

  if (!Types.ObjectId.isValid(taskId)) {
    throw new AppError("Invalid task id", 400);
  }

  const task = await Task.findOne({
    _id: taskId,
    project: project._id,
  })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
}

export async function updateTask(
  projectId: string,
  taskId: string,
  userId: Types.ObjectId,
  data: UpdateTaskDto,
) {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const isMember = project.members.some((member) => member.equals(userId));

  if (!isMember) {
    throw new AppError("You are not a member of this project", 403);
  }

  if (!Types.ObjectId.isValid(taskId)) {
    throw new AppError("Invalid task id", 400);
  }

  const task = await Task.findOne({
    _id: taskId,
    project: project._id,
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  if (data.assignedTo) {
    if (!Types.ObjectId.isValid(data.assignedTo)) {
      throw new AppError("Invalid assignedTo id", 400);
    }

    const isAssignedMember = project.members.some((member) =>
      member.equals(data.assignedTo),
    );

    if (!isAssignedMember) {
      throw new AppError("Assigned user is not a member of this project", 400);
    }
  }

  Object.assign(task, data);

  await task.save();

  return task.populate([
    {
      path: "assignedTo",
      select: "name email",
    },
    {
      path: "createdBy",
      select: "name email",
    },
  ]);
}

export async function deleteTask(
  projectId: string,
  taskId: string,
  userId: Types.ObjectId,
) {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const isMember = project.members.some((member) => member.equals(userId));

  if (!isMember) {
    throw new AppError("You are not a member of this project", 403);
  }

  if (!Types.ObjectId.isValid(taskId)) {
    throw new AppError("Invalid task id", 400);
  }

  const task = await Task.findOneAndDelete({
    _id: taskId,
    project: project._id,
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return;
}
