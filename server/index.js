import express from "express";
import "dotenv/config";
import cors from "cors";
import signUp from "./api/signUp.api.js";
import logIn from "./api/logIn.api.js";
import checkingOTP from "./api/checkingOTP.js";
import connectDB from "./prisma/dbConnect.js";
import userProfile from "./api/userProfile.api.js";
import updatePassword from "./middleware/updatePassword.middleware.js";
import addCustomer from "./api/addCustomer.api.js";
import updateUserRoutes from "./api/updateUser.js"; // <-- Use import, not require
import recentActivities from "./api/recentActivities.api.js";
import loggedData from "./api/loggedData.api.js"
import leadshanlder from "./api/leads.api.js"

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}));

const port =  3333;

connectDB();

app.use("/api/signUp", signUp);
app.use("/api/logIn", logIn);
app.use("/api/checkingOTP", checkingOTP);
app.use("/api/allUser", userProfile);
app.use("/updatePassword", updatePassword);
app.use("/api/addCustomer", addCustomer);
app.use("/api", updateUserRoutes); // <-- Use imported router
app.use("/api/recent",recentActivities);
app.use("/api/loggedData",loggedData);
app.use("/api/leads",leadshanlder);
app.get("/", (req, res) => {
    res.send("Welcome to index page");
});

app.listen(port, () => {
    console.log(`Server is running with port ${port}`);
});