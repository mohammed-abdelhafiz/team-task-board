import { IProject } from "@/models/project.model";
import { IUser } from "@/models/user.model";
import { AppError } from "./app-error";
import { UserRole } from "@/constants/enums";

export function authorizeProjectManagement(project: IProject, user: IUser) {
  const isOwner = project.owner.equals(user._id);
  const isAdmin = user.role === UserRole.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new AppError("You are not authorized to perform this action", 403);
  }
}
