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
import { Info, Download } from "lucide-react";

const SAMPLE_FORMAT = [
  { header: "Name", example: "Rahul Sharma" },
  { header: "PhoneNo", example: "9876543210" },
  { header: "EmailId", example: "rahul.sharma@gmail.com" },
  { header: "Category", example: "Billing & Payments" },
  { header: "Description", example: "double deduction on subscription payment and refund" },
];

const FormatGuideCard = () => {
  return (
    <Card className="mt-6 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-sm overflow-hidden">
      <CardHeader className="py-3 px-5 border-b border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Required Lead Manifest Schema
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/customer_issues_sample.xlsx"
            download="customer_issues_sample.xlsx"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            Sample .XLSX
          </a>
          <a
            href="/customer_issues_sample.csv"
            download="customer_issues_sample.csv"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            Sample .CSV
          </a>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-800">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                {SAMPLE_FORMAT.map((item, index) => (
                  <TableHead
                    key={index}
                    className="font-semibold text-slate-600 dark:text-slate-400 text-xs py-2"
                  >
                    {item.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-none">
                {SAMPLE_FORMAT.map((item, index) => (
                  <TableCell
                    key={index}
                    className="font-mono text-xs text-slate-700 dark:text-slate-300 py-2.5"
                  >
                    {item.example}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormatGuideCard;
