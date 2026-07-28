import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";
import * as projectController from "@/controllers/project.controller";

const router = Router();

router.post("/", protect, projectController.createProject);
router.get("/", protect, projectController.getProjects);
router.get("/:projectId", protect, projectController.getProject);

router.patch("/:projectId", protect, projectController.updateProject);

router.delete("/:projectId", protect, projectController.deleteProject);

router.post("/:projectId/members", protect, projectController.addMember);

router.delete(
  "/:projectId/members/:userId",
  protect,
  projectController.removeMember,
);

export default router;
