import { sendEmail as nodemailerSendEmail } from '../send_email.js';
import { Message } from '../models/Message.js';

export async function handleEmailSend(to_email, message, name = 'Customer', purpose = 'General') {
  try {
    console.log(`🔄 Processing Email`);
    console.log(` To: ${to_email}`);
    console.log(` Name: ${name}`);
    console.log(` Purpose: ${purpose}`);

    // Send email
    const result = await nodemailerSendEmail(to_email, message, name, purpose);

    // Save to database
    const messageRecord = new Message({
      type: 'Email',
      recipient: { email: to_email },
      message,
      name,
      purpose,
      status: result.success ? 'sent' : 'failed',
      messageId: result.message_id || null,
      error: result.error || null
    });

    await messageRecord.save();

    if (result.success) {
      console.log(`✅ Email sent and saved to database`);
      return {
        success: true,
        message_id: result.message_id,
        status: 'sent',
        message: 'Email sent successfully',
        to: to_email,
        id: messageRecord._id
      };
    } else {
      console.error(`❌ Email failed:`, result.error);
      return {
        success: false,
        error: result.error,
        id: messageRecord._id
      };
    }
  } catch (error) {
    console.error(`❌ Email Service Error: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}
