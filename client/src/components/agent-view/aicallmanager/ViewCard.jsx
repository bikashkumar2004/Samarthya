import React from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  Smile,
  Meh,
  Frown,
  Activity,
  PhoneOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";


function formatDuration(totalSec = 0) {
  const sNum = Number(totalSec) || 0;
  const s = Math.max(0, Math.round(sNum));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const rem = s % 60;
  if (h > 0) return `${h}h ${m}m ${rem}s`;
  if (m > 0) return `${m}m ${rem}s`;
  return `0m ${rem}s`;
}

function prettyStatus(s = "") {
  const v = String(s || "").toLowerCase();
  if (v === "in-progress") return "In Progress";
  if (v === "no-answer") return "No Answer";
  if (v === "queued") return "Queued";
  if (v === "initiated") return "Initiated";
  if (v === "ringing") return "Ringing";
  if (v === "completed") return "Completed";
  if (v === "busy") return "Busy";
  if (v === "failed") return "Failed";
  if (v === "canceled") return "Canceled";
  return v.charAt(0).toUpperCase() + v.slice(1);
}

const getSentimentClass = (sentiment) => {
  const classes = {
    Positive: "text-green-600 bg-green-100",
    Neutral: "text-yellow-600 bg-yellow-100",
    Negative: "text-red-600 bg-red-100",
  };
  return classes[sentiment] || "text-gray-600 bg-gray-100";
};

const getSentimentIcon = (sentiment) => {
  if (sentiment === "Positive") return <Smile className="w-4 h-4" />;
  if (sentiment === "Neutral") return <Meh className="w-4 h-4" />;
  if (sentiment === "Negative") return <Frown className="w-4 h-4" />;
  return null;
};

const getStatusClass = (status) => {
  const classes = {
    Completed: "bg-green-100 text-green-700 border-green-300",
    "In Progress": "bg-blue-100 text-blue-700 border-blue-300",
    "No Answer": "bg-yellow-100 text-yellow-700 border-yellow-300",
    Failed: "bg-red-100 text-red-700 border-red-300",
    Busy: "bg-orange-100 text-orange-700 border-orange-300",
    Canceled: "bg-gray-100 text-gray-700 border-gray-300",
    Queued: "bg-gray-100 text-gray-700 border-gray-300",
    Initiated: "bg-gray-100 text-gray-700 border-gray-300",
    Ringing: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return classes[status] || "bg-gray-100 text-gray-700 border-gray-300";
};

const getStatusIcon = (status) => {
  if (status === "Completed") return <CheckCircle className="w-4 h-4" />;
  if (status === "In Progress") return <Activity className="w-4 h-4 animate-pulse" />;
  if (status === "Failed") return <AlertCircle className="w-4 h-4" />;
  if (status === "No Answer") return <PhoneOff className="w-4 h-4" />;
  return null;
};

const ViewCard = ({ modalContent, setModalOpen }) => {
  const statusPretty = prettyStatus(modalContent?.status); 
  const durationText = formatDuration(modalContent?.duration_seconds ?? 0); 
  const summary = modalContent?.summary || "No summary available."; 

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-[#043927] to-emerald-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Call Details</h2>
            <Button
              onClick={() => setModalOpen(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">Name</div>
              <div className="font-bold text-gray-900">{modalContent?.name || "Unknown"}</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">Phone Number</div>
              <div className="font-bold text-gray-900">{modalContent?.phoneNo || "Unknown"}</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">Duration</div>
              <div className="font-bold text-gray-900">{durationText}</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">Status</div>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusClass(
                  statusPretty
                )}`}
              >
                {getStatusIcon(statusPretty)}
                {statusPretty}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">Sentiment</div>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getSentimentClass(
                  modalContent?.sentiment || "Neutral"
                )}`}
              >
                {getSentimentIcon(modalContent?.sentiment || "Neutral")}
                {modalContent?.sentiment || "Neutral"}
              </span>
            </div>
          </div>

          {/* Summary from detail endpoint */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="text-sm text-gray-600 mb-2">Call Summary</div>
            <p className="text-gray-900">{summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCard;
