import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Clock,
  AlertCircle,
  PhoneOff,
  AlertTriangle,
  Eye,
  Filter,
  Download,
  Smile,
  Meh,
  Frown,
  Phone
} from 'lucide-react';
import View from '@/components/agent-view/View';


export default function Pending() {
  const [selectedCall, setSelectedCall] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const tableData = [
    {
      name: 'John Doe',
      phone: '+1 234-567-8900',
      status: 'Pending',
      sentiment: 'Positive',
      duration: '5:30',
      category: 'Sales',
      calledAt: '10:30 AM',
      summary: 'Customer expressed interest in our premium package. Requested a follow-up call next week.',
      transcription: 'Agent: Good morning! How can I help?\nCustomer: I want to know about premium package...',
    },
    {
      name: 'Jane Smith',
      phone: '+1 234-567-8901',
      status: 'Completed',
      sentiment: 'Neutral',
      duration: '3:45',
      category: 'Support',
      calledAt: '11:15 AM',
      summary: 'Technical support request resolved successfully.',
      transcription: 'Agent: Hello, thank you for calling support...',
    },
    {
      name: 'Robert Johnson',
      phone: '+1 234-567-8902',
      status: 'Rejected',
      sentiment: 'Negative',
      duration: '2:15',
      category: 'Complaint',
      calledAt: '2:45 PM',
      summary: 'Customer complaint about service delays.',
      transcription: 'Customer: I am not satisfied with the service...',
    },
    {
      name: 'Emily Davis',
      phone: '+1 234-567-8903',
      status: 'Pending',
      sentiment: 'Positive',
      duration: '4:20',
      category: 'Follow-up',
      calledAt: '3:30 PM',
      summary: 'Follow-up call scheduled for next week.',
      transcription: 'Agent: Thanks for your time today...',
    },
    {
      name: 'Michael Brown',
      phone: '+1 234-567-8904',
      status: 'Completed',
      sentiment: 'Positive',
      duration: '6:10',
      category: 'Sales',
      calledAt: '4:00 PM',
      summary: 'Deal closed successfully. Contract signed.',
      transcription: 'Agent: Congratulations on your purchase...',
    },
  ];

  const filteredData = filterStatus === 'all' 
    ? tableData 
    : tableData.filter(item => item.status.toLowerCase() === filterStatus);

  function getStatusBadge(status) {
    const statusStyles = {
      Pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      Completed: 'bg-green-100 text-green-700 border-green-300',
      Rejected: 'bg-red-100 text-red-700 border-red-300',
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[status] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
        {status}
      </span>
    );
  }

  function getSentimentBadge(sentiment) {
    const sentimentStyles = {
      Positive: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      Neutral: 'bg-gray-100 text-gray-700 border-gray-300',
      Negative: 'bg-rose-100 text-rose-700 border-rose-300',
    };
    
    const sentimentIcons = {
      Positive: <Smile className="w-4 h-4" />,
      Neutral: <Meh className="w-4 h-4" />,
      Negative: <Frown className="w-4 h-4" />,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${sentimentStyles[sentiment] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
        {sentimentIcons[sentiment]}
        {sentiment}
      </span>
    );
  }

  function handleViewCall(call) {
    setSelectedCall(call);
    setViewDialogOpen(true);
  }

  const stats = {
    rejected: tableData.filter(d => d.status === 'Rejected').length,
    followups: tableData.filter(d => d.status === 'Pending').length,
    missed: tableData.filter(d => d.sentiment === 'Negative').length,
    urgent: tableData.filter(d => d.status === 'Pending' && d.sentiment === 'Negative').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#043927] via-emerald-700 to-green-600 p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
          <Clock className="w-8 h-8 md:w-10 md:h-10" />
          Pending Follow-ups
        </h1>
        <p className="text-white/90 text-sm md:text-base mt-2">
          Track and manage your pending customer interactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-50 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Calls Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              {stats.rejected}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-yellow-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Follow-ups Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              {stats.followups}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700 flex items-center gap-2">
              <PhoneOff className="w-4 h-4" />
              Missed Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {stats.missed}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-orange-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Urgent Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {stats.urgent}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card className="border-2 border-gray-200 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-2xl font-bold text-[#043927] flex items-center gap-2">
              <Phone className="w-6 h-6" />
              Call History
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px] border-2 border-gray-300">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold shadow-lg">
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
                <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50">
                  <TableHead className="font-bold text-gray-900">Name</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden md:table-cell">Phone</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden lg:table-cell">Category</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden sm:table-cell">Status</TableHead>
                  <TableHead className="font-bold text-gray-900">Sentiment</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden md:table-cell">Duration</TableHead>
                  <TableHead className="font-bold text-gray-900 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <TableRow key={index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-colors">
                      <TableCell>
                        <div>
                          <div className="font-semibold text-gray-900">{row.name}</div>
                          <div className="text-xs text-gray-500 md:hidden">{row.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-sm">
                        {row.phone}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-300">
                          {row.category}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {getStatusBadge(row.status)}
                      </TableCell>
                      <TableCell>
                        {getSentimentBadge(row.sentiment)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-sm font-semibold">
                        {row.duration}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          onClick={() => handleViewCall(row)}
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
                      <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="font-medium">No calls found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#043927] flex items-center gap-2">
              <Eye className="w-6 h-6" />
              Call Details
            </DialogTitle>
          </DialogHeader>
          {selectedCall && <View callData={selectedCall} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
