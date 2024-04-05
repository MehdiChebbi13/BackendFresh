import express from "express";
import { getUser } from "../controllers/users.js";
import verifyToken from "../middleware/auth.js";

const Router = express.Router();

// READ
Router.get("/:id", verifyToken, getUser); // Get user by id with token verification middleware

// UPDATE
// Router.patch("/:id", verifyToken, modifyUser);

export default Router;
