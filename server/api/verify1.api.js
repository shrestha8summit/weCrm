import express from "express"
import {mailer} from "../middleware/authenication.middleware.js"
const router = express.Router()
router.use(express.json())

function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}

const otp = generateOTP();

router.post("/",async(req,res)=>{
    const {email} = req.body;
    const otp = generateOTP();
    console.log(email,otp);
    mailer(email,otp);
})


export default router;
