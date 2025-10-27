import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const Lead = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  // const sampleLeads = [
  //   { sl: 1, name: 'Aarav Mishra', category: 'Document Verification', issue: 'Caste certificate rejected without proper reason', priority: 'Critical', status: 'Open', assigned: 'Unassigned', time: '3h 24m' },
  //   { sl: 2, name: 'Diya Patel', category: 'Seat Allocation', issue: 'Merit rank 145 but not allotted in 2nd round', priority: 'High', status: 'In Progress', assigned: 'Priya Sharma', time: '1h 52m' },
  //   { sl: 3, name: 'Rohit Sahoo', category: 'Application Status', issue: 'Payment completed but application shows pending', priority: 'High', status: 'Open', assigned: 'Amit Patel', time: '4h 10m' },
  //   { sl: 4, name: 'Ananya Nayak', category: 'Merit List', issue: 'Name spelling error in published merit list', priority: 'Critical', status: 'In Progress', assigned: 'Sneha Das', time: '2h 05m' },
  //   { sl: 5, name: 'Karan Behera', category: 'Document Verification', issue: 'Income certificate upload failing repeatedly', priority: 'Normal', status: 'Open', assigned: 'Priya Sharma', time: '45m' },
  //   { sl: 6, name: 'Simran Parida', category: 'Seat Allocation', issue: 'Choice locking failed during counseling deadline', priority: 'Critical', status: 'Open', assigned: 'Unassigned', time: '5h 17m' },
  //   { sl: 7, name: 'Arjun Pradhan', category: 'Application Status', issue: 'Unable to download provisional allotment letter', priority: 'High', status: 'In Progress', assigned: 'Rahul Mishra', time: '1h 33m' },
  // ];
  const sampleLeads = [
    { sl: 1, name: 'Aarav Mishra', category: 'Document Verification', issue: 'Caste certificate rejected without proper reason', status: 'Open', time: '3h 24m' },
    { sl: 2, name: 'Diya Patel', category: 'Seat Allocation', issue: 'Merit rank 145 but not allotted in 2nd round', status: 'In Progress', time: '1h 52m' },
    { sl: 3, name: 'Rohit Sahoo', category: 'Application Status', issue: 'Payment completed but application shows pending', status: 'Open', time: '4h 10m' },
    { sl: 4, name: 'Ananya Nayak', category: 'Merit List', issue: 'Name spelling error in published merit list', status: 'In Progress', time: '2h 05m' },
    { sl: 5, name: 'Karan Behera', category: 'Document Verification', issue: 'Income certificate upload failing repeatedly', status: 'Open', time: '45m' },
    { sl: 6, name: 'Simran Parida', category: 'Seat Allocation', issue: 'Choice locking failed during counseling deadline', status: 'Open', time: '5h 17m' },
    { sl: 7, name: 'Arjun Pradhan', category: 'Application Status', issue: 'Unable to download provisional allotment letter', status: 'In Progress', time: '1h 33m' },
  ];

  const filteredLeads = sampleLeads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         lead.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !priorityFilter || lead.priority.toLowerCase() === priorityFilter;
    const matchesStatus = !statusFilter || lead.status.toLowerCase().replace(' ', '') === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityClass = (priority) => {
    const classes = {
      Critical: 'bg-red-100 text-red-700',
      High: 'bg-orange-100 text-orange-700',
      Normal: 'bg-blue-100 text-blue-700',
    };
    return classes[priority] || 'bg-gray-100 text-gray-700';
  };

  const getStatusClass = (status) => {
    const classes = {
      Open: 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-700',
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredLeads);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, 'leads_data.xlsx');
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const viewDetails = (lead) => {
    setOpenDropdown(null);
    setModalContent({
      title: 'Lead Details',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Student Name</p>
              <p className="font-semibold text-gray-800">{lead.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-semibold text-gray-800">{lead.category}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-gray-600">Issue</p>
              <p className="font-semibold text-gray-800">{lead.issue}</p>
            </div>
            {/* <div>
              <p className="text-sm text-gray-600">Priority</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityClass(lead.priority)}`}>
                {lead.priority}
              </span>
            </div> */}
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(lead.status)}`}>
                {lead.status}
              </span>
            </div>
            {/* <div>
              <p className="text-sm text-gray-600">Assigned To</p>
              <p className="font-semibold text-gray-800">{lead.assigned}</p>
            </div> */}
            <div>
              <p className="text-sm text-gray-600">Time Elapsed</p>
              <p className="font-semibold text-gray-800">{lead.time}</p>
            </div>
          </div>
        </div>
      ),
    });
    setModalOpen(true);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Lead Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and track all queries</p>
        </div>
        <button
          onClick={downloadExcel}
          className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2"
        >
          <span>📥</span>
          Download Excel
        </button>
      </div>

      {/* Filters Section - Responsive */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {/* <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
          </select> */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="inprogress">In Progress</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setPriorityFilter('');
              setStatusFilter('');
            }}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table - Responsive with horizontal scroll */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Sl No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Issue</th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Priority</th> */}
                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                {/* <th className="hidden xl:table-cell px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Assigned</th> */}
                <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.sl} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {lead.sl}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{lead.name}</td>
                  <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-600">{lead.category}</td>
                  <td className="hidden lg:table-cell px-4 py-4 text-sm text-gray-600 max-w-xs">
                    {truncateText(lead.issue, 50)}
                  </td>
                  {/* <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(lead.priority)}`}>
                      {lead.priority}
                    </span>
                  </td> */}
                  <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  {/* <td className="hidden xl:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-600">{lead.assigned}</td> */}
                  <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-600">{lead.time}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium relative">
                    <button
                      onClick={() => toggleDropdown(lead.sl)}
                      className="text-purple-600 hover:text-purple-900 font-bold text-xl"
                    >
                      ⋮
                    </button>
                    {openDropdown === lead.sl && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                        <button
                          onClick={() => viewDetails(lead)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                        >
                          View Details
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Edit
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg">
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Shown only on very small screens */}
        <div className="sm:hidden divide-y divide-gray-200">
          {filteredLeads.map((lead) => (
            <div key={lead.sl} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{lead.name}</p>
                  <p className="text-xs text-gray-500">#{8000 + lead.sl}</p>
                </div>
                <button
                  onClick={() => viewDetails(lead)}
                  className="text-purple-600 text-sm font-medium"
                >
                  View
                </button>
              </div>
              <div className="flex gap-2">
                {/* <span className={`px-2 py-1 text-xs rounded-full ${getPriorityClass(lead.priority)}`}>
                  {lead.priority}
                </span> */}
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{truncateText(lead.issue, 80)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">{modalContent?.title}</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="px-4 sm:px-6 py-4">{modalContent?.content}</div>
            <div className="sticky bottom-0 bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 border-t border-gray-200">
              <button
                onClick={() => setModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lead;
