const express = require("express");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mail = require("nodemailer");
const { JWT_SECRET } = require("../Common/jwt");
const { usersCollection } = require("../Common/mongo");
const { PORT } = require("../Common/server");

router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    const oldUser = await usersCollection.findOne({ email });
    if (!oldUser) {
      return res
        .status(401)
        .sendFile(path.join(__dirname, "..", "..", "client", "password.html"));
    }

    const secret = JWT_SECRET + oldUser.password;

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });

    const link = `http://${req.hostname}:${PORT}/reset-password/${oldUser._id}/${token}`;
    const transporter = mail.createTransport({
      service: "gmail",
      auth: {
        user: "jackfrost4044@gmail.com",
        pass: "odwk ujrt sdqb sqyi",
      },
    });

    const mailOptions = {
      from: "jackfrost4044@gmail.com",
      to: email,
      subject: "Reset Your Password",
      text: link,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Email Sent:", info.response);
      }
      console.log(link);
    });
  } catch (e) {}
});

module.exports = router;
