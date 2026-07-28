import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";
import * as projectController from "@/controllers/project.controller";

const router = Router();

router.post("/", protect, projectController.createProject);
router.get("/", protect, projectController.getProjects);
router.get("/:id", protect, projectController.getProject);


router.patch("/:id", protect, projectController.updateProject);

router.delete("/:id", protect, projectController.deleteProject);

export default router;
