import { NextFunction, Request, Response } from "express";
import User from "@/models/user.model";
import { AppError } from "@/utils/app-error";
import { verifyToken } from "@/utils/jwt-token";

export async function protect(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const bearerToken = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const token = req.cookies.token || bearerToken;

  if (!token) {
    throw new AppError("Unauthorized", 401);
  }

  const decoded = verifyToken(token);

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  req.user = user;

  next();
}
