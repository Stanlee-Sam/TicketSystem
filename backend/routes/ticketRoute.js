import express from "express";
import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketMetrics,
} from "../controllers/ticketController.js";
import { uploadImages } from "../middleware/multerMiddleware.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getTickets);
router.get("/metrics", authenticateToken, getTicketMetrics);
router.post("/", authenticateToken, uploadImages, createTicket);
router.put("/:id", authenticateToken, uploadImages, updateTicket);
router.delete("/:id", authenticateToken, deleteTicket);

export default router;
