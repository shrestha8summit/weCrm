import express from "express";
import prisma from "../prisma/prismaClient.js";
import jwtTokenMiddleware from "../middleware/jwtoken.middleware.js"

const router = express.Router();

function convertStringToISODateString(dateString) {
  if (!dateString) return null; 
  const dateParts = dateString.split('-');
  if (dateParts.length !== 3) {
    console.error("Invalid date format. Expected DD_MM_YYYY.");
    return null;
  }

  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const year = parseInt(dateParts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    console.error("Invalid date components.");
    return null;
  }

  const dateObject = new Date(year, month, day);

  if (isNaN(dateObject.getTime())) {
    console.error("Invalid date.");
    return null;
  }

  return dateObject.toISOString();
}


router.post('/',jwtTokenMiddleware, async (req, res) => {
  try {
    const {uid} = req.user;
    const {
      title,
      customerFirstName,
      customerLastName,
      emailAddress,
      phoneNumber,
      topicOfWork,
      closingDate,
      notes
    } = req.body;

    const closingDateISO = convertStringToISODateString(closingDate);

    if (closingDateISO === null) {
      return res.status(400).json({ error: "Invalid closingDate provided." });
    }

    const newLead = await prisma.Lead.create({
      data: {
        uid,
        cid:"0",
        title,
        customerFirstName,
        customerLastName,
        emailAddress,
        phoneNumber,
        topicOfWork,
        closingDate: closingDateISO,
        notes
      },
    });

    console.log(uid, cid, title, customerFirstName, customerLastName, emailAddress, phoneNumber,
      topicOfWork, closingDate, notes);

    res.status(201).json(newLead);

  } catch (error) {
    console.log("error that you are searching : ", error);
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
  console.log("leads");
});

export default router;
