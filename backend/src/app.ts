import path from "node:path";
import fs from "node:fs";
import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import authRoutes from "@/routes/auth.routes";
import projectRoutes from "@/routes/project.routes";
import taskRoutes from "@/routes/task.routes";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Health Check
app.get("/api/health", (_, res) => {
  res.json({
    success: true,
    message: "Team Task Board API 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects/:projectId/tasks", taskRoutes);

// Static frontend serving & SPA routing
function getFrontendDistPath(): string {
  if (process.env.FRONTEND_DIST_PATH) {
    return path.resolve(process.env.FRONTEND_DIST_PATH);
  }
  const candidates = [
    path.resolve(__dirname, "../../frontend/dist"),
    path.resolve(__dirname, "../frontend/dist"),
    path.resolve(process.cwd(), "frontend/dist"),
    path.resolve(process.cwd(), "../frontend/dist"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0];
}

const frontendDistPath = getFrontendDistPath();

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api") || req.path.startsWith("/socket.io")) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, "index.html"), (err) => {
      if (err) next(err);
    });
  });
} else {
  app.get("/", (_, res) => {
    res.json({
      success: true,
      message: "Team Task Board API 🚀",
    });
  });
}

// Error Handling Middleware
app.use(errorHandler);

export default app;

