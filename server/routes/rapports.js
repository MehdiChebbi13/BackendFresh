import express from "express";
import {
  deleteRapport,
  createRapport,
  getRapports,
} from "../controllers/rapport.js";

const router = express.Router();

router.post("/", createRapport);
router.get("/getReport", getRapports);
router.patch("/deleteRapport", deleteRapport);

export default router;
