import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Users, 
  BarChart3,
  Eye,
  UserPlus,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const Team = () => {
  const [sortBy, setSortBy] = useState('workload');

  // Agent data
  const agentData = [
    { 
      agent: 'John Doe', 
      openTasks: 12, 
      todayCampaign: 3, 
      sentiment: '😊 Positive',
      workload: 'High',
      workloadColor: 'text-red-600 bg-red-50'
    },
    { 
      agent: 'Sarah Smith', 
      openTasks: 8, 
      todayCampaign: 2, 
      sentiment: '😐 Neutral',
      workload: 'Medium',
      workloadColor: 'text-yellow-600 bg-yellow-50'
    },
    { 
      agent: 'Mike Johnson', 
      openTasks: 15, 
      todayCampaign: 4, 
      sentiment: '😊 Positive',
      workload: 'High',
      workloadColor: 'text-red-600 bg-red-50'
    },
    { 
      agent: 'Emily Davis', 
      openTasks: 5, 
      todayCampaign: 1, 
      sentiment: '😢 Negative',
      workload: 'Low',
      workloadColor: 'text-green-600 bg-green-50'
    },
    { 
      agent: 'David Wilson', 
      openTasks: 10, 
      todayCampaign: 3, 
      sentiment: '😐 Neutral',
      workload: 'Medium',
      workloadColor: 'text-yellow-600 bg-yellow-50'
    },
    { 
      agent: 'Lisa Brown', 
      openTasks: 7, 
      todayCampaign: 2, 
      sentiment: '😊 Positive',
      workload: 'Medium',
      workloadColor: 'text-yellow-600 bg-yellow-50'
    },
  ];

  // Workload distribution data
  const workloadData = [
    { name: 'John Doe', percentage: 85, color: 'bg-gradient-to-r from-red-500 to-pink-500' },
    { name: 'Mike Johnson', percentage: 92, color: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { name: 'David Wilson', percentage: 68, color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    { name: 'Sarah Smith', percentage: 55, color: 'bg-gradient-to-r from-green-500 to-teal-500' },
    { name: 'Lisa Brown', percentage: 48, color: 'bg-gradient-to-r from-blue-500 to-indigo-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with Dropdown */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Team Operations & Workload
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50">
              {agentData.length} Active Agents
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">Live allocation status, campaign queues, and agent load balancing</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500">Sort by</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-xs">
              <SelectValue placeholder="Select sort" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
              <SelectItem value="workload">Workload Intensity</SelectItem>
              <SelectItem value="tasks">Open Tasks</SelectItem>
              <SelectItem value="sentiment">Average Sentiment</SelectItem>
              <SelectItem value="campaigns">Today's Campaigns</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Agent List Table */}
      <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="py-3.5 px-5 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="flex items-center gap-2.5 text-sm font-bold text-slate-900 dark:text-slate-100">
            <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
            Clinical & Voice Agents Roster
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                  <TableHead className="text-xs font-semibold text-slate-500">Agent</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500">Open Tasks</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500">Active Campaigns</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500">Average Sentiment</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500">Workload State</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agentData.map((agent, index) => (
                  <TableRow 
                    key={index} 
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                  >
                    <TableCell className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                          {agent.agent.split(' ').map(n => n[0]).join('')}
                        </div>
                        {agent.agent}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {agent.openTasks} tasks
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50">
                        {agent.todayCampaign} active
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{agent.sentiment}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        agent.workload === 'High' 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/50' 
                          : agent.workload === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                      }`}>
                        {agent.workload}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="h-8 px-2.5 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Workload Distribution Section */}
      <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <CardHeader className="py-3.5 px-5 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="flex items-center gap-2.5 text-sm font-bold text-slate-900 dark:text-slate-100">
            <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            Workload Distribution & Capacity Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="space-y-5">
            {workloadData.map((item, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                      {item.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{item.percentage}%</span>
                    {item.percentage >= 80 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200/50">
                        Near Cap
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.percentage >= 80 ? 'bg-rose-500' :
                      item.percentage >= 60 ? 'bg-indigo-600' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="text-center p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
              <div className="text-xl font-extrabold text-rose-600">2 Agents</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">High Workload (&gt;80%)</div>
            </div>
            <div className="text-center p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
              <div className="text-xl font-extrabold text-indigo-600">2 Agents</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">Balanced Load (50-80%)</div>
            </div>
            <div className="text-center p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
              <div className="text-xl font-extrabold text-emerald-600">1 Agent</div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">Available for New Queues</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Team;
