import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckCircle,
  XCircle,
  Eye,
  UserCheck,
  Clock,
  AlertCircle,
  ListChecks,
  UserX,
  TrendingUp,
  User,
  Calendar,
  FileText,
  MessageSquare
} from 'lucide-react';

const AssignedTask = () => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Mock data for assigned tasks
  const [assignedTasks, setAssignedTasks] = useState([
    {
      taskID: 'TSK101',
      dateTime: '2025-10-28 09:30',
      taskType: 'Customer Follow-up',
      rows: 45,
      completed: false,
      accepted: false,
      assignedBy: 'Manager A',
      data: [
        {
          slNo: 1,
          name: 'Alice Cooper',
          category: 'Customer Support',
          issue: 'Billing',
          description: 'Customer query about invoice discrepancy',
          status: 'Open',
          timeElapsed: '1h 30m'
        },
        {
          slNo: 2,
          name: 'Bob Martin',
          category: 'Technical Support',
          issue: 'Login',
          description: 'Unable to access account',
          status: 'In Progress',
          timeElapsed: '45m'
        },
        {
          slNo: 3,
          name: 'Carol White',
          category: 'Sales Inquiry',
          issue: 'Product Info',
          description: 'Requesting product specifications',
          status: 'Open',
          timeElapsed: '2h 15m'
        }
      ]
    },
    {
      taskID: 'TSK102',
      dateTime: '2025-10-27 14:20',
      taskType: 'Lead Verification',
      rows: 78,
      completed: true,
      accepted: true,
      assignedBy: 'Manager B',
      data: [
        {
          slNo: 1,
          name: 'David Brown',
          category: 'Lead Qualification',
          issue: 'Verification',
          description: 'Verify contact details and interest level',
          status: 'Resolved',
          timeElapsed: '30m'
        },
        {
          slNo: 2,
          name: 'Emma Wilson',
          category: 'Lead Qualification',
          issue: 'Follow-up',
          description: 'Schedule product demo call',
          status: 'Resolved',
          timeElapsed: '1h 10m'
        }
      ]
    },
    {
      taskID: 'TSK103',
      dateTime: '2025-10-27 11:00',
      taskType: 'Data Enrichment',
      rows: 120,
      completed: false,
      accepted: true,
      assignedBy: 'Manager C',
      data: [
        {
          slNo: 1,
          name: 'Frank Miller',
          category: 'Data Entry',
          issue: 'Missing Info',
          description: 'Complete company address and phone',
          status: 'In Progress',
          timeElapsed: '3h 00m'
        }
      ]
    },
    {
      taskID: 'TSK104',
      dateTime: '2025-10-26 16:45',
      taskType: 'Quality Assurance',
      rows: 65,
      completed: false,
      accepted: false,
      assignedBy: 'Manager A',
      data: [
        {
          slNo: 1,
          name: 'Grace Lee',
          category: 'QA Check',
          issue: 'Validation',
          description: 'Review data accuracy and completeness',
          status: 'Open',
          timeElapsed: '2h 30m'
        }
      ]
    }
  ]);

  const handleAcceptTaskFromDialog = (taskID) => {
    setAssignedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskID === taskID ? { ...task, accepted: true } : task
      )
    );
    toast.success(`Task ${taskID} accepted successfully!`);
    setViewDialogOpen(false);
  };

  const handleSubmitRejection = () => {
    const reason = rejectReason === 'other' ? otherReason : rejectReason;
    console.log({
      taskID: selectedTask?.taskID,
      reason: reason,
      additionalNotes: additionalNotes
    });
    toast.success(`Task ${selectedTask?.taskID} rejected successfully`);
    setShowRejectForm(false);
    setRejectReason('');
    setOtherReason('');
    setAdditionalNotes('');
    setViewDialogOpen(false);
  };

  const handleAcceptTask = (taskID) => {
    setAssignedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskID === taskID ? { ...task, accepted: true } : task
      )
    );
    toast.success(`Task ${taskID} accepted successfully!`);
  };

  const handleViewData = (task) => {
    setSelectedTask(task);
    setViewDialogOpen(true);
  };

  const handleToggleComplete = (taskID) => {
    setAssignedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskID === taskID ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getStatusClass = (status) => {
    const classes = {
      Open: 'bg-blue-100 text-blue-700 border-blue-300',
      'In Progress': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      Resolved: 'bg-green-100 text-green-700 border-green-300',
      Pending: 'bg-orange-100 text-orange-700 border-orange-300'
    };
    return classes[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getStatusIcon = (status) => {
    if (status === 'Resolved') return <CheckCircle className="w-4 h-4" />;
    if (status === 'Open' || status === 'Pending') return <AlertCircle className="w-4 h-4" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700 flex items-center gap-2">
              <ListChecks className="w-4 h-4" />
              Total Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {assignedTasks.length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-700 flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Accepted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {assignedTasks.filter((t) => t.accepted).length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {assignedTasks.filter((t) => t.completed).length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-amber-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              {assignedTasks.filter((t) => !t.accepted).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Table */}
      <Card className="border-2 border-gray-200 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
          <CardTitle className="text-2xl font-bold text-[#043927] flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl shadow-lg">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            Assigned Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50">
                  <TableHead className="font-bold text-gray-900">Done</TableHead>
                  <TableHead className="font-bold text-gray-900">Task ID</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden md:table-cell">Date & Time</TableHead>
                  <TableHead className="font-bold text-gray-900">Task Type</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden lg:table-cell">Rows</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden sm:table-cell">Status</TableHead>
                  <TableHead className="font-bold text-gray-900 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedTasks.map((task, index) => (
                  <TableRow
                    key={index}
                    className={`hover:bg-gradient-to-r transition-colors ${
                      task.completed
                        ? 'bg-green-50 hover:from-green-100 hover:to-emerald-100'
                        : task.accepted
                        ? 'hover:from-blue-50 hover:to-cyan-50'
                        : 'hover:from-amber-50 hover:to-yellow-50'
                    }`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleComplete(task.taskID)}
                        disabled={!task.accepted}
                        className="w-5 h-5"
                      />
                    </TableCell>
                    <TableCell className="font-bold text-[#043927]">
                      {task.taskID}
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-sm">
                      {task.dateTime}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold text-gray-900">{task.taskType}</div>
                        <div className="text-xs text-gray-500 md:hidden">{task.dateTime}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-300">
                        {task.rows} rows
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {task.accepted ? (
                        task.completed ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-300">
                            <CheckCircle className="w-3 h-3" />
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-300">
                            <TrendingUp className="w-3 h-3" />
                            In Progress
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-300">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleViewData(task)}
                          variant="outline"
                          size="sm"
                          className="border-2 border-[#043927] text-[#043927] hover:bg-[#043927] hover:text-white font-bold"
                        >
                          <Eye className="w-4 h-4 sm:mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        {!task.accepted && (
                          <Button
                            onClick={() => handleAcceptTask(task.taskID)}
                            size="sm"
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold"
                          >
                            <UserCheck className="w-4 h-4 sm:mr-1" />
                            <span className="hidden sm:inline">Accept</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Task Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#043927] flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-lg">
                <Eye className="w-5 h-5 text-white" />
              </div>
              Task Details - {selectedTask?.taskID}
            </DialogTitle>
            <DialogDescription>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div className="text-xs text-blue-700 font-bold uppercase">Task Type</div>
                  </div>
                  <div className="font-bold text-gray-900">{selectedTask?.taskType}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <div className="text-xs text-purple-700 font-bold uppercase">Date & Time</div>
                  </div>
                  <div className="font-bold text-gray-900">{selectedTask?.dateTime}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ListChecks className="w-4 h-4 text-green-600" />
                    <div className="text-xs text-green-700 font-bold uppercase">Total Rows</div>
                  </div>
                  <div className="font-bold text-gray-900">{selectedTask?.rows}</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border-2 border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-amber-600" />
                    <div className="text-xs text-amber-700 font-bold uppercase">Assigned By</div>
                  </div>
                  <div className="font-bold text-gray-900">{selectedTask?.assignedBy}</div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          {/* Task Data Table */}
          <div className="mt-6">
            <div className="overflow-x-auto bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 shadow-inner">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50">
                    <TableHead className="font-bold text-gray-900">Sl No.</TableHead>
                    <TableHead className="font-bold text-gray-900">Name</TableHead>
                    <TableHead className="font-bold text-gray-900">Category</TableHead>
                    <TableHead className="font-bold text-gray-900">Issue</TableHead>
                    <TableHead className="font-bold text-gray-900">Description</TableHead>
                    <TableHead className="font-bold text-gray-900">Status</TableHead>
                    <TableHead className="font-bold text-gray-900">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTask?.data?.map((row, index) => (
                    <TableRow key={index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50">
                      <TableCell className="font-semibold">{row.slNo}</TableCell>
                      <TableCell className="font-semibold text-gray-900">{row.name}</TableCell>
                      <TableCell className="text-gray-700">{row.category}</TableCell>
                      <TableCell className="text-gray-700">{row.issue}</TableCell>
                      <TableCell className="text-gray-700 max-w-xs truncate">{row.description}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusClass(row.status)}`}>
                          {getStatusIcon(row.status)}
                          {row.status}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{row.timeElapsed}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Action Buttons */}
          {!selectedTask?.accepted && (
            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t-2 border-gray-200">
              <Button
                onClick={() => handleAcceptTaskFromDialog(selectedTask?.taskID)}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg h-12 text-base"
              >
                <UserCheck className="w-5 h-5 mr-2" />
                Accept This Task
              </Button>
              <Button
                onClick={() => setShowRejectForm(true)}
                variant="outline"
                className="flex-1 border-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold h-12 text-base"
              >
                <UserX className="w-5 h-5 mr-2" />
                Reject This Task
              </Button>
            </div>
          )}

          {/* Reject Form */}
          {showRejectForm && (
            <div className="mt-6 p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border-2 border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-red-500 to-rose-600 p-2 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-red-900">Rejection Reason</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-bold text-gray-900 mb-3 block">
                    Please select a reason for rejecting this task:
                  </Label>
                  <RadioGroup value={rejectReason} onValueChange={setRejectReason}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-gray-200 hover:border-red-300 transition-colors">
                        <RadioGroupItem value="insufficient_information" id="r1" />
                        <label
                          htmlFor="r1"
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          Insufficient information provided
                        </label>
                      </div>
                      <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-gray-200 hover:border-red-300 transition-colors">
                        <RadioGroupItem value="workload" id="r2" />
                        <label
                          htmlFor="r2"
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          Current workload too high
                        </label>
                      </div>
                      <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-gray-200 hover:border-red-300 transition-colors">
                        <RadioGroupItem value="out_of_scope" id="r3" />
                        <label
                          htmlFor="r3"
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          Task out of my scope
                        </label>
                      </div>
                      <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-gray-200 hover:border-red-300 transition-colors">
                        <RadioGroupItem value="timeline_issue" id="r4" />
                        <label
                          htmlFor="r4"
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          Timeline not feasible
                        </label>
                      </div>
                      <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-gray-200 hover:border-red-300 transition-colors">
                        <RadioGroupItem value="other" id="r5" />
                        <label
                          htmlFor="r5"
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          Other (please specify)
                        </label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {rejectReason === 'other' && (
                  <div className="space-y-2">
                    <Label htmlFor="otherReason" className="text-sm font-bold text-gray-900">
                      Specify Reason *
                    </Label>
                    <Input
                      id="otherReason"
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                      placeholder="Enter your reason..."
                      className="border-2 border-gray-300 focus:border-red-500"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes" className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    id="additionalNotes"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Add any additional context or comments..."
                    className="min-h-[100px] border-2 border-gray-300 focus:border-red-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectReason('');
                      setOtherReason('');
                      setAdditionalNotes('');
                    }}
                    variant="outline"
                    className="flex-1 border-2 border-gray-300 font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitRejection}
                    disabled={!rejectReason || (rejectReason === 'other' && !otherReason)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Submit Rejection
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignedTask;
