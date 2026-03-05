import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleTask,
} from "../controllers/task.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/:id/toggle", toggleTask);

export default router;