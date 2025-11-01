// src/features/live/LiveMonitor.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { bulkCallsStart } from "@/store/call-mannager";
import {
  fetchLiveMonitor,
  selectFirstDurationSec,
  selectLiveData,
  selectLiveLoading,
  selectLivePolling,
  startLivePolling,
  stopLivePolling,
 
} from "@/store/call-mannager/aiCallmanage";

function formatDuration(totalSec = 0) {
  const s = Math.max(0, Number(totalSec) || 0);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h > 0) return `${h}h ${mm}m ${rem}s`;
  if (m > 0) return `${m}m ${rem}s`;
  return `0m ${rem}s`;
}

function prettyStatus(s = "") {
  const v = String(s).toLowerCase();
  if (v === "in-progress") return "In Progress";
  if (v === "no-answer") return "No Answer";
  return v.charAt(0).toUpperCase() + v.slice(1);
}

export default function LiveMonitor() {
  const dispatch = useDispatch();
  const rows = useSelector(selectLiveData);
  const loading = useSelector(selectLiveLoading);
  const polling = useSelector(selectLivePolling);
  const firstDurationSec = useSelector(selectFirstDurationSec); 

  const [enabled, setEnabled] = React.useState(false);
  const pollRef = React.useRef(null);
  const clickLockRef = React.useRef(false);

  const beginPolling = React.useCallback(() => {
    if (pollRef.current) return;
    dispatch(startLivePolling());
    dispatch(fetchLiveMonitor());
    pollRef.current = window.setInterval(() => {
      dispatch(fetchLiveMonitor());
    }, 4000);
  }, [dispatch]);

  const endPolling = React.useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    dispatch(stopLivePolling());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(fetchLiveMonitor());
  }, [dispatch]);

  React.useEffect(() => {
    return () => {
      endPolling();
    };
  }, [endPolling]);

  const onToggleAutoCaller = () => {
    if (clickLockRef.current) return;
    clickLockRef.current = true;

    setEnabled((prev) => {
      const next = !prev;
      if (next) {
        dispatch(bulkCallsStart());
        beginPolling();
      } else {
        endPolling();
      }
      return next;
    });

    setTimeout(() => {
      clickLockRef.current = false;
    }, 500);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Live Monitor Dashboard</h2>
        <button
          onClick={onToggleAutoCaller}
          className={`px-3 py-1 rounded text-white font-semibold ${
            enabled ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
          title={enabled ? "Disable Auto Caller" : "Enable Auto Caller"}
        >
          {enabled ? "Disable Auto Caller" : "Enable Auto Caller"}
        </button>
      </div>

      {/* First call duration display */}
      <div className="mb-4 text-sm text-gray-700">
        Latest call duration: {formatDuration(firstDurationSec)}
      </div>

      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-3 py-2 w-16">Sl No.</th>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Duration</th>
              <th className="text-left px-3 py-2 w-28">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-4">Loading…</td>
              </tr>
            )}

            {rows.map((r, i) => (
              <tr key={r.call_id} className={i % 2 ? "bg-gray-50/50" : ""}>
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
                      r.status === "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : r.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    ⏱ {prettyStatus(r.status)}
                  </span>
                </td>
                <td className="px-3 py-2">{formatDuration(r.duration_seconds)}</td>
                <td className="px-3 py-2">
                  <button className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded">
                    Cancel
                  </button>
                </td>
              </tr>
            ))}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-4">No calls yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {polling ? "Auto-refresh: on (every 4s)" : "Auto-refresh: off"}
      </div>
    </div>
  );
}