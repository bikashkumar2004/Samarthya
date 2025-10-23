import { fetchAllContactList, uploadContactList } from '@/store/admin-slice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

const CreateTask = () => {
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const dispatch=useDispatch()

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

        // Validate file structure
        // const requiredColumns = [
        //   'Sl No.', 'Name', 'Category', 'Issue Description',
        //   'Priority', 'Status', 'Assigned To', 'Time Elapsed',
        // ];
        const requiredColumns = [
          'Name', 'Category', 'Issue Description',
          'Status', 'Time Elapsed',
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

  return (
    <div className="space-y-6">
      {/* Alert Message */}
      {showAlert && (
        <div className={`fixed top-20 right-4 z-50 px-4 sm:px-6 py-3 rounded-lg shadow-lg ${
          alertMessage.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        } animate-slide-in-right`}>
          <p className="text-sm sm:text-base font-medium">{alertMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Create Task</h1>
          <p className="text-sm text-gray-600 mt-1">Import tasks from CSV or Excel files</p>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Upload Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col items-center justify-center px-4 py-8 bg-purple-50 border-2 border-purple-300 border-dashed rounded-lg cursor-pointer hover:bg-purple-100 transition-colors">
              <span className="text-4xl mb-3">📄</span>
              <span className="text-base sm:text-lg font-semibold text-purple-600">Import CSV File</span>
              <span className="text-xs sm:text-sm text-gray-500 mt-2 text-center px-2">
                Click to browse or drag & drop
              </span>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleFileImport(e, 'csv')}
                className="hidden"
              />
            </label>

            <label className="flex flex-col items-center justify-center px-4 py-8 bg-green-50 border-2 border-green-300 border-dashed rounded-lg cursor-pointer hover:bg-green-100 transition-colors">
              <span className="text-4xl mb-3">📊</span>
              <span className="text-base sm:text-lg font-semibold text-green-600">Import Excel File</span>
              <span className="text-xs sm:text-sm text-gray-500 mt-2 text-center px-2">
                Click to browse or drag & drop
              </span>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportContact}
                className="hidden"
              />
            </label>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl sm:text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="text-sm sm:text-base font-semibold text-yellow-800 mb-2">
                  Important: File Format Requirements
                </p>
                <p className="text-xs sm:text-sm text-yellow-700">
                  Make sure your file matches this exact structure for successful import.
                </p>
              </div>
            </div>
          </div>

          {/* Sample Table Structure */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm sm:text-base font-semibold text-gray-800">
                Required Column Structure
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-primary">
                  <tr>
                    {[
                      'Sl No.',
                      'Name',
                      'Category',
                      'Issue Description',
                      // 'Priority',
                      'Status',
                      // 'Assigned To',
                      'Time Elapsed',
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">1</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      John Doe
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      Document Verification
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">
                      Certificate issue
                    </td>
                    {/* <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      High
                    </td> */}
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      Open
                    </td>
                    {/* <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      Agent Name
                    </td> */}
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      2h 30m
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">2</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      Jane Smith
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      Seat Allocation
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600">
                      Rank not updated
                    </td>
                    {/* <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      Critical
                    </td> */}
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      In Progress
                    </td>
                    {/* <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      Agent Name
                    </td> */}
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      1h 15m
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl sm:text-2xl">💡</span>
              <div className="flex-1 space-y-2">
                <p className="text-sm sm:text-base font-semibold text-blue-800">Tips for Success:</p>
                <ul className="text-xs sm:text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Ensure all column headers match exactly as shown above</li>
                  <li>Use consistent date and time formats</li>
                  <li>Remove any empty rows from your file</li>
                  <li>Save Excel files in .xlsx or .xls format</li>
                  <li>Maximum file size: 10MB</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
