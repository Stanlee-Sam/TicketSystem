import { PrismaPg } from "@prisma/adapter-pg";
import prismaPkg from "../generated/prisma/client.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Joi from "joi";

const { PrismaClient } = prismaPkg;

//load the app and prisma
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role || "STAFF" },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
};

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).required(),
});

export const loginUser = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      });
    }
    const { email, password } = value;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const accessToken = generateAccessToken(user);
    res.json({
      message: "Login successful",
      accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Failed to login user" });
  }
};
