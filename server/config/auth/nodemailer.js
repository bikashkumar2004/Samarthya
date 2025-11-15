// config/auth/nodemailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: Number(process.env.SMTP_PORT || 587),
  secure: false, // STARTTLS on 587
  auth: {
    user: process.env.SMTP_USER, // e.g. 9933ac002@smtp-brevo.com
    pass: process.env.SMTP_PASS, // Brevo SMTP key
  },
  logger: true,  // log to console
  debug: true,   // log SMTP traffic
});

export default transporter;


// Optional: verify at boot (call from server.js)
export async function verifySMTP() {
  try {
    await transporter.verify();
    console.log("SMTP is ready to send mail");
  } catch (e) {
    console.error("SMTP verify failed:", e);
  }
}

