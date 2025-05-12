import express from "express";
import bcrypt from "bcrypt";
import prisma from "../prisma/prismaClient.js";

const router = express.Router();
router.use(express.json());

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    console.log(data)
    const { firstName, lastName, username, email, password, role } = req.body;

    if (!firstName || !lastName || !username || !email || !password || !role) {
      return res.status(400).json({ 
        message: "All fields are required.",
        requiredFields: ["firstName", "lastName", "username", "email", "password", "role"]
      });
    }

   if (!email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ message: "Invalid email format." });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ 
        message: "User already exists",
        conflict: existingUser.username === username ? "username" : "email"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   const user = await prisma.user.create({
    data: {
        firstName,
        lastName,
        username,
        email,
        hashedPassword,
        role,
        userType: req.body.userType || undefined 
    }
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

export default router;