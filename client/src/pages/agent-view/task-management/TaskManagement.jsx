import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, UserCheck, ListTodo } from "lucide-react";
import ImportTask from "@/components/agent-view/task-management/ImportTask";
import AssignedTask from "@/components/agent-view/task-management/AssignedTask";

const TaskManagement = () => {
  const [value, setValue] = useState("imported_tasks");

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-4 mb-3">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <ListTodo className="w-8 h-8 md:w-10 md:h-10 text-black" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-black">
            Task Management
          </h1>
        </div>
        <p className="text-gray-900 text-base md:text-lg ml-0 md:ml-16">
          {value === "imported_tasks"
            ? "Import customer contact tasks from CSV or Excel files"
            : "Tasks assigned by your manager"}
        </p>
      </div>

      {/* Tabs Section */}
      <Tabs value={value} onValueChange={setValue}>
        <div className="w-full flex justify-center">
          <TabsList className="grid grid-cols-2 rounded-xl shadow px-4 w-[60%] md:h-16">
            <TabsTrigger
              value="imported_tasks"
              className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-sm md:text-base rounded-lg transition-all flex items-center gap-2"
            >
              <FileUp className="w-4 h-4 md:w-5 md:h-5" />
              Imported Tasks
            </TabsTrigger>
            <TabsTrigger
              value="assigned_tasks"
              className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-sm md:text-base rounded-lg transition-all flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 md:w-5 md:h-5" />
              Assigned Tasks
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
