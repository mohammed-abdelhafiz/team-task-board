import { Types } from "mongoose";

import Project from "@/models/project.model";
import Task from "@/models/task.model";
import { AppError } from "@/utils/app-error";
import { CreateTaskDto, UpdateTaskDto } from "@/validators/task.validator";
import { ITask } from "@/models/task.model";
import { TaskQueryDto } from "@/validators/task.validator";
import TaskAudit from "@/models/task-audit.model";
import { emitProjectUpdate } from "@/config/socket";

async function getAccessibleProject(projectId: string, userId: Types.ObjectId) {
  if (!Types.ObjectId.isValid(projectId)) {
    throw new AppError("Invalid project id", 400);
  }

  const project = await Project.findById(projectId);
  if (!project) throw new AppError("Project not found", 404);
  if (!project.members.some((member) => member.equals(userId))) {
    throw new AppError("You are not a member of this project", 403);
  }
  return project;
}

export async function createTask(
  projectId: string,
  userId: Types.ObjectId,
  data: CreateTaskDto,
) {
  const project = await getAccessibleProject(projectId, userId);

  if (data.assignedTo && !project.members.some((member) => member.equals(data.assignedTo))) {
    throw new AppError("Assigned user is not a member of this project", 400);
  }

  const task = await Task.create({
    ...data,
    project: project._id,
    createdBy: userId,
  });

  await TaskAudit.create({ task: task._id, project: project._id, changedBy: userId, toStatus: task.status });
  emitProjectUpdate(project._id.toString());

  return task;
}

export async function getTasks(
  projectId: string,
  userId: Types.ObjectId,
  query: TaskQueryDto,
) {
  const project = await getAccessibleProject(projectId, userId);

  const filter: {
    project: Types.ObjectId;
    status?: typeof query.status;
    priority?: typeof query.priority;
    assignedTo?: Types.ObjectId;
    $or?: Array<{ title: RegExp } | { description: RegExp }>;
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

  if (query.search) {
    const search = new RegExp(query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ title: search }, { description: search }];
  }

  const skip = (query.page - 1) * query.limit;
  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate("assignedTo", "fullName email")
      .populate("createdBy", "fullName email")
      .sort(query.sort === "dueDate" ? { dueDate: 1, createdAt: -1 } : { createdAt: -1 })
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
  const project = await getAccessibleProject(projectId, userId);

  if (!Types.ObjectId.isValid(taskId)) {
    throw new AppError("Invalid task id", 400);
  }

  const task = await Task.findOne({
    _id: taskId,
    project: project._id,
  })
    .populate("assignedTo", "fullName email")
    .populate("createdBy", "fullName email");

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
  const project = await getAccessibleProject(projectId, userId);

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

  const fromStatus = task.status;
  Object.assign(task, data);

  await task.save();

  if (data.status && data.status !== fromStatus) {
    await TaskAudit.create({ task: task._id, project: project._id, changedBy: userId, fromStatus, toStatus: data.status });
  }
  emitProjectUpdate(project._id.toString());

  return task.populate([
    {
      path: "assignedTo",
      select: "fullName email",
    },
    {
      path: "createdBy",
      select: "fullName email",
    },
  ]);
}

export async function deleteTask(
  projectId: string,
  taskId: string,
  userId: Types.ObjectId,
) {
  const project = await getAccessibleProject(projectId, userId);

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

  emitProjectUpdate(project._id.toString());

  return;
}

export async function getTaskAudit(projectId: string, taskId: string, userId: Types.ObjectId) {
  const project = await getAccessibleProject(projectId, userId);
  if (!Types.ObjectId.isValid(taskId)) throw new AppError("Invalid task id", 400);
  const task = await Task.exists({ _id: taskId, project: project._id });
  if (!task) throw new AppError("Task not found", 404);
  return TaskAudit.find({ task: taskId }).populate("changedBy", "fullName email").sort({ createdAt: -1 });
}
