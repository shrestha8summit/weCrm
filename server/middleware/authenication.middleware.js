import express from "express"
import nodemailer from "nodemailer"

export function mailer(mailling, otp) {
    console.log(mailling, otp);
    console.log(process.env.EMAIL,process.env.PASSWORD)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,       
            pass: process.env.PASSWORD,   
        },
        connectionTimeout: 1 * 60 * 1000, 
        socketTimeout: 1 * 60 * 1000,     
    });

    transporter.sendMail({
        from: process.env.EMAIL,  
        to: mailling,              
        subject: "Verify it's you....",
        text: `Your OTP is ${otp}`
    })
    .then(() => {
        console.log("Message sent");
    })
    .catch((error) => {
        console.log("Not working", error);
    });
}


