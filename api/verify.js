const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const accountSid = "YOUR_TWILIO_ACCOUNT_SID";
const authToken = "YOUR_TWILIO_AUTH_TOKEN";
const client = twilio(accountSid, authToken);

// Endpoint to send OTP
app.post("/send-otp", (req, res) => {
  const { phoneNumber } = req.body;
  client.verify
    .services("YOUR_SERVICE_SID") // Replace with your Twilio Verify service SID
    .verifications.create({ to: phoneNumber, channel: "sms" })
    .then((verification) => res.status(200).send({ verification }))
    .catch((error) => res.status(400).send({ error: error.message }));
});

// Endpoint to verify OTP
app.post("/verify-otp", (req, res) => {
  const { phoneNumber, code } = req.body;
  client.verify
    .services("YOUR_SERVICE_SID") // Replace with your Twilio Verify service SID
    .verificationChecks.create({ to: phoneNumber, code })
    .then((verification_check) => res.status(200).send({ verification_check }))
    .catch((error) => res.status(400).send({ error: error.message }));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
