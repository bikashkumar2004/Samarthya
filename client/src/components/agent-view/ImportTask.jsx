import { fetchAllContactList, uploadContactList } from '@/store/agent-slice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { 
  FileSpreadsheet, 
  FileText, 
  Upload, 
  Trash2, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Download,
  Info
} from 'lucide-react';

const ImportTask = () => {
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const dispatch = useDispatch();

  // Sample format data
  const sampleFormat = [
    { header: 'Sl No.', example: '1' },
    { header: 'Name', example: 'John Doe' },
    { header: 'Category', example: 'Document Verification' },
    { header: 'Issue Description', example: 'Certificate issue' },
    { header: 'Status', example: 'Open' },
    { header: 'Time Elapsed', example: '2h 30m' }
  ];

  // Mock data for recent imports
  const [recentImports] = useState([
    {
      taskID: 'TSK001',
      dateTime: '2025-10-28 10:30',
      fileName: 'contacts_batch1.xlsx',
      rowsNo: 150,
      data: [
        {
          slNo: 1,
          name: 'John Doe',
          category: 'Document Verification',
          description: 'Certificate not received',
          status: 'Open',
          timeElapsed: '2h 30m'
        },
        {
          slNo: 2,
          name: 'Jane Smith',
          category: 'Seat Allocation',
          description: 'Rank not updated in system',
          status: 'In Progress',
          timeElapsed: '1h 15m'
        },
        // ... more data
      ]
    },
    // ... more tasks
  ]);

  // Handler functions (keep your existing ones)
  async function handleImportContact(event) {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const result = await dispatch(uploadContactList(file));
      if (result?.payload?.success) {
        toast.success("Contacts imported successfully!");
        dispatch(fetchAllContactList());
      } else {
        toast.error(result?.payload?.message || "Failed to import contacts");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Something went wrong while importing contacts.");
    } finally {
      event.target.value = null;
    }
  }

  const handleFileImport = (event, type) => {
    // Keep your existing implementation
  };

  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleCheckTaskId = () => {
    if (deleteTaskId.trim()) {
      const foundTask = recentImports.find((task) => task.taskID === deleteTaskId);
      if (foundTask) {
        setTaskToDelete(foundTask);
        setShowDeleteConfirmation(true);
        toast.success('Task found!');
      } else {
        toast.error('Task ID not found');
      }
    } else {
      toast.error('Please enter a Task ID');
    }
  };

  const handleDeleteTask = () => {
    toast.success(`Task ${taskToDelete.taskID} deleted successfully!`);
    setShowDeleteConfirmation(false);
    setDeleteTaskId('');
    setTaskToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteTaskId('');
    setTaskToDelete(null);
  };

  const handleViewData = (task) => {
    setSelectedTask(task);
    setViewDialogOpen(true);
  };

  const getStatusClass = (status) => {
    const classes = {
      'Open': 'bg-blue-100 text-blue-700 border-blue-300',
      'In Progress': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Resolved': 'bg-green-100 text-green-700 border-green-300',
      'Pending': 'bg-orange-100 text-orange-700 border-orange-300'
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
      {/* Alert Message */}
      {showAlert && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border-2 animate-in slide-in-from-top ${
          alertMessage.includes('✅') 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400' 
            : 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-400'
        }`}>
          <p className="font-bold text-lg">{alertMessage}</p>
        </div>
      )}

      {/* Import Section */}
      <Card className="border-2 border-gray-200 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 border-b-2 border-blue-200">
          <CardTitle className="text-2xl font-bold text-[#043927] flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl shadow-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            Import New Task
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Excel Upload */}
            <label className="group cursor-pointer">
              <div className="relative border-3 border-dashed border-gray-300 rounded-2xl p-8 hover:border-emerald-500 transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 group-hover:from-green-100 group-hover:to-emerald-100 group-hover:shadow-xl">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => handleFileImport(e, 'excel')}
                  className="hidden"
                />
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <FileSpreadsheet className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">Upload Excel File</p>
                    <p className="text-sm text-gray-600 mt-1">Click to browse or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-2">Supports .xlsx, .xls formats</p>
                  </div>
                </div>
              </div>
            </label>

            {/* CSV Upload */}
            <label className="group cursor-pointer">
              <div className="relative border-3 border-dashed border-gray-300 rounded-2xl p-8 hover:border-blue-500 transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 group-hover:from-blue-100 group-hover:to-cyan-100 group-hover:shadow-xl">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileImport(e, 'csv')}
                  className="hidden"
                />
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">Upload CSV File</p>
                    <p className="text-sm text-gray-600 mt-1">Click to browse or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-2">Supports .csv format</p>
                  </div>
                </div>
              </div>
            </label>
          </div>

          {/* Format Guide */}
          <Card className="mt-6 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-amber-900 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Required File Format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-800 mb-4">
                Make sure your file matches this exact structure for successful import.
              </p>
              <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-amber-100 to-yellow-100">
                      {sampleFormat.map((item, index) => (
                        <TableHead key={index} className="font-bold text-amber-900 border-r border-amber-200 last:border-r-0">
                          {item.header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      {sampleFormat.map((item, index) => (
                        <TableCell key={index} className="font-mono text-sm text-gray-700 border-r border-gray-200 last:border-r-0">
                          {item.example}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Delete Task Section */}
      <Card className="border-2 border-gray-200 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border-b-2 border-red-200">
          <CardTitle className="text-2xl font-bold text-[#043927] flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-500 to-rose-600 p-3 rounded-xl shadow-lg">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
            Delete Task
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Enter Task ID (e.g., TSK001)"
              value={deleteTaskId}
              onChange={(e) => setDeleteTaskId(e.target.value)}
              className="flex-1 border-2 border-gray-300 focus:border-red-500 h-12 text-base"
            />
            <Button
              onClick={handleCheckTaskId}
              className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold shadow-lg h-12 px-8"
            >
              Check Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Imports Table */}
      <Card className="border-2 border-gray-200 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-2xl font-bold text-[#043927] flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Download className="w-6 h-6 text-white" />
              </div>
              Recent Imports
            </CardTitle>
            <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full font-semibold">
              Total: {recentImports.length} imports
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50">
                  <TableHead className="font-bold text-gray-900">Task ID</TableHead>
                  <TableHead className="font-bold text-gray-900">Date & Time</TableHead>
                  <TableHead className="font-bold text-gray-900 hidden md:table-cell">File Name</TableHead>
                  <TableHead className="font-bold text-gray-900">Rows</TableHead>
                  <TableHead className="font-bold text-gray-900 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentImports.map((task, index) => (
                  <TableRow 
                    key={index} 
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-colors"
                  >
                    <TableCell className="font-bold text-[#043927]">
                      {task.taskID}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {task.dateTime}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-700">
                      <div className="flex items-center gap-2">
                        {task.fileName.endsWith('.xlsx') || task.fileName.endsWith('.xls') ? (
                          <FileSpreadsheet className="w-4 h-4 text-green-600" />
                        ) : (
                          <FileText className="w-4 h-4 text-blue-600" />
                        )}
                        {task.fileName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-300">
                        {task.rowsNo} rows
                      </span>
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
                        <Button
                          onClick={() => {
                            setTaskToDelete(task);
                            setShowDeleteConfirmation(true);
                          }}
                          variant="outline"
                          size="sm"
                          className="border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white font-bold"
                        >
                          <Trash2 className="w-4 h-4 sm:mr-1" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Data Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#043927] flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-lg">
                <Eye className="w-5 h-5 text-white" />
              </div>
              Task Data - {selectedTask?.taskID}
            </DialogTitle>
            <DialogDescription>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                  <div className="text-xs text-blue-700 font-semibold mb-1">File Name</div>
                  <div className="font-bold text-gray-900">{selectedTask?.fileName}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200">
                  <div className="text-xs text-purple-700 font-semibold mb-1">Date & Time</div>
                  <div className="font-bold text-gray-900">{selectedTask?.dateTime}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <div className="text-xs text-green-700 font-semibold mb-1">Total Rows</div>
                  <div className="font-bold text-gray-900">{selectedTask?.rowsNo}</div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <div className="overflow-x-auto bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50">
                    <TableHead className="font-bold text-gray-900">Sl No.</TableHead>
                    <TableHead className="font-bold text-gray-900">Name</TableHead>
                    <TableHead className="font-bold text-gray-900">Category</TableHead>
                    <TableHead className="font-bold text-gray-900">Description</TableHead>
                    <TableHead className="font-bold text-gray-900">Status</TableHead>
                    <TableHead className="font-bold text-gray-900">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTask?.data?.map((row, index) => (
                    <TableRow key={index} className="hover:bg-blue-50">
                      <TableCell className="font-semibold">{row.slNo}</TableCell>
                      <TableCell className="font-semibold text-gray-900">{row.name}</TableCell>
                      <TableCell className="text-gray-700">{row.category}</TableCell>
                      <TableCell className="text-gray-700">{row.description}</TableCell>
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
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              <div className="mt-4 space-y-4">
                <p className="text-gray-700">Are you sure you want to delete this task?</p>
                <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl border-2 border-red-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-red-700 font-semibold mb-1">Task ID</div>
                      <div className="font-bold text-gray-900">{taskToDelete?.taskID}</div>
                    </div>
                    <div>
                      <div className="text-xs text-red-700 font-semibold mb-1">Rows</div>
                      <div className="font-bold text-gray-900">{taskToDelete?.rowsNo}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-red-700 font-semibold mb-1">File Name</div>
                      <div className="font-bold text-gray-900">{taskToDelete?.fileName}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleCancelDelete}
                    variant="outline"
                    className="flex-1 border-2 border-gray-300 font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteTask}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold"
                  >
                    Delete Task
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportTask;
