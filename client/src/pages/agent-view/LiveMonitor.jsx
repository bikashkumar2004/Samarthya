// src/features/live/LiveMonitor.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { bulkCallsStart } from "@/store/call-mannager";
import { Button } from '@/components/ui/button';

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
  TableRow
} from '@/components/ui/table';
import {
  Phone,
  PhoneOff,
  Download,
  Search,
  Filter,
  X,
  Eye,
  Clock,
  Calendar,
  Smile,
  Meh,
  Frown,
  Activity,
  PhoneCall,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

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

  const getStatusClass = (status) => {
    const classes = {
      Completed: 'bg-green-100 text-green-700 border-green-300',
      'In Progress': 'bg-blue-100 text-blue-700 border-blue-300',
      'No Answer': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      Failed: 'bg-red-100 text-red-700 border-red-300',
    };
    return classes[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getStatusIcon = (status) => {
    if (status === 'Completed') return <CheckCircle className="w-4 h-4" />;
    if (status === 'In Progress') return <Activity className="w-4 h-4 animate-pulse" />;
    if (status === 'Failed') return <AlertCircle className="w-4 h-4" />;
    if (status === 'No Answer') return <PhoneOff className="w-4 h-4" />;
    return null;
  };

  return (
    <div>
      {/* Live Monitor Dashboard */}
      <Card className="border-2 border-blue-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
          <CardTitle className="text-xl font-bold text-[#043927] flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600 animate-pulse" />
            Live Monitor Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold text-gray-900">Sl No.</TableHead>
                  <TableHead className="font-bold text-gray-900">Name</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden sm:table-cell">Status</TableHead>
                  <TableHead className="font-bold text-gray-900">Duration</TableHead>
                  <TableHead className="font-bold text-gray-900 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length > 0 ? (
                  rows.map((call,i) => (
                    <TableRow key={call.call_id} className="hover:bg-blue-50 transition-colors">
                      <TableCell className="font-semibold">{i + 1}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-gray-900">{call.name}</div>
                          <div className="text-xs text-gray-500 sm:hidden">{call.phoneNo}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusClass(call.status)}`}>
                          {getStatusIcon(call.status)}
                          {call.status}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm font-semibold">
                        {formatDuration(call.duration_seconds)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => cancelLiveCall(call.sl)}
                          variant="destructive"
                          size="sm"
                          className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 font-bold shadow-md"
                        >
                          <X className="w-4 h-4 sm:mr-1" />
                          <span className="hidden sm:inline">Cancel</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      <PhoneOff className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="font-medium">No active calls at the moment</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}