const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  console.log("EMAIL TRY:", to, subject);
  try {
    if (!to) {
      throw new Error("Recipient email is missing");
    }

    await transporter.sendMail({
      from: `"Ecommerce App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log("EMAIL SENT SUCCESS");
  } catch (error) {
    console.log("Error sending email:", error.message);
    throw error;
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { sendEmail, generateOTP }

