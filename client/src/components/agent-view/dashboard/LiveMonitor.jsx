import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PhoneOff,
  Activity,
  CheckCircle,
  AlertCircle,
  Radio,
  Play,
  Square,
  Clock,
  Phone,
  User,
  Zap,
} from "lucide-react";

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

export default function LiveMonitor() {
  const dispatch = useDispatch();
  const rows = useSelector(selectLiveData) || [];
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
    }, 3000);
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "In Progress":
      case "ringing":
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            Active Call
          </span>
        );
      case "Completed":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "No Answer":
      case "no-answer":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <PhoneOff className="w-3.5 h-3.5" />
            No Answer
          </span>
        );
      case "Failed":
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {status || "Queued"}
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Live Telephony Monitor
              </h2>
              {polling && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Streaming Live
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time media streams between Twilio and Deepgram Voice Agent
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onToggleAutoCaller}
            variant={enabled ? "destructive" : "default"}
            size="sm"
            className={`font-semibold rounded-xl gap-2 shadow-sm transition-all ${
              enabled
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {enabled ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Auto-Caller</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Auto-Caller</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <TableHead className="w-16 text-xs font-bold text-slate-500 dark:text-slate-400">#</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400">Caller / Customer</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400 hidden sm:table-cell">Live Status</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Duration</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 dark:text-slate-400 text-right pr-6">Controls</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((call, i) => (
                <TableRow
                  key={call.call_id || i}
                  className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-indigo-50/40 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <TableCell className="font-mono text-xs text-slate-400">{i + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                        {call.name ? call.name.charAt(0).toUpperCase() : "C"}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {call.name || "Customer Inquirer"}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {call.phoneNo || "Twilio Stream"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {getStatusBadge(call.status)}
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDuration(call.duration_seconds || firstDurationSec)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                    >
                      Disconnect
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <PhoneOff className="w-7 h-7" />
                  </div>
                  <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                    No active telephone sessions right now
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    The Voice AI assistant is idle on WebSocket port 5000 waiting for incoming Twilio calls.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
