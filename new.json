import twilio from "twilio";
import dotenv from "dotenv";
import mongoose from "mongoose";
import ContactDetails from "../../models/contactDetails.js";
import Calls from "../../models/callHistory.js"; // ✅ existing schema where calls are stored

dotenv.config();

// ✅ Initialize Twilio client safely
let client;
try {
  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
} catch (err) {
  console.error("⚠️ Twilio initialization failed:", err.message);
}

export const initiateCall = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { purpose } = req.body;

    if (!purpose) {
      return res.status(400).json({
        success: false,
        message: "Purpose is required.",
      });
    }

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Customer ID" });
    }

    // 🔍 Find contact details
    const contact = await ContactDetails.findById(customerId).lean();
    if (!contact || !contact.phone) {
      return res.status(404).json({
        success: false,
        message: "Contact not found or phone number missing.",
      });
    }

    if (!client) {
      return res.status(503).json({
        success: false,
        message: "Twilio client not initialized. Check credentials.",
      });
    }

    // 🧠 Prevent repeated calls within 10 seconds
    const recentCall = await Calls.findOne({
      customer_id: customerId,
      call_start_iso: { $gte: new Date(Date.now() - 10 * 1000) },
    });

    if (recentCall) {
      console.log(`⚠️ Duplicate call attempt detected for ${contact.phone}`);
      return res.status(429).json({
        success: false,
        message:
          "A recent call was already made to this contact. Please wait a few seconds before retrying.",
      });
    }

    const wsUrl = process.env.MEDIA_WS_URL_BIKASH;

    // TwiML for audio stream
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Connect>
          <Stream url="${wsUrl}">
            <Parameter name="customer_id" value="${customerId}" />
            <Parameter name="purpose" value="${purpose}" />
          </Stream>
        </Connect>
      </Response>`;

    console.log(`📞 Initiating call to ${contact.phone} ...`);

    let call;
    try {
      call = await client.calls.create({
        to: contact.phone,
        from: process.env.TWILIO_NUMBER,
        twiml,
        //statusCallback: `${process.env.SERVER_URL}/api/call/status`, // optional webhook
        statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
        statusCallbackMethod: "POST",
      });
    } catch (twilioErr) {
      console.error("🚨 Twilio Call Error:", twilioErr.message);

      // Graceful handling for Twilio trial/unverified numbers
      if (
        twilioErr.code === 21215 ||
        twilioErr.code === 21217 ||
        twilioErr.message.includes("not a valid, verified outgoing caller id")
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Your Twilio account or number is not verified. Please verify or upgrade your account.",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Twilio call failed.",
        error: twilioErr.message,
      });
    }

    console.log("✅ Call initiated successfully!");
    console.log(`📡 Call SID: ${call.sid}`);
    console.log(`📊 Current status: ${call.status}`);

    // ✅ Respond to frontend immediately
    res.status(201).json({
      success: true,
      message: "Call initiated successfully.",
      call_sid: call.sid,
      status: call.status,
      to: contact.phone,
      customerId,
    });

    // 🧠 Log call status updates every few seconds
    const logStatus = async (delay) => {
      setTimeout(async () => {
        try {
          const currentCall = await client.calls(call.sid).fetch();
          console.log(
            `📈 [${delay / 1000}s] Status for ${contact.phone}: ${currentCall.status}`
          );
        } catch (err) {
          console.warn(`⚠️ Could not fetch call status: ${err.message}`);
        }
      }, delay);
    };

    // Schedule live status checks
    [5000, 15000, 30000].forEach(logStatus);
  } catch (error) {
    console.error("❌ initiateCall error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during call initiation",
      error: error.message,
    });
  }
};

// Handle unhandled promise rejections globally
process.on("unhandledRejection", (reason) => {
  console.error("🚨 Unhandled Rejection:", reason);
});
