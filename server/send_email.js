import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const senderEmail = process.env.SENDER_EMAIL || 'your-email@gmail.com';
const senderPassword = process.env.SENDER_PASSWORD || 'your-app-password';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: senderEmail,
    pass: senderPassword
  }
});

/**
 * Send email using SMTP
 * @param {string} toEmail - Recipient email address
 * @param {string} messageBody - Message text
 * @param {string} name - Recipient name
 * @param {string} purpose - Message purpose
 * @returns {Promise<Object>} - Email send result
 */
export async function sendEmail(toEmail, messageBody, name = 'Customer', purpose = 'General') {
  try {
    const emailBody = `
${messageBody}

Best regards,

Support Team
    `;

    const mailOptions = {
      from: senderEmail,
      to: toEmail,
      subject: `Customer Support - ${purpose}`,
      text: emailBody,
      html: `<p>${messageBody}</p><p>Best regards,<br><br>Support Team</p>`
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent successfully`);
    console.log(`Message ID: ${info.messageId}`);

    return {
      success: true,
      message_id: info.messageId,
      status: 'sent'
    };
  } catch (error) {
    console.error(`❌ Error sending email: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}
