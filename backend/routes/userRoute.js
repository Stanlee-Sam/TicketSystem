import express from "express";
import { createUser, changePassword, fetchUsers, updateUser, deleteUser, getCurrentUser } from "../controllers/userControllers.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, isAdmin, fetchUsers);
router.get("/me", authenticateToken, getCurrentUser);
router.post("/create", authenticateToken, isAdmin, createUser);
router.put("/change-password", authenticateToken, changePassword);
router.put("/:id", authenticateToken, isAdmin, updateUser);
router.delete("/:id", authenticateToken, isAdmin, deleteUser);

export default router;