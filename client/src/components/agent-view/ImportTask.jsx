import { fetchAllContactList, uploadContactList } from '@/store/agent-slice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const ImportTask = () => {
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const dispatch = useDispatch();

  // Mock data for recent imports - Replace with actual API call
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
          timeElapsed: '2h 30m',
        },
        {
          slNo: 2,
          name: 'Jane Smith',
          category: 'Seat Allocation',
          description: 'Rank not updated in system',
          status: 'In Progress',
          timeElapsed: '1h 15m',
        },
        {
          slNo: 3,
          name: 'Mike Johnson',
          category: 'Fee Payment',
          description: 'Payment receipt pending',
          status: 'Resolved',
          timeElapsed: '45m',
        },
        {
          slNo: 4,
          name: 'Sarah Williams',
          category: 'Admission',
          description: 'Missing transcript',
          status: 'Open',
          timeElapsed: '3h 20m',
        },
        {
          slNo: 5,
          name: 'Robert Brown',
          category: 'Scholarship',
          description: 'Scholarship form incomplete',
          status: 'Pending',
          timeElapsed: '1h 50m',
        },
      ],
    },
    {
      taskID: 'TSK002',
      dateTime: '2025-10-27 15:45',
      fileName: 'leads_export.csv',
      rowsNo: 89,
      data: [
        {
          slNo: 1,
          name: 'Emily Davis',
          category: 'Course Registration',
          description: 'Class timing conflict',
          status: 'Open',
          timeElapsed: '4h 10m',
        },
        {
          slNo: 2,
          name: 'David Wilson',
          category: 'Library Access',
          description: 'Library card not activated',
          status: 'In Progress',
          timeElapsed: '2h 05m',
        },
      ],
    },
    {
      taskID: 'TSK003',
      dateTime: '2025-10-27 09:20',
      fileName: 'customer_list.xlsx',
      rowsNo: 320,
      data: [
        {
          slNo: 1,
          name: 'Lisa Anderson',
          category: 'Hostel Accommodation',
          description: 'Room allocation pending',
          status: 'Open',
          timeElapsed: '5h 30m',
        },
      ],
    },
    {
      taskID: 'TSK004',
      dateTime: '2025-10-26 14:15',
      fileName: 'prospects_data.csv',
      rowsNo: 245,
      data: [
        {
          slNo: 1,
          name: 'Thomas Martinez',
          category: 'Exam Schedule',
          description: 'Exam dates not updated',
          status: 'Resolved',
          timeElapsed: '30m',
        },
      ],
    },
    {
      taskID: 'TSK005',
      dateTime: '2025-10-26 11:00',
      fileName: 'sales_contacts.xlsx',
      rowsNo: 178,
      data: [
        {
          slNo: 1,
          name: 'Jennifer Taylor',
          category: 'Transport',
          description: 'Bus pass not issued',
          status: 'Pending',
          timeElapsed: '1h 40m',
        },
      ],
    },
  ]);

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
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let data;
        if (type === 'excel') {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          data = XLSX.utils.sheet_to_json(firstSheet);
        } else {
          // CSV parsing
          const text = e.target.result;
          const lines = text.split('\n');
          const headers = lines[0].split(',');
          data = lines.slice(1).map((line) => {
            const values = line.split(',');
            const obj = {};
            headers.forEach((header, i) => {
              obj[header.trim()] = values[i]?.trim();
            });
            return obj;
          });
        }

        const requiredColumns = [
          'Name',
          'Category',
          'Issue Description',
          'Status',
          'Time Elapsed',
        ];

        const hasAllColumns = requiredColumns.every((col) =>
          Object.keys(data[0] || {}).some((key) =>
            key.toLowerCase().includes(col.toLowerCase())
          )
        );

        if (hasAllColumns) {
          showAlertMessage('Data imported successfully! ✅', 'success');
        } else {
          showAlertMessage('Invalid file format. Please check the required columns. ❌', 'error');
        }
      } catch (error) {
        showAlertMessage('Error importing file. Please check the file format. ❌', 'error');
      }
    };

    if (type === 'excel') {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }

    event.target.value = '';
  };

  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleCheckTaskId = () => {
    // Mock validation - replace with actual API call
    if (deleteTaskId.trim()) {
      // Check if task exists in recent imports
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
    // Implement actual delete logic here
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

  return (
    <div className="space-y-6">
      {/* Alert Message */}
      {showAlert && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-lg px-6 py-3 shadow-lg transition-all ${alertMessage.includes('✅')
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
            }`}
        >
          {alertMessage}
        </div>
      )}

      {/* Import Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Import tasks from CSV or Excel files
        </h2>

        {/* File Format Requirements */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Important: File Format Requirements
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Make sure your file matches this exact structure for successful import.
          </p>

          {/* Format Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {['Sl No.', 'Name', 'Category', 'Issue Description', 'Status', 'Time Elapsed'].map((header) => (
                    <th key={header} className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border border-gray-300 px-4 py-2">1</td>
                  <td className="border border-gray-300 px-4 py-2">John Doe</td>
                  <td className="border border-gray-300 px-4 py-2">Document Verification</td>
                  <td className="border border-gray-300 px-4 py-2">Certificate issue</td>
                  <td className="border border-gray-300 px-4 py-2">Open</td>
                  <td className="border border-gray-300 px-4 py-2">2h 30m</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">2</td>
                  <td className="border border-gray-300 px-4 py-2">Jane Smith</td>
                  <td className="border border-gray-300 px-4 py-2">Seat Allocation</td>
                  <td className="border border-gray-300 px-4 py-2">Rank not updated</td>
                  <td className="border border-gray-300 px-4 py-2">In Progress</td>
                  <td className="border border-gray-300 px-4 py-2">1h 15m</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleFileImport(e, 'csv')}
              className="hidden"
            />
            <div className="text-5xl mb-3">📄</div>
            <span className="font-semibold text-gray-700">Upload CSV File</span>
            <span className="text-xs text-gray-500 mt-1">.csv format</span>
          </label>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => handleFileImport(e, 'excel')}
              className="hidden"
            />
            <div className="text-5xl mb-3">📊</div>
            <span className="font-semibold text-gray-700">Upload Excel File</span>
            <span className="text-xs text-gray-500 mt-1">.xlsx or .xls format</span>
          </label>
        </div>
      </div>

      {/* Delete Task Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Delete Task</h3>
        <div className="flex gap-2 flex-wrap">
          <Input
            type="text"
            placeholder="Enter Task ID"
            value={deleteTaskId}
            onChange={(e) => setDeleteTaskId(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={handleCheckTaskId} variant="outline">
            Check ID
          </Button>
        </div>

        {/* Delete Confirmation Section */}
        {showDeleteConfirmation && taskToDelete && (
          <div className="mt-6 space-y-4">
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task ID</TableHead>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Rows</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{taskToDelete.taskID}</TableCell>
                      <TableCell>{taskToDelete.dateTime}</TableCell>
                      <TableCell>{taskToDelete.fileName}</TableCell>
                      <TableCell>{taskToDelete.rowsNo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col items-center gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-semibold text-red-700">
                Are you sure you want to delete this task?
              </p>
              <div className="flex gap-3">
                <Button onClick={handleDeleteTask} variant="destructive">
                  Confirm
                </Button>
                <Button onClick={handleCancelDelete} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Imports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Imports</h3>
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task ID</TableHead>
                <TableHead>Date/Time</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Rows</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentImports.map((item) => (
                <TableRow key={item.taskID}>
                  <TableCell className="font-medium">{item.taskID}</TableCell>
                  <TableCell>{item.dateTime}</TableCell>
                  <TableCell>{item.fileName}</TableCell>
                  <TableCell>{item.rowsNo}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewData(item)}
                    >
                      View Data
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                  <p><span className="font-semibold">File Name:</span> {selectedTask?.fileName}</p>
                  <p><span className="font-semibold">Import Date/Time:</span> {selectedTask?.dateTime}</p>
                  <p><span className="font-semibold">Total Rows:</span> {selectedTask?.rowsNo}</p>
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
                      <TableHead className="whitespace-nowrap min-w-[200px]">Description</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="whitespace-nowrap">Time Elapsed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTask?.data?.map((row) => (
                      <TableRow key={row.slNo}>
                        <TableCell className="font-medium">{row.slNo}</TableCell>
                        <TableCell className="whitespace-nowrap">{row.name}</TableCell>
                        <TableCell className="whitespace-nowrap">{row.category}</TableCell>
                        <TableCell className="min-w-[200px]" title={row.description}>
                          {row.description}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${row.status === 'Open' ? 'bg-red-100 text-red-700' :
                              row.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                                row.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-700'
                            }`}>
                            {row.status}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{row.timeElapsed}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* Tips Section */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Tips for Success:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Ensure column names match exactly</li>
          <li>Save Excel files as .xlsx or .xls format</li>
          <li>CSV files should be UTF-8 encoded</li>
          <li>Remove any empty rows at the end of your file</li>
        </ul>
      </div>
    </div>
  );
};

export default ImportTask;
