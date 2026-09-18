import React, { useEffect, useMemo, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import CategoryPopup from "./CategoryPopup";
import {
  fetchDashboardSummary,
  selectSummaryMetrics,
  selectSummaryStatus,
} from "@/store/dashboard";
import {
  fetchWeeklyPerformance,
  selectWeeklyPerformanceError,
  selectWeeklyPerformanceSeries,
  selectWeeklyPerformanceStatus,
} from "@/store/dashboard/wealychat";
import {
  fetchCategoryDistribution,
  selectCategoryError,
  selectCategorySeries,
  selectCategoryStatus,
  selectCategoryTotal,
} from "@/store/dashboard/barchat";

const COLORS = ["#7C3AED", "#9333EA", "#3B82F6", "#10B981", "#D1D5DB"];

const DashboardOverview = () => {
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);

  // Summary
  const status = useSelector(selectSummaryStatus);
  const { totalCalls, avgCallHours, sentiments, acquiredAttention } =
    useSelector(selectSummaryMetrics);

  // Series
  const weeklySeries = useSelector(selectWeeklyPerformanceSeries);
  const weeklyStatus = useSelector(selectWeeklyPerformanceStatus);
  const weeklyError = useSelector(selectWeeklyPerformanceError);

  const categorySeries = useSelector(selectCategorySeries);
  const categoryStatus = useSelector(selectCategoryStatus);
  const categoryError = useSelector(selectCategoryError);
  const categoryTotal = useSelector(selectCategoryTotal);

  useEffect(() => {
    dispatch(fetchDashboardSummary({ sinceHours: 24 }));
    dispatch(fetchWeeklyPerformance({ days: 7 }));
    dispatch(fetchCategoryDistribution({ sinceHours: 24 }));
  }, [dispatch]);

  // Stats for cards with safeguards
  const stats = {
    totalCalls: status === "loading" ? "Loading..." : String(totalCalls || 0),
    pendingCalls:
      status === "loading"
        ? "Loading..."
        : String(acquiredAttention?.totalAttention ?? 0),
    avgCallTime:
      status === "loading"
        ? "Loading..."
        : `${Number.isFinite(avgCallHours) ? avgCallHours.toFixed(2) : "0.00"}h`,
    aiCallsCompleted:
      status === "loading"
        ? "Loading..."
        : String(
            Math.max(
              0,
              (totalCalls || 0) - (acquiredAttention?.totalAttention ?? 0)
            )
          ),
  };

  // Normalize sentiment keys and types
  const sentimentData = useMemo(() => {
    if (status === "loading") return { positive: 0, negative: 0, neutral: 0 };

    const rawPos = Number(sentiments?.Positive ?? sentiments?.positive ?? 0);
    const rawNeg = Number(sentiments?.Negative ?? sentiments?.negative ?? 0);
    const rawNeu = Number(sentiments?.Neutral ?? sentiments?.neutral ?? 0);

    let p = Number.isFinite(rawPos) ? rawPos : 0;
    let n = Number.isFinite(rawNeg) ? rawNeg : 0;
    let u = Number.isFinite(rawNeu) ? rawNeu : 0;

    const sum = p + n + u;
    if (sum > 0 && sum <= 1.5) {
      p *= 100;
      n *= 100;
      u *= 100;
    }

    return {
      positive: Math.round(p * 100) / 100,
      negative: Math.round(n * 100) / 100,
      neutral: Math.round(u * 100) / 100,
    };
  }, [status, sentiments]);

  const sortedCategoryData = useMemo(
    () => [...categorySeries].sort((a, b) => a.value - b.value),
    [categorySeries]
  );

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
          {Object.entries(stats).map(([key, value], index) => {
            const titles = {
              totalCalls: "Total Calls",
              pendingCalls: "Pending Calls",
              avgCallTime: "Avg Call Time",
              aiCallsCompleted: "AI Calls Completed",
            };
            return (
              <div key={index} className="text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  {titles[key] ?? key}
                </h3>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sentiment Overview */}
      <div className="bg-white rounded-lg shadow-md p-5 mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Sentiment Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-100 rounded-lg p-4 text-center">
            <div className="text-4xl">😊</div>
            <div className="text-2xl font-bold text-green-700 mt-2">
              {sentimentData.positive}%
            </div>
            <div className="text-sm text-green-700">Positive</div>
          </div>
          <div className="bg-yellow-100 rounded-lg p-4 text-center">
            <div className="text-4xl">😐</div>
            <div className="text-2xl font-bold text-yellow-700 mt-2">
              {sentimentData.neutral}%
            </div>
            <div className="text-sm text-yellow-700">Neutral</div>
          </div>
          <div className="bg-red-100 rounded-lg p-4 text-center">
            <div className="text-4xl">😟</div>
            <div className="text-2xl font-bold text-red-700 mt-2">
              {sentimentData.negative}%
            </div>
            <div className="text-sm text-red-700">Negative</div>
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
            {weeklyStatus === "loading" ? (
              <div className="w-full h-full animate-pulse bg-gray-100 rounded-md" />
            ) : weeklyStatus === "failed" ? (
              <div className="text-sm text-red-600">
                Failed to load weekly performance:{" "}
                {String(weeklyError || "Unknown error")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySeries}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#7C3AED" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pie Chart + Popup */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-2 border-gray-300 relative">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Category Distribution
          </h3>
          <div className="w-full h-64 sm:h-80">
            {categoryStatus === "loading" ? (
              <div className="w-full h-full animate-pulse bg-gray-100 rounded-md" />
            ) : categoryStatus === "failed" ? (
              <div className="text-sm text-red-600">
                Failed to load categories:{" "}
                {String(categoryError || "Unknown error")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySeries}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                  >
                    {categorySeries.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-3 justify-center">
              {categorySeries.map((item, index) => {
                const pct =
                  categoryTotal > 0
                    ? Math.round((item.value / categoryTotal) * 100)
                    : 0;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{
                      backgroundColor: `${COLORS[index % COLORS.length]}20`,
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{ color: COLORS[index % COLORS.length] }}
                    >
                      {item.name}: {pct}%
                    </span>
                  </div>
                );
              })}
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
              categoryData={categorySeries}
              onClose={() => setShowPopup(false)}
              handleTakeAction={handleTakeAction}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
