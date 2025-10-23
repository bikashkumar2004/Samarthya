import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const AICallManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [autocallerEnabled, setAutocallerEnabled] = useState(false);


  // const sampleCalls = [
  //   { sl: 1, name: 'Priyanka Jena', category: 'Document Reminder', work: 'Pending', sentiment: 'Positive', duration: '1m 34s' },
  //   { sl: 2, name: 'Sagar Mohanty', category: 'Counseling Notification', work: 'Completed', sentiment: 'Positive', duration: '2m 12s' },
  //   { sl: 3, name: 'Ritika Das', category: 'Merit List Query', work: 'Follow-up', sentiment: 'Negative', duration: '3m 45s' },
  //   { sl: 4, name: 'Vikash Kumar', category: 'Fee Payment', work: 'Resolved', sentiment: 'Positive', duration: '1m 58s' },
  //   { sl: 5, name: 'Swati Pradhan', category: 'Seat Allocation', work: 'Pending', sentiment: 'Neutral', duration: '2m 30s' },
  //   { sl: 6, name: 'Arjun Sahoo', category: 'Document Submission', work: 'Completed', sentiment: 'Positive', duration: '2m 05s' },
  // ];
  const sampleCalls = [
    { sl: 1, name: 'Priyanka Jena', category: 'Document Reminder', work: 'Pending', sentiment: 'Positive' },
    { sl: 2, name: 'Sagar Mohanty', category: 'Counseling Notification', work: 'Completed', sentiment: 'Positive' },
    { sl: 3, name: 'Ritika Das', category: 'Merit List Query', work: 'Follow-up', sentiment: 'Negative' },
    { sl: 4, name: 'Vikash Kumar', category: 'Fee Payment', work: 'Resolved', sentiment: 'Positive' },
    { sl: 5, name: 'Swati Pradhan', category: 'Seat Allocation', work: 'Pending', sentiment: 'Neutral' },
    { sl: 6, name: 'Arjun Sahoo', category: 'Document Submission', work: 'Completed', sentiment: 'Positive' },
  ];

  const filteredCalls = sampleCalls.filter((call) => {
    const matchesSearch = call.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSentiment = !sentimentFilter || call.sentiment.toLowerCase() === sentimentFilter;
    return matchesSearch && matchesSentiment;
  });

  const getSentimentClass = (sentiment) => {
    const classes = {
      Positive: 'text-green-600 bg-green-100',
      Neutral: 'text-yellow-600 bg-yellow-100',
      Negative: 'text-red-600 bg-red-100',
    };
    return classes[sentiment] || 'text-gray-600 bg-gray-100';
  };

  const getWorkStatusClass = (work) => {
    const classes = {
      Completed: 'bg-green-100 text-green-700',
      Resolved: 'bg-blue-100 text-blue-700',
      Pending: 'bg-yellow-100 text-yellow-700',
      'Follow-up': 'bg-orange-100 text-orange-700',
    };
    return classes[work] || 'bg-gray-100 text-gray-700';
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredCalls);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'AI Calls');
    XLSX.writeFile(wb, 'ai_calls_data.xlsx');
  };

  const viewSummary = (call) => {
    setModalContent({
      title: 'Call Summary',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Student Name</p>
              <p className="font-semibold text-gray-800">{call.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-semibold text-gray-800">{call.category}</p>
            </div>
            {/* <div>
              <p className="text-sm text-gray-600">Call Duration</p>
              <p className="font-semibold text-gray-800">{call.duration}</p>
            </div> */}
            <div>
              <p className="text-sm text-gray-600">Sentiment</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getSentimentClass(call.sentiment)}`}>
                {call.sentiment}
              </span>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-gray-600">Work Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getWorkStatusClass(call.work)}`}>
                {call.work}
              </span>
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">Call Summary:</p>
            <p className="text-sm text-gray-800">
              The automated call was made to remind about {call.category.toLowerCase()}.
              The student responded {call.sentiment.toLowerCase()}ly and the issue was {call.work.toLowerCase()}.
              Follow-up actions have been noted in the system.
            </p>
          </div>
        </div>
      ),
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">AI Call Manager</h1>
          <p className="text-sm text-gray-600 mt-1">Track and manage automated calls</p>
        </div>
        <button
          onClick={downloadExcel}
          className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2"
        >
          <span>📥</span>
          Download Excel
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-600">Total Calls</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">{filteredCalls.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-600">Completed</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {filteredCalls.filter(c => c.work === 'Completed').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-600">Pending</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {filteredCalls.filter(c => c.work === 'Pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-600">Positive Sentiment</h3>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {filteredCalls.filter(c => c.sentiment === 'Positive').length}
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Autocaller Toggle - First Column */}
          <div className="flex items-center justify-center sm:justify-start">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Autocaller</span>
              <button
                onClick={() => setAutocallerEnabled(!autocallerEnabled)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${autocallerEnabled
                    ? 'bg-green-500 focus:ring-green-500'
                    : 'bg-gray-300 focus:ring-gray-400'
                  }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${autocallerEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setSentimentFilter('');
            }}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>



      {/* Table - Desktop View */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Sl No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Take Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Call Sentiment</th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Call Duration</th> */}
                <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">More info</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCalls.map((call) => (
                <tr key={call.sl} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{call.sl}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{call.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{call.category}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => viewSummary(call)}
                      className="text-black font-medium text-sm"
                    >
                      Contact Now
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSentimentClass(call.sentiment)}`}>
                      {call.sentiment}
                    </span>
                  </td>
                  {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{call.duration}</td> */}
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => viewSummary(call)}
                      className="text-black font-medium text-sm"
                    >
                      View Summary
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card View - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredCalls.map((call) => (
          <div key={call.sl} className="bg-white rounded-lg shadow-md p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900">{call.name}</p>
                <p className="text-sm text-gray-600">{call.category}</p>
              </div>
              <span className="text-xs text-gray-500">{call.duration}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => viewSummary(call)}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg transition-colors text-sm"
              >
                Assign
              </button>
              <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getSentimentClass(call.sentiment)}`}>
                {call.sentiment}
              </span>
            </div>
            <button
              onClick={() => viewSummary(call)}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg transition-colors text-sm"
            >
              View Summary
            </button>
          </div>
        ))}
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
            <div className="sticky bottom-0 bg-gray-50 px-4 sm:px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg  transition-colors"
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

export default AICallManager;
