import twilio from "twilio";
import dotenv from "dotenv";
import mongoose from "mongoose";
import UploadDetails from "../../models/uploadDetails.js";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const initiateCall = async (req, res) => {
  try {
    const { customerId } = req.params;

    console.log("Customer ID:", customerId);

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Customer ID.",
      });
    }

    const contact = await UploadDetails.findById(customerId).lean();

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    if (!contact.phoneNo) {
      return res.status(400).json({
        success: false,
        message: "Contact has no phone number.",
      });
    }

    const description = contact.description || "No description provided";

    console.log("Description (from DB):", description);

    const wsUrl = process.env.MEDIA_WS_URL_BIKASH;

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Connect>
          <Stream url="${wsUrl}">
            <Parameter name="customer_id" value="${customerId}" />
            <Parameter name="purpose" value="${description}" />
          </Stream>
        </Connect>
      </Response>`;

    const call = await client.calls.create({
      to: contact.phoneNo,
      from: process.env.TWILIO_NUMBER,
      twiml: twiml,
    });

    console.log("Call initiated! SID:", call.sid, "Status:", call.status);

    res.status(201).json({
      success: true,
      message: "Call initiated successfully.",
      callSid: call.sid,
      usedDescription: description,
    });
  } catch (error) {
    console.error("Call initiation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initiate call.",
      error: error.message,
    });
  }
};
