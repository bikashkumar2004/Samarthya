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




  const filteredCalls = sampleCalls.filter((call) => {
    const matchesSearch =
      call.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.phoneNo.includes(searchTerm) ||
      call.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(call.status);
    const matchesSentiment = sentimentFilter.length === 0 || sentimentFilter.includes(call.sentiment);

    let matchesDuration = true;
    if (durationFilter) {
      const minutes = parseInt(call.duration.split('m')[0]);
      if (durationFilter === '<1min' && minutes >= 1) matchesDuration = false;
      if (durationFilter === '1-3min' && (minutes < 1 || minutes > 3)) matchesDuration = false;
      if (durationFilter === '>3min' && minutes <= 3) matchesDuration = false;
    }

    const matchesDate = !dateFilter || call.date === dateFilter;

    return matchesSearch && matchesStatus && matchesSentiment && matchesDuration && matchesDate;
  });

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

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredCalls);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'AI Calls');
    XLSX.writeFile(wb, 'ai_calls_data.xlsx');
  };

  const viewDetails = (call) => {
    setModalContent(call);
    setModalOpen(true);
  };

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
  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCalls = filteredCalls.slice(startIndex, endIndex);

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
              onClick={() => setAutocallerEnabled(!autocallerEnabled)}
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
                {liveCalls.length > 0 ? (
                  liveCalls.map((call) => (
                    <TableRow key={call.sl} className="hover:bg-blue-50 transition-colors">
                      <TableCell className="font-semibold">{call.sl}</TableCell>
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
                        {call.duration}
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

      {/* Call History Section */}
      <Card className="border-2 border-gray-200 shadow-xl">
        {/* Call History Section - Updated Header */}
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-2xl font-bold text-[#043927] flex items-center gap-2">
              <Phone className="w-6 h-6" />
              Call History
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search calls..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>

              <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-2 border-[#043927] text-[#043927] hover:bg-[#043927] hover:text-white font-bold"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter By
                    {(statusFilter.length > 0 || sentimentFilter.length > 0 || durationFilter || dateFilter) && (
                      <span className="ml-2 bg-[#043927] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {statusFilter.length + sentimentFilter.length + (durationFilter ? 1 : 0) + (dateFilter ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto bg-white">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold text-[#043927]">Filter Options</SheetTitle>
                  </SheetHeader>

                  <div className="space-y-6 mt-6">
                    {/* Status Filter */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-bold text-gray-900">Status</Label>
                      </div>
                      <div className="space-y-2">
                        {['Completed', 'In Progress', 'No Answer', 'Failed'].map((status) => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                              id={`status-${status}`}
                              checked={statusFilter.includes(status)}
                              onCheckedChange={() => handleStatusChange(status)}
                            />
                            <label
                              htmlFor={`status-${status}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {status}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sentiment Filter */}
                    <div className="space-y-3 border-t pt-6">
                      <Label className="text-base font-bold text-gray-900">Sentiment</Label>
                      <div className="space-y-2">
                        {['Positive', 'Neutral', 'Negative'].map((sentiment) => (
                          <div key={sentiment} className="flex items-center space-x-2">
                            <Checkbox
                              id={`sentiment-${sentiment}`}
                              checked={sentimentFilter.includes(sentiment)}
                              onCheckedChange={() => handleSentimentChange(sentiment)}
                            />
                            <label
                              htmlFor={`sentiment-${sentiment}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                            >
                              {getSentimentIcon(sentiment)}
                              {sentiment}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Duration Filter */}
                    <div className="space-y-3 border-t pt-6">
                      <Label className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Duration
                      </Label>
                      <RadioGroup value={durationFilter} onValueChange={setDurationFilter}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="" id="duration-all" />
                          <label htmlFor="duration-all" className="text-sm font-medium cursor-pointer">
                            All Durations
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="<1min" id="duration-1" />
                          <label htmlFor="duration-1" className="text-sm font-medium cursor-pointer">
                            Less than 1 minute
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1-3min" id="duration-2" />
                          <label htmlFor="duration-2" className="text-sm font-medium cursor-pointer">
                            1-3 minutes
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value=">3min" id="duration-3" />
                          <label htmlFor="duration-3" className="text-sm font-medium cursor-pointer">
                            More than 3 minutes
                          </label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Date Filter */}
                    <div className="space-y-3 border-t pt-6">
                      <Label className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </Label>
                      <Input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 border-t pt-6">
                      <Button
                        onClick={clearAllFilters}
                        variant="outline"
                        className="w-full border-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear All Filters
                      </Button>
                      <Button
                        onClick={() => setFilterOpen(false)}
                        className="w-full bg-gradient-to-r from-[#043927] to-emerald-700 hover:from-[#032d1f] hover:to-emerald-800 text-white font-bold"
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Clear Filter Button - Only show when filters are active */}
              {(statusFilter.length > 0 || sentimentFilter.length > 0 || durationFilter || dateFilter) && (
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="border-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold transition-all"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              )}

              <Button
                onClick={downloadExcel}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold shadow-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>


        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold text-gray-900">Sl No.</TableHead>
                  <TableHead className="font-bold text-gray-900">Name</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden md:table-cell">Phone No.</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden lg:table-cell">Status</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden sm:table-cell">Sentiment</TableHead>
                  <TableHead className="font-bold text-gray-900">Duration</TableHead>
                  <TableHead className="font-bold text-gray-900 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentCalls.length > 0 ? (
                  currentCalls.map((call) => (
                    <TableRow key={call.sl} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-semibold">{call.sl}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-gray-900">{call.name}</div>
                          <div className="text-xs text-gray-500 md:hidden">{call.phoneNo}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-sm">
                        {call.phoneNo}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusClass(call.status)}`}>
                          {getStatusIcon(call.status)}
                          {call.status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getSentimentClass(call.sentiment)}`}>
                          {getSentimentIcon(call.sentiment)}
                          {call.sentiment}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm font-semibold">
                        {call.duration}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => viewDetails(call)}
                          variant="outline"
                          size="sm"
                          className="border-2 border-[#043927] text-[#043927] hover:bg-[#043927] hover:text-white font-bold"
                        >
                          <Eye className="w-4 h-4 sm:mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <PhoneOff className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="font-medium">No calls found matching your filters</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

              {/* <TableBody>
                {filteredCalls.length > 0 ? (
                  filteredCalls.map((call) => (
                    <TableRow key={call.sl} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-semibold">{call.sl}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-gray-900">{call.name}</div>
                          <div className="text-xs text-gray-500 md:hidden">{call.phoneNo}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-sm">
                        {call.phoneNo}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusClass(call.status)}`}>
                          {getStatusIcon(call.status)}
                          {call.status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getSentimentClass(call.sentiment)}`}>
                          {getSentimentIcon(call.sentiment)}
                          {call.sentiment}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm font-semibold">
                        {call.duration}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => viewDetails(call)}
                          variant="outline"
                          size="sm"
                          className="border-2 border-[#043927] text-[#043927] hover:bg-[#043927] hover:text-white font-bold"
                        >
                          <Eye className="w-4 h-4 sm:mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <PhoneOff className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="font-medium">No calls found matching your filters</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody> */}
            </Table>
          </div>
          {/* Pagination Controls */}
          {filteredCalls.length > 0 && (
            <div className="border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Info */}
                <div className="text-sm text-gray-700">
                  Showing <span className="font-bold text-[#043927]">{startIndex + 1}</span> to{' '}
                  <span className="font-bold text-[#043927]">
                    {Math.min(endIndex, filteredCalls.length)}
                  </span>{' '}
                  of <span className="font-bold text-[#043927]">{filteredCalls.length}</span> results
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <Button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="border-2 border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  <div className="hidden sm:flex items-center gap-1">
                    {/* First Page */}
                    {currentPage > 3 && (
                      <>
                        <Button
                          onClick={() => setCurrentPage(1)}
                          variant="outline"
                          size="sm"
                          className="w-10 h-10 border-2 border-gray-300 hover:bg-gray-100 font-bold"
                        >
                          1
                        </Button>
                        {currentPage > 4 && (
                          <span className="px-2 text-gray-500">...</span>
                        )}
                      </>
                    )}

                    {/* Previous Page */}
                    {currentPage > 2 && (
                      <Button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        variant="outline"
                        size="sm"
                        className="w-10 h-10 border-2 border-gray-300 hover:bg-gray-100 font-bold"
                      >
                        {currentPage - 1}
                      </Button>
                    )}

                    {/* Current Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-10 h-10 border-2 border-[#043927] bg-gradient-to-r from-[#043927] to-emerald-600 text-white font-bold shadow-lg"
                    >
                      {currentPage}
                    </Button>

                    {/* Next Page */}
                    {currentPage < totalPages - 1 && (
                      <Button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        variant="outline"
                        size="sm"
                        className="w-10 h-10 border-2 border-gray-300 hover:bg-gray-100 font-bold"
                      >
                        {currentPage + 1}
                      </Button>
                    )}

                    {/* Last Page */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <span className="px-2 text-gray-500">...</span>
                        )}
                        <Button
                          onClick={() => setCurrentPage(totalPages)}
                          variant="outline"
                          size="sm"
                          className="w-10 h-10 border-2 border-gray-300 hover:bg-gray-100 font-bold"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Mobile Page Indicator */}
                  <div className="sm:hidden text-sm font-bold text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>

                  {/* Next Button */}
                  <Button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="border-2 border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}

        </CardContent>
      </Card>


      {/* Modal for Call Details */}
      {modalOpen && modalContent && (
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
                  <div className="font-bold text-gray-900">{modalContent.name}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Phone Number</div>
                  <div className="font-bold text-gray-900">{modalContent.phoneNo}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Category</div>
                  <div className="font-bold text-gray-900">{modalContent.category}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Duration</div>
                  <div className="font-bold text-gray-900">{modalContent.duration}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusClass(modalContent.status)}`}>
                    {getStatusIcon(modalContent.status)}
                    {modalContent.status}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Sentiment</div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getSentimentClass(modalContent.sentiment)}`}>
                    {getSentimentIcon(modalContent.sentiment)}
                    {modalContent.sentiment}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="text-sm text-gray-600 mb-2">Call Summary</div>
                <p className="text-gray-900">
                  The automated call was made to remind about {modalContent.category.toLowerCase()}.
                  The contact responded {modalContent.sentiment.toLowerCase()}ly and the call was {modalContent.status.toLowerCase()}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICallManager;
