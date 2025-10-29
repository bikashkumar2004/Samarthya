import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import ImportDetails from "../../models/uploadDetails.js";
import TaskDetails from "../../models/createTask.js";

// Generate taskId like TSK001, TSK002, etc.
async function generateTaskId() {
  const lastTask = await TaskDetails.findOne().sort({ createdAt: -1 });
  if (!lastTask) return "TSK001";

  const lastNumber = parseInt(lastTask.taskId.replace("TSK", "")) || 0;
  const nextNumber = (lastNumber + 1).toString().padStart(3, "0");
  return `TSK${nextNumber}`;
}

export async function processExceccvlFile(filePath, userId, batchSize = 100) {
  try {
    // Read Excel
    const workbook = xlsx.readFile(filePath, { raw: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    if (!jsonData.length) throw new Error("Uploaded Excel file is empty");

    // Normalize and clean
    const normalized = jsonData.map((row) => {
      const newRow = {};
      for (const key in row) {
        if (Object.hasOwn(row, key)) {
          newRow[key.trim().toLowerCase()] = row[key];
        }
      }
      return newRow;
    });

    const validData = normalized
      .filter((row) => row.name && row.phoneno && row.emailid && row.category)
      .map((row) => ({
        name: row.name.trim(),
        phoneNo: formatPhoneNumber(row.phoneno),
        emailId: row.emailid.trim().toLowerCase(),
        category: row.category.trim(),
        description: row.description ? row.description.trim() : "",
        userId,
      }));

    if (validData.length === 0)
      throw new Error("No valid records found in uploaded Excel file");

    // Insert contacts in batches
    for (let i = 0; i < validData.length; i += batchSize) {
      const batch = validData.slice(i, i + batchSize);
      await ImportDetails.insertMany(batch);
    }

    // Save file info into TaskDetails
    const taskId = await generateTaskId();
    const fileName = path.basename(filePath);
    const rows = validData.length;

    await TaskDetails.create({
      taskId,
      fileName,
      rows,
      userId,
    });

    // Delete file after processing
    fs.unlinkSync(filePath);

    return {
      success: true,
      taskId,
      fileName,
      rows,
      message: "File uploaded and task created successfully",
    };
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error("Error processing Excel:", error);
    throw new Error(error.message || "Failed to process Excel file");
  }
}

function formatPhoneNumber(phone) {
  const str = String(phone).trim();
  return str.startsWith("+91") ? str : `+91${str.replace(/^(\+91)?/, "")}`;
}
