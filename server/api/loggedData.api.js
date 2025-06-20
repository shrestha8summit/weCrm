import express from "express";
import prisma from "../prisma/prismaClient.js";
import jwtTokenMiddleware from "../middleware/jwtoken.middleware.js";

const router = express.Router();
router.use(express.json());

router.get("/", jwtTokenMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found in request",
      });
    }

    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        username: true,
        phoneNumber: true,
        role: true,
        userType: true,
        photo: true,
        createdAt: true,
        updatedAt: true,
        assignedWork: true,
        statusOfWork: true,
        statusOfAccount: true,
        loggedInTime: true,
      },
    });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const leads = await prisma.lead.findMany({
      where: { uid: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        customerFirstName: true,
        customerLastName: true,
        emailAddress: true,
        phoneNumber: true,
        companyName: true,
        jobTitle: true,
        topicOfWork: true,
        industry: true,
        status: true,
        serviceInterestedIn: true,
        closingDate: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalNoOfLeads = await prisma.lead.count({
      where: { uid: userId },
    });

    res.status(200).json({
      success: true,
      message: "User and leads data retrieved successfully",
      data: {
        user: userData,
        totalLeads: leads.length,
        totalNoOfLeads, 
        leads,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default router;
