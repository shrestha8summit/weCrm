import express from "express";
import prisma from "../prisma/prismaClient.js";

const router = express.Router();

router.post('/leads', async (req, res) => {
  try {
    const {
      uid,
      cid,
      title,
      customerName,
      mobileNumber,
      email,
      topicOfWork,
      closingDate,
    } = req.body;

    const newLead = await prisma.lead.create({
      data: {
        uid,
        cid,
        title,
        customerName,
        mobileNumber,
        email,
        topicOfWork,
        closingDate: new Date(closingDate), 
      },
    });

    res.status(201).json(newLead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

export default router;
