import transporter from "./config/auth/nodemailer.js";
import dotenv from "dotenv";
dotenv.config();

async function testMail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to: "sahoosushil456@gmail.com", // test email
      subject: "✅ SMTP Test from Brevo",
      text: "If you got this email, your Brevo SMTP is working!",
    });
    console.log("✅ Mail sent:", info.response);
  } catch (err) {
    console.error("❌ Mail failed:", err);
  }
}

testMail();
