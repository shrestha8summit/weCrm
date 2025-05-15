import express from "express"
import prisma from "../prisma/prismaClient.js"
const router = express.Router()

router.post("/",async(req,res)=>{
    
    const {newPassword,confirmPassword} = req.body;
    
    if(newPassword === confirmPassword)
    {
        try{

            const updatedUser = await prisma.user.update({
            where: { email: email }, 
            data: {
                 password: newPassword,
                },
            });
            console.log('User password updated:', updatedUser);
            return updatedUser;
        }
        catch(e)
        {
            res.status(500).json({
                message:"Server error while updating in db"
            });
        }
    }
    else
    {
        res.status(404).json({
            message:"Password unmatch",
        })
    }



})

export default router;