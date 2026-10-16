import React from "react";
import { Clock, AlertCircle, PhoneOff, AlertTriangle } from "lucide-react";

export default function PendingStatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Calls Rejected */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Calls Rejected
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
          {stats.rejected}
        </div>
        <p className="text-xs text-slate-400 mt-1">Declined or dropped by caller</p>
      </div>

      {/* Follow-ups Needed */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Follow-ups Needed
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
          {stats.followups}
        </div>
        <p className="text-xs text-slate-400 mt-1">Awaiting pharmacist verification</p>
      </div>

      {/* Missed Calls */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Missed / No Answer
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <PhoneOff className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2">
          {stats.missed}
        </div>
        <p className="text-xs text-slate-400 mt-1">Automatic redial queued</p>
      </div>

      {/* Urgent Follow-ups */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Urgent Attention
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-2">
          {stats.urgent}
        </div>
        <p className="text-xs text-slate-400 mt-1">Negative sentiment or urgent side effect</p>
      </div>
    </div>
  );
}
