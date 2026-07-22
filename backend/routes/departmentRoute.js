import express from "express";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getDepartments);
router.post("/", authenticateToken, isAdmin, createDepartment);
router.put("/:id", authenticateToken, isAdmin, updateDepartment);
router.delete("/:id", authenticateToken, isAdmin, deleteDepartment);

export default router;
