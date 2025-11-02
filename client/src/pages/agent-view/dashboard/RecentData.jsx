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
    <div className="flex h-screen w-screen bg-[#F4F7FB] overflow-hidden">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">AI Call Dashboard</h1>

          {/* --- Top Boxes Section --- */}
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
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition-all">
                      <td className="py-2 px-2 text-black">{item.id}</td>
                      <td className="py-2 px-2 font-medium text-gray-800">{item.name}</td>
                      <td className="py-2 px-2 text-gray-600">{item.time}</td>
                      <td className="py-2 px-2 text-center">
                        <button className="text-blue-600 hover:underline text-sm">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-auto pt-4 text-left">
                <button className="text-sm font-medium text-blue-600 hover:underline">View More</button>
              </div>
            </div>

            {/* Recent Call Results */}
            <div className="bg-white rounded-lg shadow-md p-5 flex flex-col">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Call Results</h2>

              <table className="w-full text-sm text-left border-t border-gray-200">
                <thead>
                  <tr className="text-gray-600 border-b">
                    <th className="py-2 px-2 ">No.</th>
                    <th className="py-2 px-2">Name</th>
                    <th className="py-2 px-2">Duration</th>
                    <th className="py-2 px-2">Sentiment</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCalls.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition-all">
                      <td className="py-2 px-2 text-black">{item.id}</td>
                      <td className="py-2 px-2 font-medium text-gray-800">{item.name}</td>
                      <td className="py-2 px-2 text-gray-600">{item.duration}</td>
                      <td
                        className={`py-2 px-2 font-medium ${
                          item.sentiment === "Positive"
                            ? "text-green-600"
                            : item.sentiment === "Negative"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {item.sentiment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-auto pt-4 text-left">
                <button className="text-sm font-medium text-blue-600 hover:underline">View More</button>
              </div>
            </div>
          </div>

          {/* --- Sentiment Overview Section --- */}
          
        </main>
      </div>
    </div>
  );
}
