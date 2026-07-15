import express from "express";
import { createUser, changePassword } from "../controllers/userControllers.js"

const router = express.Router();

router.post("/create", createUser);
router.put("/change-password", changePassword);

export default router;