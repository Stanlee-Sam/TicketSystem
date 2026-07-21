import express from "express";
import { createUser, changePassword } from "../controllers/userControllers.js"
import { isAdmin } from "../middleware/adminMiddleware.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", createUser);
router.put("/change-password", changePassword);

export default router;