import { TaskPriority, TaskStatus } from "@/constants/enums";
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),

  priority: z.enum(TaskPriority).optional(),
  assignedTo: z.string().optional(),

  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = createTaskSchema
  .extend({
    status: z.enum(TaskStatus).optional(),
  })
  .partial();

export const taskQuerySchema = z.object({
  status: z.enum(TaskStatus).optional(),
  priority: z.enum(TaskPriority).optional(),
  assignedTo: z.string().optional(),
  search: z.string().trim().max(100).optional(),
  sort: z.enum(["createdAt", "dueDate"]).default("createdAt"),

  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),
});

export type TaskQueryDto = z.infer<typeof taskQuerySchema>;

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
