import { sendSMS as twilioSendSMS } from '../send_sms.js';
import { Message } from '../models/Message.js';

export async function handleSMSSend(to_number, message, name = 'Customer', purpose = 'General') {
  try {
    let cleanNumber = to_number.replace(/\s|-/g, '');
    if (!cleanNumber.startsWith('+')) {
      cleanNumber = '+' + cleanNumber;
    }

    console.log(`🔄 Processing SMS`);
    console.log(` To: ${cleanNumber}`);
    console.log(` Name: ${name}`);
    console.log(` Purpose: ${purpose}`);

    // Send SMS
    const result = await twilioSendSMS(cleanNumber, message);

    // Save to database
    const messageRecord = new Message({
      type: 'SMS',
      recipient: { phone: cleanNumber },
      message,
      name,
      purpose,
      status: result.success ? 'sent' : 'failed',
      messageId: result.message_sid || null,
      error: result.error || null
    });

    await messageRecord.save();

    if (result.success) {
      console.log(`✅ SMS sent and saved to database`);
      return {
        success: true,
        message_sid: result.message_sid,
        status: result.status,
        message: 'SMS sent successfully',
        to: cleanNumber,
        id: messageRecord._id
      };
    } else {
      console.error(`❌ SMS failed:`, result.error);
      return {
        success: false,
        error: result.error,
        id: messageRecord._id
      };
    }
  } catch (error) {
    console.error(`❌ SMS Service Error: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}
