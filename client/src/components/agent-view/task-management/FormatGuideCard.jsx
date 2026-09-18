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
    <Card className="mt-6 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-sm">
      <CardHeader className="pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <CardTitle className="text-lg font-bold text-amber-900 flex items-center gap-2">
          <Info className="w-5 h-5 text-amber-700" />
          Required File Format
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/customer_issues_sample.xlsx"
            download="customer_issues_sample.xlsx"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow transition-all hover:scale-105"
          >
            <Download className="w-3.5 h-3.5" />
            Download Sample .XLSX
          </a>
          <a
            href="/customer_issues_sample.csv"
            download="customer_issues_sample.csv"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow transition-all hover:scale-105"
          >
            <Download className="w-3.5 h-3.5" />
            Download Sample .CSV
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-amber-200/60">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-amber-100 to-yellow-100">
                {SAMPLE_FORMAT.map((item, index) => (
                  <TableHead
                    key={index}
                    className="font-bold text-amber-900 border-r border-amber-200 last:border-r-0 text-xs py-2"
                  >
                    {item.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {SAMPLE_FORMAT.map((item, index) => (
                  <TableCell
                    key={index}
                    className="font-mono text-xs text-gray-700 border-r border-gray-200 last:border-r-0 py-2.5"
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
