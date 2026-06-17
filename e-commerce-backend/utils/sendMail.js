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

const sendEmail = async (to, subject, otp) => {
  console.log("EMAIL TRY:", to, subject);

  try {
    if (!to) {
      throw new Error("Recipient email is missing");
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f4;padding:20px 10px;">
  <tr>
    <td align="center">

      <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td align="center"
            style="background:#111827;color:#ffffff;padding:24px;font-size:26px;font-weight:bold;">
            Ecommerce App
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding:30px 20px;text-align:center;">

            <h2 style="margin:0 0 16px;color:#111827;font-size:24px;">
              Email Verification
            </h2>

            <p style="margin:0 0 24px;font-size:16px;color:#4b5563;line-height:1.6;">
              Use the OTP below to verify your email address.
            </p>

            <!-- OTP Box -->
            <table cellpadding="0" cellspacing="0" border="0" align="center">
              <tr>
                <td style="
                  background:#f3f4f6;
                  padding:14px 22px;
                  border-radius:10px;
                  font-size:28px;
                  font-weight:bold;
                  letter-spacing:4px;
                  color:#111827;">
                  ${otp}
                </td>
              </tr>
            </table>

            <p style="margin-top:24px;font-size:14px;color:#6b7280;">
              This OTP will expire in 10 minutes.
            </p>

            <p style="margin-top:20px;font-size:13px;color:#9ca3af;line-height:1.5;">
              If you did not request this email, please ignore it.
            </p>

          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>
`;

    await transporter.sendMail({
      from: `"Ecommerce App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
      html,
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

module.exports = { sendEmail, generateOTP };