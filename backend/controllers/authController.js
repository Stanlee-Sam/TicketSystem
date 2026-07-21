import { getPrisma } from "../services/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Joi from "joi";

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role || "STAFF" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(6).required(),
});

export const loginUser = async (req, res) => {
  try {
    const prisma = await getPrisma();
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
