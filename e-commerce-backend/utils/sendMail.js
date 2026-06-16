const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:"atifazad560@gmail.com",
    // ,
    // 
    pass:"ipixxhdwtlfmteew"
  }
});
const sendEmail = async (to, subject, html) => {
 try {
    await transporter.sendMail({
      from: "atifazad560@gmail.com",
      to,
      subject,
      html
    });
  } catch (error) {
    console.log("Error sending email:", error.message);
    throw error;
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {sendEmail,generateOTP}

