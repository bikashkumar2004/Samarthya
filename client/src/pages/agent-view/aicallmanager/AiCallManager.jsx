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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-black flex items-center gap-3">
          <PhoneCall className="w-8 h-8 md:w-10 md:h-10" />
          AI Call Manager
        </h1>
      </div>

      {/* Auto Caller Toggle */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  autocallerEnabled
                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                    : "bg-gray-200"
                }`}
              >
                <Phone
                  className={`w-6 h-6 ${
                    autocallerEnabled ? "text-white" : "text-gray-500"
                  }`}
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Auto Caller</h3>
                <p className="text-sm text-gray-600">
                  {autocallerEnabled ? "Currently Active" : "Currently Inactive"}
                </p>
              </div>
            </div>
            <Button
              onClick={onToggleAutoCaller}
              className={`cursor-pointer font-bold shadow-lg transition-all transform hover:scale-105 ${
                autocallerEnabled
                  ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              }`}
            >
              {autocallerEnabled ? "Disable Auto Caller" : "Enable Auto Caller"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-gray-200 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">
              Total Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-[#043927]">
              {sampleCalls.length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-gray-200 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-600">
              {sampleCalls.filter((c) => c.status === "Completed").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-gray-200 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-red-600">
              {sampleCalls.filter((c) => c.status === "Failed").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-gray-200 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">
              Positive Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-600">
              {sampleCalls.filter((c) => c.sentiment === "Positive").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <LiveMonitor />
      <CallHistory />
    </div>
  );
};

export default AICallManager;
