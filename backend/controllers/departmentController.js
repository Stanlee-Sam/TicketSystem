import prisma from "../lib/prisma.js";

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
