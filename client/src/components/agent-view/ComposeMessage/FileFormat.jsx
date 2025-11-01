import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function FileFormat() {
  const sampleData = [
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
  ];

  return (
    <div className="space-y-4">
      {/* Description */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Make sure your file matches this exact structure for successful import.
        </p>
        
        <div className="text-sm">
          <strong className="font-medium">Required columns:</strong>
          <span className="text-muted-foreground ml-1">
            slNo, name, category, issueDescription, status, timeElapsed
          </span>
        </div>
      </div>

      {/* Sample Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sl No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Issue Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time Elapsed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.slNo}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.issueDescription}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.timeElapsed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
