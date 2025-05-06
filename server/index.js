import express from "express"
import "dotenv/config"
import cors from "cors"
import signUp from "./api/signUp.api.js"
import logIn from "./api/logIn.api.js"

const app = express()
app.use(express.json())
app.use(cors({
    origin : "http://localhost:5173"
}))

const port = process.env.PORT || 3333;

app.use("/api/signUp",signUp)
app.use("/api/logIn",logIn)
app.get("/",(req,res)=>{
    res.send("Welcome to index page")
})

app.listen(port,(req,res)=>{
    console.log(`Server is running with port ${port}`)
})