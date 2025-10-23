import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Calls',
      value: '1936',
      change: '↑ 12% from yesterday',
      color: 'border-purple-500',
      changeColor: 'text-green-600',
    },
    {
      title: 'Pending Calls',
      value: '89',
      change: '5 critical tickets',
      color: 'border-pink-500',
      changeColor: 'text-red-600',
    },
    {
      title: 'Avg. Calls Time',
      value: '2.3h',
      change: '↑ 18% improvement',
      color: 'border-blue-500',
      changeColor: 'text-green-600',
    },
    {
      title: 'AI Calls Completed',
      value: '1,847',
      change: '82% success rate',
      color: 'border-green-500',
      changeColor: 'text-green-600',
    },
  ];

  const ticketData = [
    { date: 'Oct 16', value: 200 },
    { date: 'Oct 17', value: 240 },
    { date: 'Oct 18', value: 270 },
    { date: 'Oct 19', value: 290 },
    { date: 'Oct 20', value: 355 },
    { date: 'Oct 21', value: 310 },
    { date: 'Oct 22', value: 247 },
  ];

  const categoryData = [
    { name: 'Application Status', value: 35 },
    { name: 'Document Issues', value: 25 },
    { name: 'Merit List Query', value: 20 },
    { name: 'Seat Allocation', value: 12 },
    { name: 'Other', value: 8 },
  ];

  const COLORS = ['#7C3AED', '#9333EA', '#3B82F6', '#10B981', '#D1D5DB'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back! Here's your overview</p>
        </div>
        <button className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg cursor-pointer transition-colors">
          Generate Report
        </button>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 ${stat.color} hover:shadow-lg transition-shadow`}
          >
            <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
            <p className={`text-xs sm:text-sm ${stat.changeColor}`}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Section - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Trends Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Performance</h3>
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ticketData}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ fontSize: '14px' }}
                  wrapperStyle={{ outline: 'none' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#7C3AED" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Distribution</h3>
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => 
                    window.innerWidth > 640 ? `${name}: ${(percent * 100).toFixed(0)}%` : `${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={window.innerWidth < 640 ? 60 : 80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '14px' }} />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  layout={window.innerWidth < 640 ? 'horizontal' : 'vertical'}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Performance Chart */}
        {/* <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Performance</h3>
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ticketData}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ fontSize: '14px' }}
                  wrapperStyle={{ outline: 'none' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#7C3AED"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div> */}
      </div>

      {/* Recent Activity */}
      {/* <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'New ticket assigned', time: '2 minutes ago', type: 'success' },
            { action: 'Critical ticket resolved', time: '15 minutes ago', type: 'info' },
            { action: 'AI call completed', time: '1 hour ago', type: 'success' },
          ].map((activity, index) => (
            <div 
              key={index} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2"
            >
              <span className="text-sm text-gray-700">{activity.action}</span>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
