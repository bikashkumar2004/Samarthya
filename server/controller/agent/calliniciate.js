import twilio from "twilio";
import dotenv from "dotenv";
import mongoose from "mongoose";
import UploadDetails from "../../models/uploadDetails.js";
import Calls from "../../models/callHistory.js";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// 📋 Global queue management
const callQueue = [];
let activeCallCount = 0;
const MAX_CONCURRENT_CALLS = 5;

/**
 * Process the next call from queue
 */
const processNextCall = async () => {
  if (activeCallCount >= MAX_CONCURRENT_CALLS || callQueue.length === 0) {
    return;
  }

  activeCallCount++;
  const callData = callQueue.shift();

  try {
    console.log(
      `📞 Processing call: ${callData.contact.phoneNo} | Name: ${callData.contact.name} (${activeCallCount}/${MAX_CONCURRENT_CALLS} active) | Queue: ${callQueue.length}`
    );
    await executeCall(callData);
  } catch (error) {
    console.error("❌ Error processing call:", error.message);
  } finally {
    activeCallCount--;
    // Process next call in queue automatically
    processNextCall();
  }
};

/**
 * Execute individual call
 */
const executeCall = async (callData) => {
  const { customerId, contact } = callData;

  try {
    // ✅ VALIDATE PHONE NUMBER BEFORE CALLING
    if (!contact.phoneNo || typeof contact.phoneNo !== "string") {
      console.warn(`⚠️ Invalid phone number for contact ${customerId}. Skipping...`);
      return;
    }

    // ✅ USE DESCRIPTION FROM DATABASE
    const description = contact.description || "";
    console.log(`📝 Description from DB for ${contact.name}: ${description}`);

    const wsUrl = process.env.MEDIA_WS_URL_AMAR;

    // ✅ TwiML with description from database
    const twiml = `
      <Response>
        <Connect>
          <Stream url="${wsUrl}">
            <Parameter name="purpose" value="${description}" />
            <Parameter name="customer_id" value="${customerId}" />
          </Stream>
        </Connect>
      </Response>
    `;

    console.log(`📞 Initiating call to ${contact.phoneNo} ...`);
    console.log(`🔗 WebSocket URL: ${wsUrl}`);

    const call = await client.calls.create({
      to: contact.phoneNo,
      from: process.env.TWILIO_NUMBER,
      twiml: twiml,
      statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
      statusCallbackMethod: "POST",
    });

    console.log("✅ Call initiated successfully!");
    console.log(`📡 Call SID: ${call.sid}`);
    console.log(`📊 Current status: ${call.status}`);

  } catch (twilioErr) {
    console.error("🚨 Twilio Call Error:", twilioErr.message);
  }
};

/**
 * Old endpoint - for single call (kept for backward compatibility)
 */
