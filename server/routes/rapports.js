import express from "express";
import {
  deleteRapport,
  createRapport,
  getRapports,
  updateRapport,
} from "../controllers/rapport.js";

const router = express.Router();

router.post("/", createRapport);
router.get("/getReport", getRapports);
router.delete("/deleterapport/:id", deleteRapport);
router.patch("/modify/:id", updateRapport);

export default router;
