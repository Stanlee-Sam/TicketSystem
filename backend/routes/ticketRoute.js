import express from "express";
import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketController.js";
import { uploadImages } from "../middleware/multerMiddleware.js";

const router = express.Router();

router.get("/", getTickets);
router.post("/", uploadImages, createTicket);
router.put("/:id", uploadImages, updateTicket);
router.delete("/:id", deleteTicket);

export default router;