import mongoose from "mongoose";
import calls from "../../models/callHistory.js";

export const callTranscript = async (req, res) => {
  try {
    let { customerId } = req.params; // or req.query if you prefer query param
    if (!customerId) {
      return res.status(400).json({ success: false, message: "Customer ID is required" });
    }

    customerId = customerId.trim();
    console.log("Customer ID received:", customerId);

    let objId = null;
    if (mongoose.Types.ObjectId.isValid(customerId)) {
      objId = new mongoose.Types.ObjectId(customerId);
    }


    const callHistory = await calls.findOne({
      $or: [{ customer_id: objId }, { customer_id: customerId }]
    })
      .populate("customer_id")
      .sort({ createdAt: -1 });

    if (!callHistory) {
      return res.status(404).json({ success: false, message: "No call history found for this customer." });
    }

    res.status(200).json({ success: true, data: callHistory });

  } catch (error) {
    console.error("Error fetching call transcript:", error);
    res.status(500).json({ success: false, message: "Error fetching call transcript", error: error.message });
  }
};
