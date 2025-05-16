import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../prisma/prismaClient.js";
import dotenv from "dotenv";

const router = express.Router();
router.use(express.json());

router.post("/", async (req, res) => {
    
    const {firstName,lastname,email,phone,password,companyName,gstNumber,plan,agreeToTerms,timeZone,couponCode}= req.body;
    let present=true;   
    const hashedPassword = await bcrypt.hash(password,10) ;

    const existingCompany = await prisma.user.findFirst({
        where :{
            OR :[
                {companyName},
                {gstNumber}
            ]
        }
    })

    const companyMetaData =  {companyName,gstNumber,firstName,lastname,email,hashedPassword,phone,timeZone,couponCode,agreeToTerms,plans,remainingdays,paidStatus}

    if(existingCompany)
    {
        res.status(200).json({
            message : "There is already a company with this name or GST number",
        })
    }
    else{
        try{

            const createCompanyRecord = await prisma.user.create({
                        data: companyMetaData,
            });

        }
        catch(e)
        {
            res.status(500).json({
                message:"Something went wrong in server while registering a place in CRM for your company. Try again ",
            })
        }
    }
    
    
});

export default router;
