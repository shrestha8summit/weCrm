import express from "express"
import bcrypt from "bcrypt"

const router = express.Router()
router.use(express.json())

router.post("/",async(req,res)=>{
    const data = req.body;
    const {username,password} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10); 
        console.log({ username, hashedPassword });
        res.json({ message: "Sign-up data received", username });
    } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export default router