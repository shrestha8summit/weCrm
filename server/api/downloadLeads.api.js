import express from "express";
import { Parser } from "json2csv";
import prisma from "../prisma/prismaClient.js";
import jwtTokenMiddleware from "../middleware/jwtoken.middleware.js";

const router = express.Router();

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); 
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

router.get("/", jwtTokenMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID not found" });
    }

    const leads = await prisma.Lead.findMany({
      where: { uid: userId },
      select: {
        id                  :true,
        title               :true,
        customerFirstName   :true,
        customerLastName    :true,
        emailAddress        :true,
        phoneNumber         :true,
        jobTitle            :true,
        topicOfWork         :true,
        industry            :true,  
        status              :true, 
        serviceInterestedIn :true, 
        closingDate         :true,
        notes               :true
      },
    });
    if (!leads.length) {
      return res.status(404).json({ error: "No leads found" });
    }
    const fields = ["id", "title","customerFirstName","customerLastName","emailAddress","phoneNumber",        "jobTitle","topicOfwork","industry","status","serviceInterestedIn","closingDate","notes"];
    const parser = new Parser({ fields });
    const csv = parser.parse(leads);

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="leads.csv"');
    res.send(csv);

  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

export default router;