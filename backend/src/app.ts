import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import authRoutes from "@/routes/auth.routes";

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

// Error Handling Middleware
app.use(errorHandler);

export default app;
