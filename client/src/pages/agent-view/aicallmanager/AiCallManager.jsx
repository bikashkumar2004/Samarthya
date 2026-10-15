import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, PhoneCall } from "lucide-react";
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
import CallHistory from "@/components/agent-view/aicallmanager/CallHistory";
import LiveMonitor from "@/components/agent-view/dashboard/LiveMonitor";

const AICallManager = () => {
  const [autocallerEnabled, setAutocallerEnabled] = useState(false);

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
    setAutocallerEnabled(!autocallerEnabled);
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

  const sampleCalls = [
    {
      sl: 1,
      name: "Priyanka Jena",
      phoneNo: "+91 98765 43213",
      category: "Document Reminder",
      status: "Completed",
      sentiment: "Positive",
      duration: "1m 34s",
      date: "2025-10-29",
    },
    {
      sl: 2,
      name: "Sagar Mohanty",
      phoneNo: "+91 98765 43214",
      category: "Counseling Notification",
      status: "Completed",
      sentiment: "Positive",
      duration: "2m 12s",
      date: "2025-10-29",
    },
    {
      sl: 3,
      name: "Ritika Das",
      phoneNo: "+91 98765 43215",
      category: "Merit List Query",
      status: "Failed",
      sentiment: "Negative",
      duration: "3m 45s",
      date: "2025-10-28",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <span>AI Call Manager</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dispatch autonomous calls, monitor live Twilio audio streams, and review post-call intelligence
          </p>
        </div>
      </div>

      {/* Auto Caller Control Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                autocallerEnabled
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              }`}
            >
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Auto-Dialer Engine</h3>
                {autocallerEnabled ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Dispatching
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                    Standby
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Automatically sequences calls through patient queues using Twilio Media Streams
              </p>
            </div>
          </div>

          <Button
            onClick={onToggleAutoCaller}
            size="sm"
            className={`font-semibold rounded-xl px-5 py-2.5 shadow-sm transition-all ${
              autocallerEnabled
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {autocallerEnabled ? "Disable Auto-Caller" : "Enable Auto-Caller"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Telephony Calls
          </span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {rows.length || sampleCalls.length}
          </div>
          <p className="text-xs text-slate-400 mt-1">Logged call interactions</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Completed Calls
          </span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {sampleCalls.filter((c) => c.status === "Completed").length}
          </div>
          <p className="text-xs text-slate-400 mt-1">Resolved without errors</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Failed / Dropped
          </span>
          <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-2">
            {sampleCalls.filter((c) => c.status === "Failed").length}
          </div>
          <p className="text-xs text-slate-400 mt-1">Unreachable or network drop</p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Positive Sentiment
          </span>
          <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
            {sampleCalls.filter((c) => c.sentiment === "Positive").length}
          </div>
          <p className="text-xs text-slate-400 mt-1">High customer satisfaction</p>
        </div>
      </div>

      <LiveMonitor />
      <CallHistory />
    </div>
  );
};

export default AICallManager;
