import express from "express";
import {
  createTask,
  getTasks,
  deleteTaskById,
  updateTask,
} from "../controllers/tasks.js";

const router = express.Router();

router.post("/createtask", createTask);
router.get("/gettask", getTasks);
router.post("/updatetask/:id", updateTask);

//route delete task
router.delete("/deletetask/:id", deleteTaskById);

//update task

export default router;
