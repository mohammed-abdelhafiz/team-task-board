import { Types } from "mongoose";
import { z } from "zod";

export const createProjectSchema = z.object({
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
});

export const AddMemberSchema = z.object({
  userId: z.string().refine(Types.ObjectId.isValid, {
    message: "Invalid user id",
  }),
});

export type AddMemberDto = z.infer<typeof AddMemberSchema>;

export type CreateProjectDto = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial();

export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;