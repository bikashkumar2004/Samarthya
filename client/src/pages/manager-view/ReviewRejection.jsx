import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Eye,
  Calendar,
  User,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReviewRejection = () => {
  const navigate = useNavigate();
  
  // Sample rejection requests data
  const rejectionRequests = [
    {
      id: 1,
      number: '#REJ-001',
      agentName: 'John Doe',
      dateAssigned: '2025-10-25',
      reason: 'Lead contact number is invalid and unreachable after multiple attempts',
    },
    {
      id: 2,
      number: '#REJ-002',
      agentName: 'Sarah Smith',
      dateAssigned: '2025-10-26',
      reason: 'Customer requested to be removed from contact list',
    },
    {
      id: 3,
      number: '#REJ-003',
      agentName: 'Mike Johnson',
      dateAssigned: '2025-10-27',
      reason: 'Lead does not match the target demographic for this campaign',
    },
    {
      id: 4,
      number: '#REJ-004',
      agentName: 'Emily Davis',
      dateAssigned: '2025-10-27',
      reason: 'Duplicate entry - already contacted by another agent',
    },
    {
      id: 5,
      number: '#REJ-005',
      agentName: 'David Wilson',
      dateAssigned: '2025-10-28',
      reason: 'Language barrier - lead requires non-English speaking agent',
    },
  ];

  const [requests, setRequests] = useState(rejectionRequests);

  const handleApprove = (id) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    alert(`Rejection request ${id} approved successfully!`);
  };

  const handleDenyAndReassign = (id) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    alert(`Rejection request ${id} denied and reassigned to another agent!`);
  };

  const handleView = (request) => {
    alert(`Viewing details for ${request.number}\nAgent: ${request.agentName}\nReason: ${request.reason}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-2">
            Review Rejection Requests
          </h1>
          <p className="text-gray-600">Review and manage agent task rejection requests</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-red-200">
            <span className="text-2xl font-bold text-red-600">{requests.length}</span>
            <span className="text-sm text-gray-600">Pending Requests</span>
          </div>
        </div>

        {/* Rejection Request Cards */}
        <div className="space-y-6">
          {requests.length > 0 ? (
            requests.map((request) => (
              <Card 
                key={request.id} 
                className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Card Header with gradient */}
                <div className="bg-gradient-to-r from-red-50 via-orange-50 to-red-50 p-6 border-b-2 border-red-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Number */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Request Number</p>
                        <p className="font-bold text-gray-800">{request.number}</p>
                      </div>
                    </div>

                    {/* Agent Name */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Agent Name</p>
                        <p className="font-semibold text-gray-800">{request.agentName}</p>
                      </div>
                    </div>

                    {/* Date Assigned */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Date Assigned</p>
                        <p className="font-semibold text-gray-800">{request.dateAssigned}</p>
                      </div>
                    </div>

                    {/* View Button */}
                    <div className="flex items-center justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(request)}
                        className="hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-all duration-200"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <CardContent className="p-6">
                  {/* Reason for Rejection */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <div className="w-1 h-5 bg-red-500 rounded"></div>
                      Reason for Rejection
                    </h3>
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                      <p className="text-gray-700 leading-relaxed">{request.reason}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => handleApprove(request.id)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-6"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Approve Reason for Rejection
                    </Button>
                    
                    <Button
                      onClick={() => handleDenyAndReassign(request.id)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-6"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Deny Rejection & Reassign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-0 shadow-xl bg-white">
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">All Clear!</h3>
                <p className="text-gray-600">No pending rejection requests at this time.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewRejection;
