import express from "express";
import jwt from "jsonwebtoken"; // Make sure to install this package

const router = express.Router();

router.post("/", async (req, res) => {
    const { email, username, password } = req.body;
    console.log(email, username, password);
    if (email === "admin@gmail.com" && password === "admin" && username === "admin") {
        const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
        const isLoggedIn = true;
        const userType = "admin";
        return res.status(200).json({ message: "Login successful",loggedIn: isLoggedIn, userType : userType, token });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});

export default router;
