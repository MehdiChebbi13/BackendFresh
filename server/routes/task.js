import express from "express";
import { createTask, getTasks } from "../controllers/tasks.js";

const router = express.Router();

router.post("/createtask", createTask);
router.get("/gettask", getTasks);

export default router;
