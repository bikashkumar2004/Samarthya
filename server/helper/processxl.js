import xlsx from "xlsx";
import fs from "fs";
import Contact from "../models/contactDetails.js";

export async function processExcelFile(filePath, batchSize = 100) {
  try {
    // Read the Excel file
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    if (!jsonData.length) throw new Error("Excel sheet is empty");

    // Define valid status values
    const allowedStatus = [
      "New",
      "Pending",
      "Rejected",
      "Assigned",
      "Imported",
      "Contacted",
      "Interested",
      "No Replay",
      "Engaging",
    ];

    // Normalize keys (make them lowercase and trim)
    const normalized = jsonData.map((row) => {
      const newRow = {};
      for (const key in row) {
        if (Object.hasOwn(row, key)) {
          newRow[key.trim().toLowerCase()] = row[key];
        }
      }
      return newRow;
    });

    // Validate and map fields for each contact
    const validContacts = normalized
      .filter(
        (row) =>
          row.name &&
          row.status &&
          allowedStatus.includes(row.status) &&
          row.purpose // make sure purpose exists
      )
      .map((row) => ({
        name: row.name,
        email: row.email || "",
        phone: row.phone || "",
        whatsappNo: row.whatsappno || row["whatsapp no"] || "",
        status: row.status,
        purpose: row.purpose || "General", // Default fallback
      }));

    if (validContacts.length === 0) {
      throw new Error("No valid contact records found in Excel");
    }

    // Batch insert to avoid Mongo memory overload
    for (let i = 0; i < validContacts.length; i += batchSize) {
      const batch = validContacts.slice(i, i + batchSize);
      await Contact.insertMany(batch);
    }

    // Delete uploaded Excel file after processing
    fs.unlinkSync(filePath);

    return {
      success: true,
      totalRecords: jsonData.length,
      importedRecords: validContacts.length,
      message: "Contacts uploaded successfully",
    };
  } catch (error) {
    // Ensure uploaded file is deleted if error occurs
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error("Error while processing Excel:", error);
    throw new Error(error.message || "Failed to process Excel file");
  }
}
