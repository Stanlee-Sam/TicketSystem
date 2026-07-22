import prisma from "../lib/prisma.js";
import Joi from "joi";

const departmentSchema = Joi.object({
  name: Joi.string().trim().required(),
});

const paramsSchema = Joi.object({
  id: Joi.string().required(),
});

export const getDepartments = async (_req, res) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    });

    res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Failed to fetch departments" });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const { error, value } = departmentSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    const { name } = value;

    const department = await prisma.department.create({
      data: {
        name,
      },
    });

    res.status(201).json({
      message: "Department created successfully",
      department: {
        id: department.id,
        name: department.name,
      },
    });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({ message: "Failed to create department" });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { error, value } = departmentSchema.validate(req.body, {
      abortEarly: false,
    });
    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
      return res.status(400).json({
        message: "Invalid department ID",
      });
    }

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    const departmentId = req.params.id;
    const { name } = value;

    const department = await prisma.department.findUnique({
      where: {
        id: departmentId,
      },
    });

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const updatedDepartment = await prisma.department.update({
      where: {
        id: departmentId,
      },
      data: {
        name,
      },
    });

    res.status(200).json({
      message: "Department updated successfully",
      updatedDepartment: {
        id: updatedDepartment.id,
        name: updatedDepartment.name,
      },
    });
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ message: "Failed to update department" });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { error: paramsError } = paramsSchema.validate(req.params);

    if (paramsError) {
      return res.status(400).json({
        message: "Invalid department ID",
      });
    }
    const departmentId = req.params.id;

    const department = await prisma.department.findUnique({
      where: {
        id: departmentId,
      },
    });

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    await prisma.department.delete({
      where: { id: departmentId },
    });

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ message: "Failed to delete department" });
  }
};
