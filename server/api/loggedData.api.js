import express from "express";
import prisma from "../prisma/prismaClient.js";

const router = express.Router();
router.use(express.json());

router.get("/",async(req,res)=>{
    try {

        const passId = "6845bab292704dd59774cd9c" // localtsorage ma  id pass huncha teta bata tane ho ;
        const userData = await prisma.user.findFirst({
            where :{
                id : passId
            }
        });
        console.log(userData);
        res.status(200).json({
            msg: "user data are given below",
            personalData :  userData
        })
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            msg:"Something went wrong",
            error : e
        })
    }
})


export default router;