import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Phone, 
  TrendingUp, 
  AlertCircle, 
  Users, 
  Megaphone,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Man = () => {
  const [showAllAgents, setShowAllAgents] = useState(false);
  const navigate = useNavigate();

  // Agent performance data
  const agentData = [
    { agent: 'John Doe', calls: 45, sentiment: '😊 Positive' },
    { agent: 'Sarah Smith', calls: 38, sentiment: '😐 Neutral' },
    { agent: 'Mike Johnson', calls: 52, sentiment: '😊 Positive' },
    { agent: 'Emily Davis', calls: 29, sentiment: '😢 Negative' },
    { agent: 'David Wilson', calls: 41, sentiment: '😐 Neutral' },
    { agent: 'Lisa Brown', calls: 36, sentiment: '😊 Positive' },
    { agent: 'Tom Anderson', calls: 48, sentiment: '😐 Neutral' },
    { agent: 'Amy Martinez', calls: 33, sentiment: '😢 Negative' },
    { agent: 'Chris Taylor', calls: 44, sentiment: '😊 Positive' },
    { agent: 'Jessica Lee', calls: 39, sentiment: '😐 Neutral' },
  ];

  // Campaign status data
  const campaignData = [
    { name: 'Healthcare Outreach', createdBy: 'Admin', program: 'Health Services' },
    { name: 'Tax Assistance 2025', createdBy: 'John Doe', program: 'Revenue Dept' },
    { name: 'Education Survey', createdBy: 'Sarah Smith', program: 'Education Board' },
    { name: 'License Renewal', createdBy: 'Mike Johnson', program: 'Transport Dept' },
    { name: 'Vaccination Drive', createdBy: 'Admin', program: 'Health Services' },
  ];

  const displayedAgents = showAllAgents ? agentData : agentData.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Manager Command Center
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
              Live Operations
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">Real-time team throughput, connect performance, and clinical sentiment telemetry</p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Total Summary Card */}
        <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="flex items-center gap-2.5 text-sm font-bold text-slate-900 dark:text-slate-100">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Phone className="w-4 h-4" />
              </div>
              Call Volume & Connect Throughput
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="flex justify-between items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-0.5">Total Voice Sessions Dispatched</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">456</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
              <div>
                <p className="text-xs font-medium text-emerald-800 dark:text-emerald-400 mb-0.5">Average Connect Rate</p>
                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">82.4%</p>
              </div>
              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-1 rounded-full">
                <ArrowRight className="w-3.5 h-3.5" />
                +5.2% vs last week
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sentiment Breakdown Card */}
        <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="flex items-center gap-2.5 text-sm font-bold text-slate-900 dark:text-slate-100">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Users className="w-4 h-4" />
              </div>
              Conversational Sentiment Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                <div className="text-3xl mb-1">😊</div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100">245</div>
                <div className="text-[11px] font-medium text-slate-500">Positive</div>
                <div className="mt-1 text-[11px] text-emerald-600 font-bold">53.7%</div>
              </div>
              <div className="text-center p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
                <div className="text-3xl mb-1">😐</div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100">156</div>
                <div className="text-[11px] font-medium text-slate-500">Neutral</div>
                <div className="mt-1 text-[11px] text-indigo-600 font-bold">34.2%</div>
              </div>
              <div className="text-center p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                <div className="text-3xl mb-1">😢</div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100">55</div>
                <div className="text-[11px] font-medium text-slate-500">Negative</div>
                <div className="mt-1 text-[11px] text-rose-600 font-bold">12.1%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Required Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Action Required by Supervisor</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Task Rejection Request */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="flex items-center justify-center w-10 h-10 bg-amber-50 dark:bg-amber-950/50 text-amber-600 font-bold rounded-xl text-sm border border-amber-200/50">
                5
              </div>
              <div>
                <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">Task Rejection Requests</p>
                <p className="text-[11px] text-slate-500">Agents flagged invalid lead numbers or duplicates</p>
              </div>
            </div>
            <Button 
              size="sm"
              onClick={() => navigate('/manager/review-rejection')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              Review & Reassign
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>

          {/* Escalated Tickets */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="flex items-center justify-center w-10 h-10 bg-rose-50 dark:bg-rose-950/50 text-rose-600 font-bold rounded-xl text-sm border border-rose-200/50">
                12
              </div>
              <div>
                <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">Negative Clinical Sentiments</p>
                <p className="text-[11px] text-slate-500">High friction patient calls requiring followup</p>
              </div>
            </div>
            <Button 
              size="sm"
              variant="outline"
              onClick={() => navigate('/agent/pending-followups')}
              className="rounded-xl text-xs font-semibold border-slate-200 dark:border-slate-800 hover:bg-slate-50"
            >
              Inspect Audits
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Agent Performance Table */}
        <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <CardHeader className="py-3 px-5 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
              <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Users className="w-4 h-4" />
              </div>
              Agent Call Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                    <TableHead className="text-xs font-semibold text-slate-500">Agent</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Calls Taken</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Dominant Sentiment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedAgents.map((agent, index) => (
                    <TableRow 
                      key={index} 
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                    >
                      <TableCell className="font-semibold text-xs text-slate-800 dark:text-slate-200">{agent.agent}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50">
                          {agent.calls} calls
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 dark:text-slate-400">{agent.sentiment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="p-3 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllAgents(!showAllAgents)}
                className="w-full text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                {showAllAgents ? (
                  <>
                    Show Less <ChevronUp className="w-3.5 h-3.5 ml-1.5" />
                  </>
                ) : (
                  <>
                    View All {agentData.length} Agents <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Status Table */}
        <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <CardHeader className="py-3 px-5 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
              <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Megaphone className="w-4 h-4" />
              </div>
              Active Outreach Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                    <TableHead className="text-xs font-semibold text-slate-500">Campaign Name</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Lead Creator</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Program Classification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignData.map((campaign, index) => (
                    <TableRow 
                      key={index} 
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                    >
                      <TableCell className="font-semibold text-xs text-slate-800 dark:text-slate-200">{campaign.name}</TableCell>
                      <TableCell className="text-xs text-slate-500">{campaign.createdBy}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {campaign.program}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Man;
