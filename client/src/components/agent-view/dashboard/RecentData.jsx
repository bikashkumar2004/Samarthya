import React, { useState } from "react";

export default function RecentData() {
  const [requireAttention] = useState([
    { id: 1, name: "Michael Brown", time: "2:30 PM" },
    { id: 2, name: "Emily Johnson", time: "3:45 PM" },
  ]);

  const [recentCalls] = useState([
    { id: 1, name: "William Davis", duration: "3m 25s", sentiment: "Positive" },
    { id: 2, name: "Sophia Wilson", duration: "2m 15s", sentiment: "Negative" },
    { id: 3, name: "John Smith", duration: "4m 02s", sentiment: "Neutral" },
  ]);

  return (
    <div className="bg-[#F4F7FB] rounded-xl p-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Require Attention */}
        <div className="bg-white rounded-lg shadow-md p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Require Attention</h2>
            <span className="text-sm text-red-600 font-medium">Needs review</span>
          </div>

          <table className="w-full text-sm text-left border-t border-gray-200">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2 px-2">No.</th>
                <th className="py-2 px-2">Name</th>
                <th className="py-2 px-2">Time</th>
                <th className="py-2 px-2 text-center">View</th>
              </tr>
            </thead>
            <tbody>
              {requireAttention.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2 font-medium">{item.id}</td>
                  <td className="py-2 px-2">{item.name}</td>
                  <td className="py-2 px-2 text-gray-500">{item.time}</td>
                  <td className="py-2 px-2 text-center">
                    <button className="text-blue-600 hover:underline text-xs font-semibold">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Calls */}
        <div className="bg-white rounded-lg shadow-md p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Recent Calls</h2>
            <span className="text-sm text-gray-500 font-medium">Last 24h</span>
          </div>

          <table className="w-full text-sm text-left border-t border-gray-200">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-2 px-2">No.</th>
                <th className="py-2 px-2">Name</th>
                <th className="py-2 px-2">Duration</th>
                <th className="py-2 px-2 text-center">Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2 font-medium">{item.id}</td>
                  <td className="py-2 px-2">{item.name}</td>
                  <td className="py-2 px-2 text-gray-500">{item.duration}</td>
                  <td className="py-2 px-2 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                        item.sentiment === "Positive"
                          ? "bg-green-100 text-green-700"
                          : item.sentiment === "Negative"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.sentiment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
