import CallLiveStatus from "../../models/callLiveStatus.js";


function normalizeStatus(s) {
  const v = String(s || "").toLowerCase();
  if (["queued","initiated","ringing","in-progress","completed","busy","failed","no-answer","canceled"].includes(v)) return v;
  if (v === "answered") return "in-progress";
  return "queued";
}

export async function saveLiveStatus(req, res) {
  try {
    // ...existing logs and destructuring
    const {
      CallSid,
      CallStatus,
      CallDuration,
      Timestamp,
      SequenceNumber,
      To, From,
    } = req.body; // existing code [web:62]

    if (!CallSid) return res.status(400).send("Missing CallSid"); // existing code [web:1]

    const now = Timestamp ? new Date(Timestamp) : new Date(); // existing code [web:1]
    const status = normalizeStatus(CallStatus); // existing code [web:1]
    const seq = typeof SequenceNumber !== "undefined" ? Number(SequenceNumber) : null; // existing code [web:1]

    // ADD HERE: debug and simplified ordering
    console.log("Raw CallStatus:", CallStatus); // shows original value from Twilio [web:62]

    const update = {
      last_status: status,
      updated_at_iso: now,
      to: To || "",
      from: From || "",
    }; // existing build [web:1]

    if (status === "completed") {
      update.duration_seconds = CallDuration != null ? Number(CallDuration) : 2; // existing behavior [web:1]
    }

    const updateOps = {
      $set: update,
      $setOnInsert: { call_id: CallSid },
    }; // existing ops [web:1]

    // Simplify filter for testing so any event can update the row
    const filter = { call_id: CallSid }; // replace previous $or filter during testing [web:1]

    // Keep $max only when seq is valid
    if (seq !== null && !Number.isNaN(seq)) {
      updateOps.$max = { sequence_number: seq }; // newer events retain higher seq [web:1]
    }

    // Then keep your delayed write
    setTimeout(async () => {
      try {
        await CallLiveStatus.updateOne(filter, updateOps, { upsert: true }); // unchanged call [web:1]
        console.log(`DB updated after 2s for ${CallSid} -> ${status}`); // unchanged log [web:62]
      } catch (dbErr) {
        console.error("Deferred DB update error:", dbErr.message); // unchanged error [web:62]
      }
    }, 2000); // unchanged delay [web:1]

    return res.status(200).send("OK"); // unchanged ack [web:1]
  } catch (e) {
    console.error("Live status webhook error:", e.message); // unchanged error [web:62]
    return res.status(200).send("OK"); // unchanged ack [web:1]
  }
}



export async function getLiveStatus(req, res) {
  try {
    const { callId } = req.params;
    const doc = await CallLiveStatus.findOne({ call_id: callId }).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: doc });
  } catch (e) {
    console.error("Get live status error:", e.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
