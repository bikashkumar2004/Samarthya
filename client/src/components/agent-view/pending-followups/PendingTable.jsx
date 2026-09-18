import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, Download, Eye, Phone, Smile, Meh, Frown } from "lucide-react";

export default function PendingTable({
  filteredData = [],
  filterStatus,
  setFilterStatus,
  isLoading,
  loadError,
  onViewCall,
}) {
  function getStatusBadge(status) {
    const statusStyles = {
      Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      Completed: "bg-green-100 text-green-700 border-green-300",
      Rejected: "bg-red-100 text-red-700 border-red-300",
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
          statusStyles[status] || "bg-gray-100 text-gray-700 border-gray-300"
        }`}
      >
        {status}
      </span>
    );
  }

  function getSentimentBadge(sentiment) {
    const sentimentStyles = {
      Positive: "bg-emerald-100 text-emerald-700 border-emerald-300",
      Neutral: "bg-gray-100 text-gray-700 border-gray-300",
      Negative: "bg-rose-100 text-rose-700 border-rose-300",
    };

    const sentimentIcons = {
      Positive: <Smile className="w-4 h-4" />,
      Neutral: <Meh className="w-4 h-4" />,
      Negative: <Frown className="w-4 h-4" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
          sentimentStyles[sentiment] || "bg-gray-100 text-gray-700 border-gray-300"
        }`}
      >
        {sentimentIcons[sentiment]}
        {sentiment}
      </span>
    );
  }

  return (
    <Card className="border-2 border-gray-200 shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-2xl font-bold text-black flex items-center gap-2">
            <Phone className="w-6 h-6" />
            Pending Follow-ups
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select
              value={filterStatus}
              onValueChange={(value) => setFilterStatus(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px] border-2 border-gray-300">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold shadow-lg">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-100 to-gray-50">
                <TableHead className="font-bold text-gray-900">Name</TableHead>
                <TableHead className="font-bold text-gray-900 hidden md:table-cell">
                  Phone
                </TableHead>
                <TableHead className="font-bold text-gray-900 hidden lg:table-cell">
                  Category
                </TableHead>
                <TableHead className="font-bold text-gray-900 hidden sm:table-cell">
                  Status
                </TableHead>
                <TableHead className="font-bold text-gray-900">Sentiment</TableHead>
                <TableHead className="font-bold text-gray-900 hidden md:table-cell">
                  Duration
                </TableHead>
                <TableHead className="font-bold text-gray-900 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : loadError ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-red-600">
                    {loadError}
                  </TableCell>
                </TableRow>
              ) : filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <TableRow
                    key={row.customer_id || index}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-colors"
                  >
                    <TableCell>
                      <div>
                        <div className="font-semibold text-gray-900">{row.name}</div>
                        <div className="text-xs text-gray-500 md:hidden">{row.phoneNo}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-sm">
                      {row.phoneNo}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border border-purple-300">
                        {row.category}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {getStatusBadge(row.status)}
                    </TableCell>
                    <TableCell>{getSentimentBadge(row.sentiment)}</TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-sm font-semibold">
                      {row.call_duration_seconds ? `${row.call_duration_seconds.toFixed(2)} s` : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        onClick={() => onViewCall(row)}
                        variant="outline"
                        size="sm"
                        className="border-2 border-[#043927] text-[#043927] hover:bg-[#043927] hover:text-white font-bold"
                      >
                        <Eye className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="font-medium">No calls found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
