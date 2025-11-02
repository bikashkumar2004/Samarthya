import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import CategoryPopup from "../CategoryPopup";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardSummary,
  selectSummaryStatus,
  selectSummaryMetrics,
} from "@/store/dashboard";

const COLORS = ["#7C3AED", "#9333EA", "#3B82F6", "#10B981", "#D1D5DB"];

const Dashboard = () => {
  const dispatch = useDispatch(); // dispatch thunk to fetch backend data [web:215]
  const [showPopup, setShowPopup] = useState(false);

  const status = useSelector(selectSummaryStatus); // read async status from slice [web:215]
  const { totalCalls, avgCallHours, sentiments, acquiredAttention } = useSelector(selectSummaryMetrics); // read metrics [web:215]

  useEffect(() => {
    dispatch(fetchDashboardSummary({ sinceHours: 24 })); // fire createAsyncThunk on mount [web:184]
  }, [dispatch]); // dispatch is stable per React-Redux hooks [web:215]

  // Stats for cards with safe guards
  const stats = {
    totalCalls: status === "loading" ? "Loading..." : String(totalCalls || 0),
    pendingCalls:
      status === "loading" ? "Loading..." : String(acquiredAttention?.totalAttention ?? 0),
    avgCallTime:
      status === "loading"
        ? "Loading..."
        : `${Number.isFinite(avgCallHours) ? avgCallHours.toFixed(2) : "0.00"}h`,
    aiCallsCompleted:
      status === "loading"
        ? "Loading..."
        : String(Math.max(0, (totalCalls || 0) - (acquiredAttention?.totalAttention ?? 0))),
  }; // maps numbers to strings and avoids NaN/undefined while loading [web:199]

  // Normalize sentiment keys and types; auto-convert fractions (0–1) to percentages
  const sentimentData = useMemo(() => {
    if (status === "loading") return { positive: 0, negative: 0, neutral: 0 };

    const rawPos = Number(sentiments?.Positive ?? sentiments?.positive ?? 0);
    const rawNeg = Number(sentiments?.Negative ?? sentiments?.negative ?? 0);
    const rawNeu = Number(sentiments?.Neutral  ?? sentiments?.neutral  ?? 0);

    let p = Number.isFinite(rawPos) ? rawPos : 0;
    let n = Number.isFinite(rawNeg) ? rawNeg : 0;
    let u = Number.isFinite(rawNeu) ? rawNeu : 0;

    const sum = p + n + u;
    // If the backend sent fractions (e.g., 0.62), convert to percent
    if (sum > 0 && sum <= 1.5) {
      p *= 100;
      n *= 100;
      u *= 100;
    }

    // Round to 2 decimals for display
    return {
      positive: Math.round(p * 100) / 100,
      negative: Math.round(n * 100) / 100,
      neutral:  Math.round(u * 100) / 100,
    };
  }, [status, sentiments]); // derive display-ready sentiment safely [web:199]

  // Demo charts (replace later with real series if needed)
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

  const sortedCategoryData = useMemo(
    () => [...categoryData].sort((a, b) => a.value - b.value),
    []
  ); // memoize sort for perf [web:199]

  const handleTakeAction = (categoryName) => {
    alert(`Taking action for: ${categoryName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back! Here's your overview</p>
        </div>
        <button className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg cursor-pointer transition-colors">
          Generate Report
        </button>
      </div>

      {/* Error hint */}
      {status === "failed" && (
        <div className="rounded-md border p-3 text-sm text-red-700 bg-red-50">
          Failed to load summary. Check your API, auth, and network.
        </div>
      )}

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

      {/* Sentiment Overview */}
      <div className="bg-white rounded-lg shadow-md p-5 mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Sentiment Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-100 rounded-lg p-4 text-center">
            <div className="text-4xl">😊</div>
            <div className="text-2xl font-bold text-green-700 mt-2">{sentimentData.positive}%</div>
            <div className="text-sm text-green-700">Positive</div>
          </div>
          <div className="bg-yellow-100 rounded-lg p-4 text-center">
            <div className="text-4xl">😐</div>
            <div className="text-2xl font-bold text-yellow-700 mt-2">{sentimentData.neutral}%</div>
            <div className="text-sm text-yellow-700">Neutral</div>
          </div>
          <div className="bg-red-100 rounded-lg p-4 text-center">
            <div className="text-4xl">😟</div>
            <div className="text-2xl font-bold text-red-700 mt-2">{sentimentData.negative}%</div>
            <div className="text-sm text-red-700">Negative</div>
          </div>
        </div>
        <div className="text-right mt-4">
          <button className="text-sm font-medium text-blue-600 hover:underline">View More</button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Performance</h3>
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
                    window.innerWidth > 640
                      ? `${name}: ${(percent * 100).toFixed(0)}%`
                      : `${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={window.innerWidth < 640 ? 60 : 80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-3 justify-center">
              {categoryData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ backgroundColor: `${COLORS[index]}20` }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-xs font-medium" style={{ color: COLORS[index] }}>
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-4 right-4">
            <button
              onClick={() => setShowPopup(true)}
              className="text-purple-600 text-sm font-medium hover:underline hover:text-purple-700 transition-all duration-200"
            >
              View Details
            </button>
          </div>

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
