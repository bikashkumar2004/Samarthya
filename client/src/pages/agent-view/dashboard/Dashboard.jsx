import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import CategoryPopup from "../CategoryPopup";


const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false);

  const stats = {
    totalCalls: "1936",
    pendingCalls: "89",
    avgCallTime: "2.3h",
    aiCallsCompleted: "1,847",
  };

  const sentimentData = { positive: 65, negative: 20, neutral: 15 };

  const ticketData = [
    { date: "Oct 16", value: 200 },
    { date: "Oct 17", value: 240 },
    { date: "Oct 18", value: 270 },
    { date: "Oct 19", value: 290 },
    { date: "Oct 20", value: 355 },
    { date: "Oct 21", value: 310 },
    { date: "Oct 22", value: 247 },
  ];

  const categoryData = [
    { name: "Application Status", value: 35 },
    { name: "Document Issues", value: 25 },
    { name: "Merit List Query", value: 20 },
    { name: "Seat Allocation", value: 12 },
    { name: "Other", value: 8 },
  ];

  const sortedCategoryData = [...categoryData].sort(
    (a, b) => a.value - b.value
  );

  const COLORS = ["#7C3AED", "#9333EA", "#3B82F6", "#10B981", "#D1D5DB"];

  const handleTakeAction = (categoryName) => {
    alert(`Taking action for: ${categoryName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back! Here's your overview
          </p>
        </div>
        <button className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg cursor-pointer transition-colors">
          Generate Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(stats).map(([key, value], index) => (
            <div key={index} className="text-center">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                {key.replace(/([A-Z])/g, " $1")}
              </h3>
              <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Sentiment Analysis
        </h3>
        <div className="flex h-8 rounded-full overflow-hidden">
          <div
            className="bg-green-500 flex items-center justify-center text-white text-sm font-medium transition-all duration-300"
            style={{ width: `${sentimentData.positive}%` }}
          >
            {sentimentData.positive}% Positive
          </div>
          <div
            className="bg-red-500 flex items-center justify-center text-white text-sm font-medium transition-all duration-300"
            style={{ width: `${sentimentData.negative}%` }}
          >
            {sentimentData.negative}% Negative
          </div>
          <div
            className="bg-yellow-500 flex items-center justify-center text-white text-sm font-medium transition-all duration-300"
            style={{ width: `${sentimentData.neutral}%` }}
          >
            {sentimentData.neutral}% Neutral
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Weekly Performance
          </h3>
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ticketData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#7C3AED" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart + Popup */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-2 border-gray-300 relative">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Category Distribution
          </h3>
          <div className="w-full h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    window.innerWidth > 640
                      ? `${name}: ${(percent * 100).toFixed(0)}%`
                      : `${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={window.innerWidth < 640 ? 60 : 80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom legend */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-3 justify-center">
              {categoryData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ backgroundColor: `${COLORS[index]}20` }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: COLORS[index] }}
                  >
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* View Details Button */}
          <div className="absolute bottom-4 right-4">
            <button
              onClick={() => setShowPopup(true)}
              className="text-purple-600 text-sm font-medium hover:underline hover:text-purple-700 transition-all duration-200"
            >
              View Details
            </button>
          </div>

          {/* Show Popup */}
          {showPopup && (
            <CategoryPopup
              sortedCategoryData={sortedCategoryData}
              categoryData={categoryData}
              onClose={() => setShowPopup(false)}
              handleTakeAction={handleTakeAction}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
