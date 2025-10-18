import xlsx from "xlsx";
import fs from "fs";
import leadSchema from "../models/contactDetails.js";

export async function processExcelFile(filePath, batchSize = 100) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    if (!jsonData.length) throw new Error("Excel sheet is empty");

    for (let i = 0; i < jsonData.length; i += batchSize) {
      const batch = jsonData.slice(i, i + batchSize);
      await leadSchema.insertMany(batch);
    }

    fs.unlinkSync(filePath);
    return { totalRecords: jsonData.length, message: "Contacts uploaded successfully" };
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw error;
  }
}

