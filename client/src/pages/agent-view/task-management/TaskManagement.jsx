import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, UserCheck, ListTodo } from "lucide-react";
import ImportTask from "@/components/agent-view/task-management/ImportTask";
import AssignedTask from "@/components/agent-view/task-management/AssignedTask";

const TaskManagement = () => {
  const [value, setValue] = useState("imported_tasks");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ListTodo className="w-5 h-5" />
            </div>
            <span>Task Management</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {value === "imported_tasks"
              ? "Import and stage customer contact lists from Excel or CSV files"
              : "Review tasks assigned directly by your pharmacy clinical supervisor"}
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs value={value} onValueChange={setValue} className="w-full">
        <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-md mx-auto">
          <TabsList className="grid grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl h-11">
            <TabsTrigger
              value="imported_tasks"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm font-semibold text-xs sm:text-sm rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <FileUp className="w-4 h-4" />
              <span>Imported Tasks</span>
            </TabsTrigger>
            <TabsTrigger
              value="assigned_tasks"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm font-semibold text-xs sm:text-sm rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Assigned Tasks</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="imported_tasks" className="mt-6">
          <ImportTask />
        </TabsContent>

        <TabsContent value="assigned_tasks" className="mt-6">
          <AssignedTask />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskManagement;
