import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

const AssignedTask = () => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Mock data for assigned tasks - Replace with actual API call
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
          timeElapsed: '1h 30m',
        },
        {
          slNo: 2,
          name: 'Bob Martin',
          category: 'Technical Support',
          issue: 'Login',
          description: 'Unable to access account',
          status: 'In Progress',
          timeElapsed: '45m',
        },
        {
          slNo: 3,
          name: 'Carol White',
          category: 'Sales Inquiry',
          issue: 'Product Info',
          description: 'Requesting product specifications',
          status: 'Open',
          timeElapsed: '2h 15m',
        },
      ],
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
          timeElapsed: '30m',
        },
        {
          slNo: 2,
          name: 'Emma Wilson',
          category: 'Lead Qualification',
          issue: 'Follow-up',
          description: 'Schedule product demo call',
          status: 'Resolved',
          timeElapsed: '1h 10m',
        },
      ],
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
          timeElapsed: '3h 00m',
        },
      ],
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
          timeElapsed: '2h 30m',
        },
      ],
    },
    {
      taskID: 'TSK105',
      dateTime: '2025-10-26 10:15',
      taskType: 'Outreach Campaign',
      rows: 95,
      completed: true,
      accepted: true,
      assignedBy: 'Manager D',
      data: [
        {
          slNo: 1,
          name: 'Henry Davis',
          category: 'Email Campaign',
          issue: 'Response',
          description: 'Process email responses and update status',
          status: 'Resolved',
          timeElapsed: '1h 20m',
        },
      ],
    },
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

    // Add API call here to submit rejection with reason and additional notes
    console.log({
      taskID: selectedTask?.taskID,
      reason: reason,
      additionalNotes: additionalNotes,
    });

    toast.success(`Task ${selectedTask?.taskID} rejected successfully`);

    // Reset form
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

  return (
    <div className="space-y-6">
      {/* Assigned Tasks Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Tasks Assigned by Manager
        </h2>
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Task ID</TableHead>
                <TableHead className="whitespace-nowrap">Date/Time</TableHead>
                <TableHead className="whitespace-nowrap">Task Type</TableHead>
                <TableHead className="whitespace-nowrap">Rows</TableHead>
                <TableHead className="whitespace-nowrap">Completed</TableHead>
                <TableHead className="whitespace-nowrap">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedTasks.length > 0 ? (
                assignedTasks.map((task) => (
                  <TableRow key={task.taskID}>
                    <TableCell className="font-medium">{task.taskID}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {task.dateTime}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {task.taskType}
                    </TableCell>
                    <TableCell>{task.rows}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`complete-${task.taskID}`}
                          checked={task.completed}
                          onCheckedChange={() => handleToggleComplete(task.taskID)}
                        />
                        <label
                          htmlFor={`complete-${task.taskID}`}
                          className="text-sm cursor-pointer"
                        >
                          {task.completed ? 'Yes' : 'No'}
                        </label>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 flex-wrap">
                        {!task.accepted ? (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleAcceptTask(task.taskID)}
                            className="whitespace-nowrap"
                          >
                            Accept
                          </Button>
                        ) : (
                          <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-md whitespace-nowrap">
                            Accepted
                          </span>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewData(task)}
                          className="whitespace-nowrap"
                        >
                          View Data
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No tasks assigned yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-600">Total Tasks</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {assignedTasks.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-600">Accepted</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {assignedTasks.filter((t) => t.accepted).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-600">Completed</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {assignedTasks.filter((t) => t.completed).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-600">Pending</h3>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            {assignedTasks.filter((t) => !t.accepted).length}
          </p>
        </div>
      </div>

      {/* View Data Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-5xl bg-white max-h-[90vh] p-0 gap-0">
          <div className="flex flex-col max-h-[90vh]">
            {/* Fixed Header */}
            <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
              <DialogTitle className="text-xl font-semibold">
                Task Details: {selectedTask?.taskID}
              </DialogTitle>
              <DialogDescription>
                <div className="space-y-1 text-sm mt-2">
                  <p>
                    <span className="font-semibold">Task Type:</span>{' '}
                    {selectedTask?.taskType}
                  </p>
                  <p>
                    <span className="font-semibold">Assigned By:</span>{' '}
                    {selectedTask?.assignedBy}
                  </p>
                  <p>
                    <span className="font-semibold">Date/Time:</span>{' '}
                    {selectedTask?.dateTime}
                  </p>
                  <p>
                    <span className="font-semibold">Total Rows:</span>{' '}
                    {selectedTask?.rows}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{' '}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedTask?.completed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                      {selectedTask?.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>

            {/* Scrollable Table Container */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="overflow-x-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Sl No.</TableHead>
                      <TableHead className="whitespace-nowrap">Name</TableHead>
                      <TableHead className="whitespace-nowrap">Category</TableHead>
                      <TableHead className="whitespace-nowrap">Issue</TableHead>
                      <TableHead className="whitespace-nowrap min-w-[200px]">
                        Description
                      </TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="whitespace-nowrap">
                        Time Elapsed
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTask?.data?.map((row) => (
                      <TableRow key={row.slNo}>
                        <TableCell className="font-medium">{row.slNo}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {row.name}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {row.category}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {row.issue}
                        </TableCell>
                        <TableCell className="min-w-[200px]" title={row.description}>
                          {row.description}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${row.status === 'Open'
                              ? 'bg-red-100 text-red-700'
                              : row.status === 'In Progress'
                                ? 'bg-yellow-100 text-yellow-700'
                                : row.status === 'Resolved'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                          >
                            {row.status}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {row.timeElapsed}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Accept/Reject Buttons */}
              {!selectedTask?.accepted && (
                <div className="mt-6 flex gap-3 flex-wrap">
                  <Button
                    onClick={() => handleAcceptTaskFromDialog(selectedTask?.taskID)}
                    className="flex-1 sm:flex-none"
                  >
                    Accept Task
                  </Button>
                  <Button
                    onClick={() => setShowRejectForm(!showRejectForm)}
                    variant="destructive"
                    className="flex-1 sm:flex-none"
                  >
                    Reject with Reason
                  </Button>
                </div>
              )}

              {/* Reject Form */}
              {showRejectForm && (
                <div className="mt-6 p-6 border rounded-lg bg-gray-50 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Reject Task Reason
                  </h3>

                  <RadioGroup
                    value={rejectReason}
                    onValueChange={setRejectReason}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="workload" id="workload" />
                      <Label htmlFor="workload" className="cursor-pointer">
                        Workload too high
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="context" id="context" />
                      <Label htmlFor="context" className="cursor-pointer">
                        Need more context from manager
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="invalid" id="invalid" />
                      <Label htmlFor="invalid" className="cursor-pointer">
                        Data invalid
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="expertise" id="expertise" />
                      <Label htmlFor="expertise" className="cursor-pointer">
                        Outside my expertise
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="cursor-pointer">
                        Other
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Conditional Textarea for Other */}
                  {rejectReason === 'other' && (
                    <div className="space-y-2">
                      <Label htmlFor="other-reason">Please specify</Label>
                      <Textarea
                        id="other-reason"
                        placeholder="Please specify your reason..."
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  )}

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="additional-notes">Additional Notes</Label>
                    <Textarea
                      id="additional-notes"
                      placeholder="Add any additional notes or context..."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleSubmitRejection}
                      variant="destructive"
                      disabled={!rejectReason || (rejectReason === 'other' && !otherReason)}
                    >
                      Submit Rejection
                    </Button>
                    <Button
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectReason('');
                        setOtherReason('');
                        setAdditionalNotes('');
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* Info Section */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Task Guidelines:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Accept tasks before starting work on them</li>
          <li>Mark tasks as completed when all work is finished</li>
          <li>Click "View Data" to see detailed task information</li>
          <li>Contact your manager if you have questions about any task</li>
        </ul>
      </div>
    </div>
  );
};

export default AssignedTask;
