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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Monitor your campaign performance and team metrics</p>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Summary Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                Total Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total calls</p>
                    <p className="text-3xl font-bold text-gray-800">456</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-sm">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Connect Rate</p>
                    <p className="text-3xl font-bold text-green-600">82%</p>
                  </div>
                  <div className="text-sm font-semibold text-green-600 flex items-center gap-1">
                    <ArrowRight className="w-4 h-4" />
                    +5.2%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Breakdown Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                Sentiment Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:scale-105 transition-transform duration-200 cursor-pointer shadow-sm">
                  <div className="text-5xl mb-3">😊</div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">245</div>
                  <div className="text-xs font-medium text-gray-600">Happy</div>
                  <div className="mt-2 text-xs text-green-600 font-semibold">53.7%</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl hover:scale-105 transition-transform duration-200 cursor-pointer shadow-sm">
                  <div className="text-5xl mb-3">😐</div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">156</div>
                  <div className="text-xs font-medium text-gray-600">Normal</div>
                  <div className="mt-2 text-xs text-yellow-600 font-semibold">34.2%</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl hover:scale-105 transition-transform duration-200 cursor-pointer shadow-sm">
                  <div className="text-5xl mb-3">😢</div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">55</div>
                  <div className="text-xs font-medium text-gray-600">Sad</div>
                  <div className="mt-2 text-xs text-red-600 font-semibold">12.1%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Required Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-800">Action Required</h2>
          </div>
          
          <Card className="border-0 shadow-lg bg-white overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Task Rejection Request */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-5 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-l-4 border-red-500 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                      <span className="text-xl font-bold text-red-600">5</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Task rejection request</p>
                      <p className="text-sm text-gray-600 mt-1">Requires immediate attention</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate('/manager/review-rejection')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Review & Reassign
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Escalated Tickets */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-5 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border-l-4 border-red-600 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                      <span className="text-xl font-bold text-red-600">12</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Escalated Tickets</p>
                      <p className="text-sm text-gray-600 mt-1">Negative sentiment needs action</p>
                    </div>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Review escalation
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent Performance Table */}
          <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                Agent Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Agent</TableHead>
                      <TableHead className="font-semibold text-gray-700">Calls</TableHead>
                      <TableHead className="font-semibold text-gray-700">Sentiment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedAgents.map((agent, index) => (
                      <TableRow 
                        key={index} 
                        className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
                      >
                        <TableCell className="font-medium text-gray-800">{agent.agent}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {agent.calls}
                          </span>
                        </TableCell>
                        <TableCell>{agent.sentiment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="p-4 bg-gray-50 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowAllAgents(!showAllAgents)}
                  className="w-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors duration-200"
                >
                  {showAllAgents ? (
                    <>
                      Show Less <ChevronUp className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      View All <ChevronDown className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Status Table */}
          <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Megaphone className="w-5 h-5 text-purple-600" />
                </div>
                Campaign Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Campaign Name</TableHead>
                      <TableHead className="font-semibold text-gray-700">Created By</TableHead>
                      <TableHead className="font-semibold text-gray-700">Program Title</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaignData.map((campaign, index) => (
                      <TableRow 
                        key={index} 
                        className="hover:bg-purple-50 transition-colors duration-150 cursor-pointer"
                      >
                        <TableCell className="font-medium text-gray-800">{campaign.name}</TableCell>
                        <TableCell className="text-gray-600">{campaign.createdBy}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
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
    </div>
  );
};

export default Man;
