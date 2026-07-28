import { Request, Response } from "express";

import * as authService from "@/services/auth.service";

import { loginSchema, registerSchema } from "@/validators/auth.validator";

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);

  const { user, token } = await authService.register(data);

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    .status(201)
    .json({
      success: true,
      user,
    });
}

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);

  const { user, token } = await authService.login(data);

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    .status(200)
    .json({
      success: true,
      user,
    });
}

export async function me(req: Request, res: Response) {
  res.json({
    success: true,
    user: req.user,
  });
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("token");

  res.json({
    success: true,
    message: "Logged out successfully",
  });
}
