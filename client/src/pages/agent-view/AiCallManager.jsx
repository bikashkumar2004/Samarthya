
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
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

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

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
import CallHistory from '@/components/agent-view/aicallmanager/CallHistory';
import LiveMonitor from './LiveMonitor';

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
  const v = String(s).toLowerCase();
  if (v === "in-progress") return "In Progress";
  if (v === "no-answer") return "No Answer";
  return v.charAt(0).toUpperCase() + v.slice(1);
}


const AICallManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [autocallerEnabled, setAutocallerEnabled] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filter States
  const [statusFilter, setStatusFilter] = useState([]);
  const [sentimentFilter, setSentimentFilter] = useState([]);
  const [durationFilter, setDurationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');


  //Redux code
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
    setAutocallerEnabled(!autocallerEnabled)
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


  // Live calls data
  const liveCalls = [
    {
      sl: 1,
      name: 'Amit Patel',
      phoneNo: '+91 98765 43210',
      status: 'In Progress',
      duration: '0m 45s'
    },
    {
      sl: 2,
      name: 'Sneha Sharma',
      phoneNo: '+91 98765 43211',
      status: 'In Progress',
      duration: '1m 12s'
    },
    {
      sl: 3,
      name: 'Rajesh Kumar',
      phoneNo: '+91 98765 43212',
      status: 'In Progress',
      duration: '2m 03s'
    }
  ];

    // Call history data - expanded for pagination demo
    const sampleCalls = [
      {
        sl: 1,
        name: 'Priyanka Jena',
        phoneNo: '+91 98765 43213',
        category: 'Document Reminder',
        status: 'Completed',
        sentiment: 'Positive',
        duration: '1m 34s',
        date: '2025-10-29'
      },
      {
        sl: 2,
        name: 'Sagar Mohanty',
        phoneNo: '+91 98765 43214',
        category: 'Counseling Notification',
        status: 'Completed',
        sentiment: 'Positive',
        duration: '2m 12s',
        date: '2025-10-29'
      },
      {
        sl: 3,
        name: 'Ritika Das',
        phoneNo: '+91 98765 43215',
        category: 'Merit List Query',
        status: 'Failed',
        sentiment: 'Negative',
        duration: '3m 45s',
        date: '2025-10-28'
      },
      {
        sl: 4,
        name: 'Vikash Kumar',
        phoneNo: '+91 98765 43216',
        category: 'Fee Payment',
        status: 'Completed',
        sentiment: 'Positive',
        duration: '1m 58s',
        date: '2025-10-28'
      },
      {
        sl: 5,
        name: 'Swati Pradhan',
        phoneNo: '+91 98765 43217',
        category: 'Seat Allocation',
        status: 'No Answer',
        sentiment: 'Neutral',
        duration: '0m 30s',
        date: '2025-10-27'
      },
      {
        sl: 6,
        name: 'Arjun Sahoo',
        phoneNo: '+91 98765 43218',
        category: 'Document Submission',
        status: 'Completed',
        sentiment: 'Positive',
        duration: '2m 05s',
        date: '2025-10-27'
      },
      // Add more entries to demonstrate pagination
      {
        sl: 7,
        name: 'Ramesh Patra',
        phoneNo: '+91 98765 43219',
        category: 'Admission Query',
        status: 'Completed',
        sentiment: 'Positive',
        duration: '1m 45s',
        date: '2025-10-27'
      },
      {
        sl: 8,
        name: 'Kavita Singh',
        phoneNo: '+91 98765 43220',
        category: 'Fee Payment',
        status: 'No Answer',
        sentiment: 'Neutral',
        duration: '0m 25s',
        date: '2025-10-26'
      },
      {
        sl: 9,
        name: 'Deepak Mishra',
        phoneNo: '+91 98765 43221',
        category: 'Document Verification',
        status: 'Completed',
        sentiment: 'Positive',
        duration: '2m 30s',
        date: '2025-10-26'
      },
      {
        sl: 10,
        name: 'Anita Roy',
        phoneNo: '+91 98765 43222',
        category: 'Scholarship Info',
        status: 'Completed',
        sentiment: 'Positive',
        duration: '3m 15s',
        date: '2025-10-26'
      },
      {
        sl: 11,
        name: 'Suresh Nayak',
        phoneNo: '+91 98765 43223',
        category: 'Hostel Allocation',
        status: 'Failed',
        sentiment: 'Negative',
        duration: '1m 10s',
        date: '2025-10-25'
      },
      {
        sl: 12,
        name: 'Meena Das',
        phoneNo: '+91 98765 43224',
        category: 'Course Registration',
        status: 'Completed',
        sentiment: 'Positive',
        duration: '2m 45s',
        date: '2025-10-25'
      },
      {
        sl: 13,
        name: 'Ravi Kumar',
        phoneNo: '+91 98765 43225',
        category: 'Exam Schedule',
        status: 'Completed',
        sentiment: 'Neutral',
        duration: '1m 20s',
        date: '2025-10-25'
      },
      {
        sl: 14,
        name: 'Neha Sharma',
        phoneNo: '+91 98765 43226',
        category: 'Library Card',
        status: 'No Answer',
        sentiment: 'Neutral',
        duration: '0m 40s',
        date: '2025-10-24'
      },
      {
        sl: 15,
        name: 'Prakash Rao',
        phoneNo: '+91 98765 43227',
        category: 'Sports Registration',
        status: 'Completed',
        sentiment: 'Positive',
        duration: '1m 55s',
        date: '2025-10-24'
      },
      {
        sl: 16,
        name: 'Sunita Patel',
        phoneNo: '+91 98765 43228',
        category: 'Medical Checkup',
        status: 'Completed',
        sentiment: 'Positive',
        duration: '2m 20s',
        date: '2025-10-24'
      },
      {
        sl: 17,
        name: 'Manoj Gupta',
        phoneNo: '+91 98765 43229',
        category: 'Transport Pass',
        status: 'Failed',
        sentiment: 'Negative',
        duration: '0m 55s',
        date: '2025-10-23'
      },
      {
        sl: 18,
        name: 'Pooja Reddy',
        phoneNo: '+91 98765 43230',
        category: 'ID Card Issue',
        status: 'Completed',
        sentiment: 'Positive',
        duration: '1m 40s',
        date: '2025-10-23'
      },
      {
        sl: 19,
        name: 'Sanjay Verma',
        phoneNo: '+91 98765 43231',
        category: 'Certificate Request',
        status: 'Completed',
        sentiment: 'Neutral',
        duration: '2m 10s',
        date: '2025-10-23'
      },
      {
        sl: 20,
        name: 'Rekha Bose',
        phoneNo: '+91 98765 43232',
        category: 'Grade Inquiry',
        status: 'No Answer',
        sentiment: 'Neutral',
        duration: '0m 35s',
        date: '2025-10-22'
      }
    ];






  const getSentimentClass = (sentiment) => {
    const classes = {
      Positive: 'text-green-600 bg-green-100',
      Neutral: 'text-yellow-600 bg-yellow-100',
      Negative: 'text-red-600 bg-red-100',
    };
    return classes[sentiment] || 'text-gray-600 bg-gray-100';
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment === 'Positive') return <Smile className="w-4 h-4" />;
    if (sentiment === 'Neutral') return <Meh className="w-4 h-4" />;
    if (sentiment === 'Negative') return <Frown className="w-4 h-4" />;
    return null;
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



  // const viewDetails = (call) => {
  //   setModalContent(call);
  //   setModalOpen(true);
  // };

  const cancelLiveCall = (callId) => {
    console.log(`Cancelling call ${callId}`);
    // Add your cancel logic here
  };

  // Reset to page 1 when filters change
  const clearAllFilters = () => {
    setStatusFilter([]);
    setSentimentFilter([]);
    setDurationFilter('');
    setDateFilter('');
    setCurrentPage(1);
  };

  // Update page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sentimentFilter, durationFilter, dateFilter]);

  const handleStatusChange = (status) => {
    setStatusFilter(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleSentimentChange = (sentiment) => {
    setSentimentFilter(prev =>
      prev.includes(sentiment)
        ? prev.filter(s => s !== sentiment)
        : [...prev, sentiment]
    );
  };
  // Pagination calculations


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#043927] via-emerald-700 to-green-600 p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
          <PhoneCall className="w-8 h-8 md:w-10 md:h-10" />
          AI Call Manager
        </h1>
      </div>

      {/* Auto Caller Toggle */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${autocallerEnabled
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gray-200'
                }`}>
                <Phone className={`w-6 h-6 ${autocallerEnabled ? 'text-white' : 'text-gray-500'}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Auto Caller</h3>
                <p className="text-sm text-gray-600">
                  {autocallerEnabled ? 'Currently Active' : 'Currently Inactive'}
                </p>
              </div>
            </div>
            <Button
              onClick={onToggleAutoCaller}
              className={`font-bold shadow-lg transition-all transform hover:scale-105 ${autocallerEnabled
                ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                }`}
            >
              {autocallerEnabled ? 'Disable Auto Caller' : 'Enable Auto Caller'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-gray-200 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">Total Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-[#043927]">{sampleCalls.length}</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-gray-200 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-600">
              {sampleCalls.filter(c => c.status === 'Completed').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-gray-200 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-red-600">
              {sampleCalls.filter(c => c.status === 'Failed').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-gray-200 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">Positive Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-600">
              {sampleCalls.filter(c => c.sentiment === 'Positive').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Monitor Dashboard */}
      {/* <Card className="border-2 border-blue-200 shadow-xl">
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
      </Card> */}
      <LiveMonitor/>

      <CallHistory/>

      
    </div>
  );
};

export default AICallManager;
