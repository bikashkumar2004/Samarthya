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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Task Rejection Audits
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/50">
              {requests.length} Pending Actions
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">Review agent dismissal justifications and approve return or reassign to another agent</p>
        </div>
      </div>

      {/* Rejection Request Cards */}
      <div className="space-y-4">
        {requests.length > 0 ? (
          requests.map((request) => (
            <Card 
              key={request.id} 
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-slate-50/70 dark:bg-slate-950/60 p-4 border-b border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                  {/* Number */}
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 rounded-lg">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Request ID</p>
                      <p className="font-bold text-xs text-slate-800 dark:text-slate-200">{request.number}</p>
                    </div>
                  </div>

                  {/* Agent Name */}
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Agent</p>
                      <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">{request.agentName}</p>
                    </div>
                  </div>

                  {/* Date Assigned */}
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Assigned</p>
                      <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">{request.dateAssigned}</p>
                    </div>
                  </div>

                  {/* View Details */}
                  <div className="flex items-center justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(request)}
                      className="text-xs text-slate-500 hover:text-indigo-600 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View Lead Record
                    </Button>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <CardContent className="p-5">
                {/* Reason for Rejection */}
                <div className="mb-5">
                  <h3 className="text-xs font-semibold text-slate-500 mb-2">
                    Agent Justification & Notes:
                  </h3>
                  <div className="p-3.5 bg-rose-50/40 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/30">
                    <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed">{request.reason}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleApprove(request.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold py-2.5 shadow-xs"
                  >
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    Approve Dismissal & Archive
                  </Button>
                  
                  <Button
                    onClick={() => handleDenyAndReassign(request.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold py-2.5 shadow-xs"
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Deny & Reassign to Next Agent
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-12 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Queue Fully Audited</h3>
            <p className="text-xs text-slate-500">There are no pending agent task rejection requests requiring manager action.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReviewRejection;
