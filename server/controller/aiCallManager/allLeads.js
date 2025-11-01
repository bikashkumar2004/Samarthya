// controller/allLeads.js
import Calls from "../../models/callHistory.js";
import UploadDetails from "../../models/uploadDetails.js";

export async function allLeads(req, res) {
  try {
    const { page = 1, pageSize = 50, order = "desc" } = req.query;
    const p = Math.max(1, Number(page));
    const ps = Math.min(500, Math.max(1, Number(pageSize)));
    const sortDir = String(order).toLowerCase() === "asc" ? 1 : -1;

    const pipeline = [
      { $match: {} },

      // Latest call per lead; handle ObjectId vs string customer_id
      {
        $lookup: {
          from: Calls.collection.name,
          let: { uid: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$customer_id", "$$uid"] },                // ObjectId == ObjectId
                    { $eq: [{ $toString: "$customer_id" }, { $toString: "$$uid" }] }, // string compare fallback
                  ],
                },
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            {
              $project: {
                _id: 0,
                summary: 1,
                sentiment_overall: 1,
                createdAt: 1,
                call_start_iso: 1,
                call_end_iso: 1,
              },
            },
          ],
          as: "latestCall",
        },
      },
      { $unwind: { path: "$latestCall", preserveNullAndEmptyArrays: true } },

      // Alias to UI and derive call_time with preferred order: end, start, then createdAt
      {
        $project: {
          _id: 0,
          customer_id: "$_id",
          name: { $ifNull: ["$name", "Unknown"] },
          category: { $ifNull: ["$category", "Unspecified"] },

          summary: "$latestCall.summary",
          sentiment: "$latestCall.sentiment_overall",

          call_time: {
            $let: {
              vars: {
                ct: {
                  $ifNull: [
                    "$latestCall.call_end_iso",
                    { $ifNull: ["$latestCall.call_start_iso", "$latestCall.createdAt"] },
                  ],
                },
              },
              in: "$$ct",
            },
          },

          // Keep a Date for reliable sorting, independent of string formatting
          call_time_sort_key: {
            $let: {
              vars: {
                ct: {
                  $ifNull: [
                    "$latestCall.call_end_iso",
                    { $ifNull: ["$latestCall.call_start_iso", "$latestCall.createdAt"] },
                  ],
                },
              },
              in: "$$ct",
            },
          },
        },
      },

      // Sort by Date
      { $sort: { call_time_sort_key: sortDir } },

      // Row numbers
      {
        $setWindowFields: {
          sortBy: { call_time_sort_key: sortDir },
          output: { sl_no: { $documentNumber: {} } },
        },
      },

      // Final shape; keep call_time as Date and format on client, or replace with $dateToString here
      {
        $project: {
          customer_id: 1,
          sl_no: 1,
          name: 1,
          category: 1,
          summary: 1,
          sentiment: 1,
          call_time: 1,
        },
      },

      // Pagination
      { $skip: (p - 1) * ps },
      { $limit: ps },
    ];

    const rows = await UploadDetails.aggregate(pipeline).allowDiskUse(true);
    return res.json({ success: true, page: p, pageSize: ps, data: rows });
  } catch (error) {
    console.error("allLeads error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
