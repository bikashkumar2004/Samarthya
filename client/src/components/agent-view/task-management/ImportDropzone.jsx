import React from "react";
import { FileSpreadsheet, FileText } from "lucide-react";

const ImportDropzone = ({ onFileSelect, isLoading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Excel Upload Zone */}
      <label className={`group cursor-pointer ${isLoading ? "pointer-events-none opacity-60" : ""}`}>
        <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-emerald-500 transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 group-hover:from-green-100 group-hover:to-emerald-100 group-hover:shadow-md">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => onFileSelect(e, "excel")}
            className="hidden"
            disabled={isLoading}
          />
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">Upload Excel File</p>
              <p className="text-sm text-gray-600 mt-1">Click to browse or select file</p>
              <p className="text-xs text-gray-500 mt-1">Supports .xlsx and .xls formats</p>
            </div>
          </div>
        </div>
      </label>

      {/* CSV Upload Zone */}
      <label className={`group cursor-pointer ${isLoading ? "pointer-events-none opacity-60" : ""}`}>
        <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-blue-500 transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 group-hover:from-blue-100 group-hover:to-cyan-100 group-hover:shadow-md">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => onFileSelect(e, "csv")}
            className="hidden"
            disabled={isLoading}
          />
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-4 rounded-2xl shadow group-hover:scale-105 transition-transform">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">Upload CSV File</p>
              <p className="text-sm text-gray-600 mt-1">Click to browse or select file</p>
              <p className="text-xs text-gray-500 mt-1">Supports .csv format</p>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default ImportDropzone;
