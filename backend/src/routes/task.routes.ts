import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";
import * as taskController from "@/controllers/task.controller";

const router = Router({
  mergeParams: true,
});

router.post("/", protect, taskController.createTask);
router.get("/", protect, taskController.getTasks);
router.get("/:taskId", protect, taskController.getTaskById);
router.patch("/:taskId", protect, taskController.updateTask);
router.delete("/:taskId", protect, taskController.deleteTask);

export default router;
