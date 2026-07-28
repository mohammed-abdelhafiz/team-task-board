import { Request, Response } from "express";

import * as taskService from "@/services/task.service";
import {
  createTaskSchema,
  taskQuerySchema,
  updateTaskSchema,
} from "@/validators/task.validator";

export async function createTask(req: Request, res: Response) {
  const data = createTaskSchema.parse(req.body);

  const task = await taskService.createTask(
    req.params.projectId as string,
    req.user._id,
    data,
  );

  res.status(201).json({
    success: true,
    task,
  });
}

export async function getTasks(req: Request, res: Response) {
  const query = taskQuerySchema.parse(req.query);

  const result = await taskService.getTasks(
    req.params.projectId as string,
    req.user._id,
    query,
  );

  res.json({
    success: true,
    ...result,
  });
}

export async function getTaskById(req: Request, res: Response) {
  const task = await taskService.getTaskById(
    req.params.projectId as string,
    req.params.taskId as string,
    req.user._id,
  );

  res.status(200).json({
    success: true,
    task,
  });
}

export async function updateTask(req: Request, res: Response) {
  const data = updateTaskSchema.parse(req.body);

  const task = await taskService.updateTask(
    req.params.projectId as string,
    req.params.taskId as string,
    req.user._id,
    data,
  );

  res.status(200).json({
    success: true,
    task,
  });
}

export async function deleteTask(req: Request, res: Response) {
  await taskService.deleteTask(
    req.params.projectId as string,
    req.params.taskId as string,
    req.user._id,
  );

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
}
