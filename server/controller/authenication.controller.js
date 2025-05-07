import express from "express"
import nodemailer from "nodemailer";

function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}
const otp = generateOTP();

function mailer(mailling){
    const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port:  465, 
        secure: true, 
        auth: {
          user: process.emv.email, 
          pass: process.env.password,
        },
            connectionTimeout: 1 * 60 * 1000, 
            socketTimeout: 1 * 60 * 1000, 
      });
      
            
      transporter.sendMail({
        from: process.env.email,
        to: mailling, ///get email from frontend... 
        subject: "Verify its you....", 
        text: `Your OTP is ${otp}`
      }).then(() => {
        console.log("Message sent");
      }).catch((error) => {
        console.log("Not working", error);
      });

}
