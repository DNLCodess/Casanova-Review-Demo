// pages/api/send-otp.js

import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  const { phone } = req.body;

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your verification code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    // Save the OTP in session or a database for later verification (for demo purposes, you can just return it)
    res.status(200).json({ otp });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
}
