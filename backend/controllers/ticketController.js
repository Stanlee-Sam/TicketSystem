import prisma from "../lib/prisma.js";
import { nextTicketNumber } from "../lib/ticketNumber.js";
import Joi from "joi";

const ticketSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  priority: Joi.string()
    .trim()
    .valid("low", "medium", "high", "critical")
    .required(),
  category: Joi.string()
    .trim()
    .valid(
      "hardware",
      "software",
      "network",
      "printer",
      "email",
      "other",
      "access",
    )
    .required(),
});

const ticketUpdateSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  priority: Joi.string()
    .trim()
    .valid("low", "medium", "high", "critical", "LOW", "MEDIUM", "HIGH", "CRITICAL")
    .optional(),
  category: Joi.string()
    .trim()
    .valid(
      "hardware",
      "software",
      "network",
      "printer",
      "email",
      "other",
      "access",
      "HARDWARE",
      "SOFTWARE",
      "NETWORK",
      "PRINTER",
      "EMAIL",
      "OTHER",
    )
    .optional(),
  status: Joi.string().trim().valid("OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "PENDING VENDOR", "IN PROGRESS").optional(),
  resolutionNote: Joi.string().trim().allow("", null).optional(),
});

const paramsSchema = Joi.object({
  id: Joi.string().required(),
});

export const createTicket = async (req, res) => {
  try {
    const { error, value } = ticketSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    const { title, description, priority, category } = value;
    const uploadedFiles = req.files || [];

    if (!title || !description || !priority || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const normalizedPriority = priority?.toLowerCase();

    const priorityMap = {
      low: "LOW",
      medium: "MEDIUM",
      high: "HIGH",
      critical: "CRITICAL",
    };

    const finalPriority = priorityMap[normalizedPriority] || "MEDIUM";

    const normalizedCategory = category?.toLowerCase();

    const categoryMap = {
      software: "SOFTWARE",
      hardware: "HARDWARE",
      network: "NETWORK",
      printer: "PRINTER",
      email: "EMAIL",
      other: "OTHER",
      access: "OTHER",
    };

    const finalCategory = categoryMap[normalizedCategory] || "OTHER";

    let submitterId = req.userId || req.body.submitterId;

    if (!submitterId) {
      const fallbackUser = await prisma.user.findFirst();
      if (!fallbackUser) {
        return res
          .status(404)
          .json({ message: "No user found to assign the ticket" });
      }
      submitterId = fallbackUser.id;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: submitterId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const ticket = await prisma.$transaction(async (tx) => {
      const ticketNumber = await nextTicketNumber(tx);

      return tx.ticket.create({
        data: {
          ticketNumber,
          title,
          description,
          priority: finalPriority,
          category: finalCategory,
          status: "OPEN",
          submitterId,
          attachments: {
            create: uploadedFiles.map((file) => ({
              fileUrl: file.path,
            })),
          },
        },
      });
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        category: ticket.category,
        status: ticket.status,
      },
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Failed to create ticket" });
  }
};

export const getTickets = async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const { error, value } = ticketUpdateSchema.validate(req.body, {
      abortEarly: false,
    });
    const { error: paramsError } = paramsSchema.validate(req.params);

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    if (paramsError) {
      return res.status(400).json({
        message: "Invalid ticket ID",
      });
    }
    const ticketId = req.params.id;
    const { title, description, priority, category, status, resolutionNote } = value;
    const uploadedFiles = req.files || [];

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const updateData = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (priority !== undefined) {
      const normalizedPriority = priority.toLowerCase();
      const priorityMap = {
        low: "LOW",
        medium: "MEDIUM",
        high: "HIGH",
        critical: "CRITICAL",
      };
      updateData.priority = priorityMap[normalizedPriority] || "MEDIUM";
    }

    if (category !== undefined) {
      const normalizedCategory = category.toLowerCase();
      const categoryMap = {
        software: "SOFTWARE",
        hardware: "HARDWARE",
        network: "NETWORK",
        printer: "PRINTER",
        email: "EMAIL",
        other: "OTHER",
        access: "OTHER",
      };
      updateData.category = categoryMap[normalizedCategory] || "OTHER";
    }

    if (status !== undefined) {
      const normalizedStatus = status.toUpperCase().replace(" ", "_");
      const statusMap = {
        OPEN: "OPEN",
        IN_PROGRESS: "IN_PROGRESS",
        RESOLVED: "RESOLVED",
        CLOSED: "RESOLVED",
        PENDING_VENDOR: "IN_PROGRESS",
      };
      updateData.status = statusMap[normalizedStatus] || "OPEN";
    }

    if (resolutionNote !== undefined) {
      updateData.resolutionNote = resolutionNote;
    }

    if (uploadedFiles.length > 0) {
      updateData.attachments = {
        create: uploadedFiles.map((file) => ({
          fileUrl: file.path,
        })),
      };
    }

    const updatedTicket = await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: updateData,
    });

    res.status(200).json({
      message: "Ticket updated successfully",
      updatedTicket: {
        id: updatedTicket.id,
        ticketNumber: updatedTicket.ticketNumber,
        title: updatedTicket.title,
        description: updatedTicket.description,
        priority: updatedTicket.priority,
        category: updatedTicket.category,
        status: updatedTicket.status,
        resolutionNote: updatedTicket.resolutionNote,
      },
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: "Failed to update ticket" });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
      return res.status(400).json({
        message: "Invalid ticket ID",
      });
    }

    const ticketId = req.params.id;

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await prisma.ticket.delete({
      where: {
        id: ticketId,
      },
    });

    res.status(200).json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Failed to delete ticket" });
  }
};

export const getTicketMetrics = async (req, res) => {
  try {
    // 1. Query database for counts grouped by status and priority
    const rawCounts = await prisma.ticket.groupBy({
      by: ["status", "priority"],
      _count: {
        id: true,
      },
    });

    // 2. Format the response object structures
    const statusCounts = {};
    const priorityCounts = {};
    let totalTickets = 0;

    rawCounts.forEach((group) => {
      const count = group._count.id;
      totalTickets += count;

      // Sum up totals by status
      statusCounts[group.status] = (statusCounts[group.status] || 0) + count;

      // Sum up totals by priority
      priorityCounts[group.priority] =
        (priorityCounts[group.priority] || 0) + count;
    });

    return res.status(200).json({
        total: totalTickets,
        byStatus: statusCounts,
        byPriority: priorityCounts,
        rawBreakdown: rawCounts.map((g) => ({
          status: g.status,
          priority: g.priority,
          count: g._count.id,
        })),
    });
  } catch (error) {
    console.error("Error fetching ticket metrics:", error);
    return res.status(500).json({
      message: "Failed to retrieve ticket metrics.",
    });
  }
};
