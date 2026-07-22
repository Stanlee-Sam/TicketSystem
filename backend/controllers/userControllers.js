import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import Joi from "joi";

const userSchema = Joi.object({
  fullName: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).required(),
  role: Joi.string().trim().required(),
  departmentId: Joi.string().trim(),
  department: Joi.string().trim(),
  mustChangePass: Joi.boolean(),
  isActive: Joi.boolean(),
});

const passwordChangeSchema = Joi.object({
  currentPassword: Joi.string().trim().required(),
  newPassword: Joi.string().trim().min(6).required(),
  confirmPassword: Joi.string().trim().min(6).required(),
}).custom((value, helpers) => {
  if (value.newPassword !== value.confirmPassword) {
    return helpers.message("New passwords do not match");
  }
  return value;
});

const userUpdateSchema = Joi.object({
  fullName: Joi.string().trim().optional(),
  email: Joi.string().trim().email().optional(),
  password: Joi.string().trim().min(6).optional().allow("", null),
  role: Joi.string().trim().optional(),
  departmentId: Joi.string().trim().optional().allow("", null),
  department: Joi.string().trim().optional().allow("", null),
  mustChangePass: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
});

export const createUser = async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    const {
      fullName,
      email,
      password,
      role,
      departmentId,
      department: departmentName,
      mustChangePass,
      isActive,
    } = value;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const normalizedRole = role?.toUpperCase();

    const roleMap = {
      STAFF: "STAFF",
      IT_ADMIN: "IT_ADMIN",
      ITADMIN: "IT_ADMIN",
      ADMIN: "IT_ADMIN",
    };

    const finalRole = roleMap[normalizedRole] || normalizedRole;

    if (!["STAFF", "IT_ADMIN"].includes(finalRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    let finalDepartmentId = departmentId;
    if (departmentName) {
      const dept = await prisma.department.findUnique({
        where: { name: departmentName },
      });
      if (!dept) {
        return res.status(400).json({
          message:
            "Invalid department name. Omit it or use a valid department name.",
        });
      }
      finalDepartmentId = dept.id;
    } else if (departmentId) {
      const dept = await prisma.department.findUnique({
        where: { id: departmentId },
      });
      if (!dept) {
        return res.status(400).json({
          message:
            "Invalid departmentId. Omit it or use a valid department id.",
        });
      }
    }

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role: finalRole,
        departmentId: finalDepartmentId || null,
        mustChangePass: mustChangePass ?? true,
        isActive: isActive ?? true,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        departmentId: user.departmentId,
        mustChangePass: user.mustChangePass,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const fetchUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        departmentId: true,
        mustChangePass: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        department: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { error, value } = userUpdateSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    const userId = req.params.id;
    const {
      fullName,
      email,
      password,
      role,
      departmentId,
      department: departmentName,
      mustChangePass,
      isActive,
    } = value;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {};

    if (fullName !== undefined) {
      updateData.fullName = fullName;
    }

    if (email !== undefined) {
      if (email !== existingUser.email) {
        const emailTaken = await prisma.user.findUnique({
          where: { email },
        });
        if (emailTaken) {
          return res.status(400).json({ message: "Email is already taken" });
        }
      }
      updateData.email = email;
    }

    if (password && password.trim() !== "") {
      const passwordHash = await bcrypt.hash(password, 10);
      updateData.passwordHash = passwordHash;
    }

    if (role !== undefined) {
      const normalizedRole = role.toUpperCase();
      const roleMap = {
        STAFF: "STAFF",
        IT_ADMIN: "IT_ADMIN",
        ITADMIN: "IT_ADMIN",
        ADMIN: "IT_ADMIN",
      };
      const finalRole = roleMap[normalizedRole] || normalizedRole;
      if (!["STAFF", "IT_ADMIN"].includes(finalRole)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      updateData.role = finalRole;
    }

    if (departmentName !== undefined) {
      if (departmentName === null || departmentName === "") {
        updateData.departmentId = null;
      } else {
        const dept = await prisma.department.findUnique({
          where: { name: departmentName },
        });
        if (!dept) {
          return res.status(400).json({ message: "Invalid department name" });
        }
        updateData.departmentId = dept.id;
      }
    } else if (departmentId !== undefined) {
      if (departmentId === null || departmentId === "") {
        updateData.departmentId = null;
      } else {
        const dept = await prisma.department.findUnique({
          where: { id: departmentId },
        });
        if (!dept) {
          return res.status(400).json({ message: "Invalid departmentId" });
        }
        updateData.departmentId = dept.id;
      }
    }

    if (mustChangePass !== undefined) {
      updateData.mustChangePass = mustChangePass;
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        departmentId: updatedUser.departmentId,
        mustChangePass: updatedUser.mustChangePass,
        isActive: updatedUser.isActive,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { error, value } = passwordChangeSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }

    const UserId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = value;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: UserId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    const newPassHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: UserId,
      },
      data: {
        passwordHash: newPassHash,
      },
    });

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
};
