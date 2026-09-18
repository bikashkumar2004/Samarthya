import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, FileSpreadsheet } from "lucide-react";

const RecentImportsTable = ({ tasks = [], isLoading = false, onView, onDelete }) => {
  return (
    <Card className="border-2 border-gray-200 shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-2xl font-bold text-black flex items-center gap-3">
            Recent Imports
          </CardTitle>
          <div className="text-sm text-gray-600 bg-gray-100 px-4 py-1.5 rounded-full font-semibold border border-gray-200">
            Total: {tasks?.length ?? 0} imports
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50">
                <TableHead className="font-bold text-gray-700">Task ID</TableHead>
                <TableHead className="font-bold text-gray-700">Date & Time</TableHead>
                <TableHead className="font-bold text-gray-700 hidden md:table-cell">File Name</TableHead>
                <TableHead className="font-bold text-gray-700">Rows</TableHead>
                <TableHead className="font-bold text-gray-700 text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Loading recent imports...
                  </TableCell>
                </TableRow>
              ) : tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                    <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="font-medium text-base text-gray-700">No imports yet</p>
                    <p className="text-xs text-gray-400 mt-1">Upload an Excel or CSV file above to create your first task</p>
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task, idx) => (
                  <TableRow
                    key={task._id || idx}
                    className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-colors"
                  >
                    <TableCell className="font-bold text-[#043927]">{task.taskID}</TableCell>
                    <TableCell className="font-mono text-xs text-gray-600">{task.dateTime}</TableCell>
                    <TableCell className="hidden md:table-cell text-gray-700 max-w-xs truncate">
                      {task.fileName}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {task.rowsNo} rows
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => onView(task)}
                          variant="outline"
                          size="sm"
                          className="text-gray-800 hover:text-blue-600 hover:bg-blue-50 font-semibold border-gray-200"
                        >
                          <Eye className="w-4 h-4 mr-1 text-blue-600" />
                          <span>View</span>
                        </Button>
                        <Button
                          onClick={() => onDelete(task)}
                          variant="outline"
                          size="sm"
                          className="text-gray-800 hover:text-red-600 hover:bg-red-50 font-semibold border-gray-200"
                        >
                          <Trash2 className="w-4 h-4 mr-1 text-red-600" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentImportsTable;
