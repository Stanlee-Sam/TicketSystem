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

router.get("/", getTickets);
router.get("/metrics", getTicketMetrics);
router.post("/",  uploadImages, createTicket);
router.put("/:id",  uploadImages, updateTicket);
router.delete("/:id",  deleteTicket);

export default router;
