import express from "express";
import prisma from "../prisma/prismaClient.js";

const router = express.Router();
router.use(express.json());

router.get("/",async(req,res)=>{
    try{
        const user = await prisma.user.findMany();
        const company = await prisma.company.findMany();

        console.log(user);
        console.log(company);

        res.status(200).json({
           msg :" got data from mongodb",
           userData : user,
           companyData : company
        })

    }
    catch(e){
        console.log(e);
        res.status(500).send(e);
    }

})

export default router;