export const initiateCall = async (req, res) => {
  try {
    const { customerId } = req.params;
    console.log("id", customerId);

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Customer ID" });
    }

    // ✅ Fetch contact from UploadDetails
    const contact = await UploadDetails.findById(customerId).lean();
    if (!contact || !contact.phoneNo) {
      return res.status(404).json({
        success: false,
        message: "Contact not found or has no phone number",
      });
    }

    // ✅ USE DESCRIPTION FROM DATABASE
    const description = contact.description || "";
    console.log(`📝 Retrieved contact: ${contact.name} - ${contact.phoneNo}`);
    console.log(`📝 Description from DB: ${description}`);

    const wsUrl = process.env.MEDIA_WS_URL_AMAR;

    const twiml = `
      <Response>
        <Connect>
          <Stream url="${wsUrl}">
            <Parameter name="purpose" value="${description}" />
            <Parameter name="customer_id" value="${customerId}" />
          </Stream>
        </Connect>
      </Response>
    `;

    const call = await client.calls.create({
      to: contact.phoneNo,
      from: process.env.TWILIO_NUMBER,
      twiml: twiml,
    });

    console.log("Call initiated! SID:", call.sid, "Status:", call.status);

    res.status(201).json({
      success: true,
      message: "Call initiated successfully",
      call_sid: call.sid,
      status: call.status,
      contact: {
        name: contact.name,
        phoneNo: contact.phoneNo,
        description: description,
      },
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

/**
 * ✅ NEW: Initiate bulk calls with queue management
 * NO description needed in request body - fetched from database
 */
export const initiateBulkCalls = async (req, res) => {
  try {
    console.log("📊 Fetching all customers from MongoDB...");

    // ✅ RETRIEVE ALL CUSTOMERS FROM UPLOADDETAILS
    const allContacts = await UploadDetails.find({
      phoneNo: { $exists: true, $ne: null, $ne: "" },
    }).lean();

    console.log(`✅ Retrieved ${allContacts.length} customers from database`);

    if (allContacts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No customers found with valid phone numbers",
        totalCustomers: 0,
      });
    }

    // ✅ VALIDATE PHONE NUMBERS
    const validContacts = allContacts.filter((contact) => {
      return (
        contact.phoneNo &&
        typeof contact.phoneNo === "string" &&
        contact.phoneNo.trim() !== ""
      );
    });

    console.log(
      `✅ Valid contacts after filtering: ${validContacts.length}/${allContacts.length}`
    );

    if (validContacts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No contacts with valid phone numbers after validation",
        totalRetrieved: allContacts.length,
        validContacts: 0,
      });
    }

    // ✅ ADD ALL VALID CUSTOMERS TO QUEUE (description from DB)
    validContacts.forEach((contact) => {
      callQueue.push({
        customerId: contact._id,
        contact, // Contains description, name, phoneNo, etc.
      });
      console.log(`📋 Queued: ${contact.name} | ${contact.phoneNo} | Description: ${contact.description || 'No description'}`);
    });

    console.log(`📋 Added ${validContacts.length} calls to queue`);
    console.log(`📊 Queue size: ${callQueue.length}`);
    console.log(`🔄 Active calls: ${activeCallCount}/${MAX_CONCURRENT_CALLS}`);

    // ✅ START PROCESSING - Initialize 5 concurrent calls
    for (let i = 0; i < MAX_CONCURRENT_CALLS; i++) {
      processNextCall();
    }

    res.status(202).json({
      success: true,
      message: `${validContacts.length} customers queued for calling`,
      totalCustomers: validContacts.length,
      skippedInvalid: allContacts.length - validContacts.length,
      activeCallCount,
      queueSize: callQueue.length,
      maxConcurrentCalls: MAX_CONCURRENT_CALLS,
    });
  } catch (error) {
    console.error("❌ initiateBulkCalls error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during bulk call initiation",
      error: error.message,
    });
  }
};

/**
 * ✅ NEW: Initiate calls for filtered customers
 */
export const initiateFilteredCalls = async (req, res) => {
  try {
    const { filter = {} } = req.body;

    console.log("📊 Fetching filtered customers from MongoDB...");
    console.log("🔍 Filter:", filter);

    // ✅ RETRIEVE FILTERED CUSTOMERS FROM UPLOADDETAILS
    const filteredContacts = await UploadDetails.find({
      ...filter,
      phoneNo: { $exists: true, $ne: null, $ne: "" },
    }).lean();

    console.log(`✅ Retrieved ${filteredContacts.length} customers`);

    // ✅ VALIDATE PHONE NUMBERS
    const validContacts = filteredContacts.filter((contact) => {
      return (
        contact.phoneNo &&
        typeof contact.phoneNo === "string" &&
        contact.phoneNo.trim() !== ""
      );
    });

    console.log(
      `✅ Valid contacts after filtering: ${validContacts.length}/${filteredContacts.length}`
    );

    if (validContacts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No customers found matching the criteria with valid phone numbers",
        appliedFilter: filter,
        totalRetrieved: filteredContacts.length,
        validContacts: 0,
      });
    }

    // ✅ ADD TO QUEUE (description from DB)
    validContacts.forEach((contact) => {
      callQueue.push({
        customerId: contact._id,
        contact, // Contains description from database
      });
      console.log(`📋 Queued: ${contact.name} | ${contact.phoneNo} | Description: ${contact.description || 'No description'}`);
    });

    console.log(`📋 Added ${validContacts.length} calls to queue`);

    // ✅ START PROCESSING
    for (let i = 0; i < MAX_CONCURRENT_CALLS; i++) {
      processNextCall();
    }

    res.status(202).json({
      success: true,
      message: `${validContacts.length} customers queued for calling`,
      totalCustomers: validContacts.length,
      skippedInvalid: filteredContacts.length - validContacts.length,
      activeCallCount,
      queueSize: callQueue.length,
    });
  } catch (error) {
    console.error("❌ initiateFilteredCalls error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during filtered call initiation",
      error: error.message,
    });
  }
};

/**
 * ✅ NEW: Get queue status
 */
export const getQueueStatus = (req, res) => {
  res.status(200).json({
    success: true,
    activeCallCount,
    queuedCalls: callQueue.length,
    maxConcurrentCalls: MAX_CONCURRENT_CALLS,
    totalInProgress: activeCallCount + callQueue.length,
  });
};

// Handle unhandled rejections
process.on("unhandledRejection", (reason) => {
  console.error("🚨 Unhandled Rejection:", reason);
});
