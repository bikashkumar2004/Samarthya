import twilio from "twilio";
import dotenv from "dotenv";
import mongoose from "mongoose";
import ContactDetails from "../../models/contactDetails.js";

dotenv.config();
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const initiateCall = async (req, res) => {
  console.log(ContactDetails);
  
  try {
    const { customerId } = req.params;
    console.log("id",customerId);
    
    const {purpose}=req.body    
    console.log("purpose",purpose);
    
    if(!purpose){
      return res.status(400).json({
        success:false,
        message:"Purpose is not define."
      })
    }

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Customer ID" });
    }

    const contact = await ContactDetails.findById(customerId).lean();
    if (!contact || !contact.phone) {
      return res.status(404).json({
        success: false,
        message: "Contact not found or has no phone number",
      });
    }

    const wsUrl = process.env.MEDIA_WS_URL_BIKASH;

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Connect>
            <Stream url="${wsUrl}">
              <Parameter name="customer_id" value="${customerId}" />
              <Parameter name="purpose" value="${purpose}" />
            </Stream>
          </Connect>
        </Response>`;

    const call = await client.calls.create({
      to: contact.phone,
      from: process.env.TWILIO_NUMBER,
      twiml: twiml,
    });

    console.log("Call initiated! SID:", call.sid, "Status:", call.status);
    res.status(201).json({
      success: true,
      message: "Call initiated and saved successfully",
    });
  } catch (error) {
    console.error("Call initiation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initiate call",
      error: error.message,
    });
  }
};
