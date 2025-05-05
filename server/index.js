import express from "express"
import "dotenv/config"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors({
    origin : "http://localhost:8888/"
}))

const port = process.env.PORT || 3333;

app.get("/",(req,res)=>{
    res.send("Welcome to index page")
})

app.listen(port,(req,res)=>{
    console.log(`Server is running with port ${port}`)
})



