import express from "express"
import prisma from "../prisma/prismaClient.js"

const router = express.Router();
router.use(express.json()); 
router.post("/", async (req, res) => {
  try {
    const { customerFirstName, customerLastName,emailAddress,phoneNumber,message } = req.body;

    console.log("Received values:", {
  customerFirstName,
  customerLastName,
  emailAddress,
  phoneNumber,
  message
});

     const qb2bform = await prisma.Qb2bContact.create({
      data: {
        firstName :customerFirstName,
        lastName : customerLastName,
        email : emailAddress,
        phone:phoneNumber,
        message
      },
    });

     return res.status(201).json({
      message: "Your comment has been send.",
    });

  } catch (error) {
    console.error("Something went wrong", error);
    return res.status(500).json({ 
      message: "Internal server error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const comments = await prisma.Qb2bContact.findMany();
    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching data", error);
    return res.status(500).json({ 
      message: "Internal server error",
    });
  }
});

export default router