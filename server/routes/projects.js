import express from "express";
import { getProjects } from "../controllers/projects.js";

const router = express.Router();

router.get("/getproject", getProjects);

export default router;
