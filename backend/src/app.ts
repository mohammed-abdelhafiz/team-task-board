import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import authRoutes from "@/routes/auth.routes";
import projectRoutes from "@/routes/project.routes";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Health Check
app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Team Task Board API 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
