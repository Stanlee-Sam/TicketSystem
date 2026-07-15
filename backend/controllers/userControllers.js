import { PrismaPg } from "@prisma/adapter-pg";
import prismaPkg from "../generated/prisma/client.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const { PrismaClient } = prismaPkg;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export const createUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      departmentId,
      mustChangePass,
      isActive,
    } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

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

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role: finalRole,
        departmentId: departmentId || null,
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

// export const fetchUsers = async (req, res) => {
//     try {

//     } catch (error) {
//         console.error("Error fetching users:", error);
//         res.status(500).json({ message: "Failed to fetch users" });
//     }
// }

export const changePassword = async (req, res) => {
  try {
    const UserId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

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
