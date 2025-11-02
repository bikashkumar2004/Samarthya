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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with Dropdown */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">
              Team Overview
            </h1>
            <p className="text-gray-600">Monitor team performance and workload distribution</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Sort by</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-white shadow-md hover:shadow-lg transition-shadow">
                <SelectValue placeholder="Select sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="workload">Workload</SelectItem>
                <SelectItem value="tasks">Open Tasks</SelectItem>
                <SelectItem value="sentiment">Sentiment</SelectItem>
                <SelectItem value="campaigns">Today Campaign</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Agent List Table */}
        <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              Agent List
              <span className="ml-auto text-sm font-normal text-gray-600">
                {agentData.length} agents
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Agent</TableHead>
                    <TableHead className="font-semibold text-gray-700">Open Tasks</TableHead>
                    <TableHead className="font-semibold text-gray-700">Today Campaign</TableHead>
                    <TableHead className="font-semibold text-gray-700">Average Sentiment</TableHead>
                    <TableHead className="font-semibold text-gray-700">Workload</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agentData.map((agent, index) => (
                    <TableRow 
                      key={index} 
                      className="hover:bg-purple-50 transition-colors duration-150"
                    >
                      <TableCell className="font-medium text-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {agent.agent.split(' ').map(n => n[0]).join('')}
                          </div>
                          {agent.agent}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                          {agent.openTasks}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
                          {agent.todayCampaign}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{agent.sentiment}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${agent.workloadColor}`}>
                          {agent.workload}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-all duration-200"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
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
        <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
              </div>
              Workload Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {workloadData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {item.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-800">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-700">{item.percentage}%</span>
                      {item.percentage >= 80 && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      {item.percentage >= 60 && item.percentage < 80 && (
                        <TrendingUp className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all duration-500 ease-out shadow-md`}
                        style={{ width: `${item.percentage}%` }}
                      >
                        <div className="h-full w-full animate-pulse opacity-40 bg-white"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-8 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">2</div>
                <div className="text-sm text-gray-600 mt-1">High Workload</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">2</div>
                <div className="text-sm text-gray-600 mt-1">Medium Workload</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">1</div>
                <div className="text-sm text-gray-600 mt-1">Low Workload</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Team;
