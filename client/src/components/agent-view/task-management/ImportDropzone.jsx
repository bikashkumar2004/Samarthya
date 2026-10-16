import React from "react";
import { FileSpreadsheet, FileText } from "lucide-react";

const ImportDropzone = ({ onFileSelect, isLoading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Excel Upload Zone */}
      <label className={`group cursor-pointer ${isLoading ? "pointer-events-none opacity-60" : ""}`}>
        <div className="relative border-2 border-dashed border-emerald-200/80 dark:border-emerald-900/50 rounded-2xl p-6 hover:border-emerald-500 transition-all duration-200 bg-emerald-50/30 dark:bg-emerald-950/20 group-hover:bg-emerald-50/60 group-hover:shadow-xs">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => onFileSelect(e, "excel")}
            className="hidden"
            disabled={isLoading}
          />
          <div className="flex flex-col items-center text-center space-y-2.5">
            <div className="bg-gradient-to-tr from-emerald-600 to-teal-600 p-3.5 rounded-xl shadow-xs group-hover:scale-105 transition-transform text-white">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Upload Microsoft Excel (.XLSX)</p>
              <p className="text-xs text-slate-500 mt-0.5">Click to browse lead rows</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Multi-tab workbooks supported</p>
            </div>
          </div>
        </div>
      </label>

      {/* CSV Upload Zone */}
      <label className={`group cursor-pointer ${isLoading ? "pointer-events-none opacity-60" : ""}`}>
        <div className="relative border-2 border-dashed border-indigo-200/80 dark:border-indigo-900/50 rounded-2xl p-6 hover:border-indigo-500 transition-all duration-200 bg-indigo-50/30 dark:bg-indigo-950/20 group-hover:bg-indigo-50/60 group-hover:shadow-xs">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => onFileSelect(e, "csv")}
            className="hidden"
            disabled={isLoading}
          />
          <div className="flex flex-col items-center text-center space-y-2.5">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-3.5 rounded-xl shadow-xs group-hover:scale-105 transition-transform text-white">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Upload Comma-Separated (.CSV)</p>
              <p className="text-xs text-slate-500 mt-0.5">Click to browse lead rows</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Fast-parsing batch manifest format</p>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default ImportDropzone;
