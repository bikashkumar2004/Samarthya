import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BarChart3, Upload, Info, X } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import * as XLSX from 'xlsx';
import FileFormat from "./FileFormat";

export default function Body() {
  const [uploadedData, setUploadedData] = useState([
    {
      slNo: 1,
      name: "John Doe",
      category: "Document Verification",
      issueDescription: "Certificate issue",
      status: "Open",
      timeElapsed: "2h 30m"
    },
    {
      slNo: 2,
      name: "Jane Smith",
      category: "Seat Allocation",
      issueDescription: "Rank not updated",
      status: "In Progress",
      timeElapsed: "1h 15m"
    }
  ]);

  const csvInputRef = useRef(null);
  const excelInputRef = useRef(null);

  // Required column headers
  const requiredColumns = ["slNo", "name", "category", "issueDescription", "status", "timeElapsed"];

  // Validate data structure
  const validateData = (data) => {
    if (!data || data.length === 0) {
      toast.error("File is empty or invalid");
      return false;
    }

    const firstRow = data[0];
    const fileColumns = Object.keys(firstRow);
    
    const missingColumns = requiredColumns.filter(col => !fileColumns.includes(col));
    
    if (missingColumns.length > 0) {
      toast.error(`Missing required columns: ${missingColumns.join(", ")}`);
      return false;
    }

    return true;
  };

  // Handle CSV file upload
  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file (.csv)");
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n');
        
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            headers.forEach((header, index) => {
              row[header] = values[index];
            });
            rows.push(row);
          }
        }

        if (validateData(rows)) {
          setUploadedData(rows);
          toast.success(`Successfully imported ${rows.length} rows from CSV`);
        }
      } catch (error) {
        toast.error("Failed to parse CSV file");
      }
    };

    reader.readAsText(file);
    event.target.value = null;
  };

  // Handle Excel file upload
  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    const validExtensions = ['.xlsx', '.xls'];
    const isValidFile = validExtensions.some(ext => file.name.endsWith(ext));
    
    if (!isValidFile) {
      toast.error("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        if (validateData(jsonData)) {
          setUploadedData(jsonData);
          toast.success(`Successfully imported ${jsonData.length} rows from Excel`);
        }
      } catch (error) {
        toast.error("Failed to parse Excel file");
      }
    };

    reader.readAsArrayBuffer(file);
    event.target.value = null;
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Hidden file inputs */}
      <input
        ref={csvInputRef}
        type="file"
        accept=".csv"
        onChange={handleCSVUpload}
        style={{ display: 'none' }}
      />
      <input
        ref={excelInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleExcelUpload}
        style={{ display: 'none' }}
      />

      {/* Title Section with View File Format Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Import Recipients</h2>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Info className="w-4 h-4 mr-2" />
              View File Format
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {/* Close Button */}
            <AlertDialogCancel className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground border-0 bg-transparent p-0 h-auto">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </AlertDialogCancel>

            <AlertDialogHeader>
              <AlertDialogTitle>Important: File Format Requirements</AlertDialogTitle>
            </AlertDialogHeader>
            
            <div className="mt-4">
              <FileFormat />
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Upload Buttons */}
      <div className="grid grid-cols-2 gap-6">
        {/* CSV Upload Card */}
        <Card 
          className="border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => csvInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-lg bg-purple-100 flex items-center justify-center">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-medium">Upload CSV File</h3>
              <p className="text-sm text-muted-foreground">.csv format</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                csvInputRef.current?.click();
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </CardContent>
        </Card>

        {/* Excel Upload Card */}
        <Card 
          className="border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => excelInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-medium">Upload Excel File</h3>
              <p className="text-sm text-muted-foreground">.xlsx or .xls format</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                excelInputRef.current?.click();
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
