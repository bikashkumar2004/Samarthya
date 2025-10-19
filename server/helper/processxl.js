import xlsx from "xlsx";
import fs from "fs";
import Contact from "../models/contactDetails.js";

export async function processExcelFile(filePath, batchSize = 100, folderId = null) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    if (!jsonData.length) throw new Error("Excel sheet is empty");

    // Normalize keys (convert Excel headers to lowercase)
    const normalized = jsonData.map((row) => {
      const newRow = {};
      for (const key in row) {
        newRow[key.trim().toLowerCase()] = row[key];
      }
      return newRow;
    });

    // Prepare valid contacts
    const validContacts = normalized
      .filter(
        (row) =>
          row.name && row.email && row.phone && row.source
      )
      .map((row) => ({
        name: row.name,
        email: row.email,
        phone: row.phone,
        whatshapNo: row.whatsappno || row["whatsapp no"] || "",
        source: row.source,
        FolderId: folderId || null,
      }));

    if (validContacts.length === 0) {
      throw new Error("No valid contact records found in Excel");
    }

    // Batch insert
    for (let i = 0; i < validContacts.length; i += batchSize) {
      const batch = validContacts.slice(i, i + batchSize);
      await Contact.insertMany(batch);
    }

    fs.unlinkSync(filePath); // cleanup

    return {
      success: true,
      totalRecords: jsonData.length,
      importedRecords: validContacts.length,
      message: "Contacts uploaded successfully",
    };
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw error;
  }
}

