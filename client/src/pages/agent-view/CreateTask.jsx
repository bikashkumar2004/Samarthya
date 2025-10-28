import AssignedTask from '@/components/agent-view/AssignedTask'
import ImportTask from '@/components/agent-view/ImportTask'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React, { useState } from 'react'

const CreateTask = () => {
  const [value, setValue] = useState("imported_tasks");
  return (
    <Tabs defaultValue="imported_tasks" onValueChange={setValue} className="">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Create Task</h1>
            <p className="text-sm text-gray-600 mt-1">{value === "imported_tasks" 
                ? "Import tasks from CSV or Excel files" 
                : "Tasks assigned by your manager"}</p>
          </div>
          <div>
            <TabsList>
              <TabsTrigger value="imported_tasks">Imported Tasks</TabsTrigger>
              <TabsTrigger value="assigned_tasks">Assigned Tasks</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="imported_tasks"><ImportTask /></TabsContent>
        <TabsContent value="assigned_tasks"><AssignedTask /></TabsContent>
      </div>
    </Tabs >
  )
}

export default CreateTask
