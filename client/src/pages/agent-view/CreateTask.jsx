import AssignedTask from '@/components/agent-view/AssignedTask';
import ImportTask from '@/components/agent-view/ImportTask';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useState } from 'react';
import { FileUp, UserCheck, ListTodo } from 'lucide-react';

const CreateTask = () => {
  const [value, setValue] = useState("imported_tasks");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 md:p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#043927] via-emerald-700 to-green-600 p-6 md:p-8 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4 mb-3">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <ListTodo className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Create Task
          </h1>
        </div>
        <p className="text-white/90 text-base md:text-lg ml-0 md:ml-16">
          {value === "imported_tasks"
            ? "Import tasks from CSV or Excel files"
            : "Tasks assigned by your manager"}
        </p>
      </div>

      {/* Tabs Section */}
      <Tabs value={value} onValueChange={setValue} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-100 to-gray-50 p-1 rounded-xl shadow-md h-14 md:h-16">
          <TabsTrigger 
            value="imported_tasks" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#043927] data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-sm md:text-base rounded-lg transition-all flex items-center gap-2"
          >
            <FileUp className="w-4 h-4 md:w-5 md:h-5" />
            Imported Tasks
          </TabsTrigger>
          <TabsTrigger 
            value="assigned_tasks"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-sm md:text-base rounded-lg transition-all flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4 md:w-5 md:h-5" />
            Assigned Tasks
          </TabsTrigger>
        </TabsList>

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

export default CreateTask;
