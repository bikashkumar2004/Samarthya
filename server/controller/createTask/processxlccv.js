import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import UploadDetails from "../../models/uploadDetails.js";
import TaskDetails from "../../models/createTask.js";

async function generateTaskId() {
  const lastTask = await TaskDetails.findOne().sort({ createdAt: -1 });
  if (!lastTask) return "TSK001";
  const lastNumber = parseInt(lastTask.taskId.replace("TSK", "")) || 0;
  const nextNumber = (lastNumber + 1).toString().padStart(3, "0");
  return `TSK${nextNumber}`;
}

export async function processExcelFile(filePath, userId, batchSize = 100) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    if (!jsonData.length) throw new Error("Uploaded Excel file is empty");
    
    const normalized = jsonData.map((row) => {
      const obj = {};
      for (const key in row) {
        obj[key.trim().toLowerCase()] = row[key];
      }
      return obj;
    });
    const validData = normalized
      .map((r) => ({
        name: r.name || r["full name"] || r["contact name"],
        phoneno: r.phoneno || r.phone || r["mobile number"] || r["mobile"] || r["contact no"],
        emailid: r.emailid || r.email || r["email address"],
        category: r.category || r.department || r.type || r["query type"],
        description: r.description || r.remark || r.issue || r["problem description"] || "",
      }))
      .filter((r) => r.name && r.phoneno && r.emailid && r.category)
      .map((r) => ({
        name: r.name.trim(),
        phoneNo: formatPhoneNumber(r.phoneno),
        email: String(r.emailid).trim().toLowerCase(),
        category: r.category.trim(),
        description: r.description ? String(r.description).trim() : "",
        userId,
      }));

    if (!validData.length) throw new Error("No valid records found in uploaded Excel file");

    const taskId = await generateTaskId();
    const fileName = path.basename(filePath);
    const rows = validData.length;
    const task = await TaskDetails.create({ taskId, fileName, rows, userId });
    const finalData = validData.map((r) => ({ ...r, taskId: task._id }));

    for (let i = 0; i < finalData.length; i += batchSize) {
      const batch = finalData.slice(i, i + batchSize);
      await UploadDetails.insertMany(batch);
    }
    fs.unlinkSync(filePath);

    return { success: true, taskId, fileName, rows };
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error(" Error processing Excel:", error);
    throw new Error(error.message || "Failed to process Excel file");
  }
}
function formatPhoneNumber(phone) {
  const str = String(phone).trim();
  const digits = str.replace(/[^\d]/g, "");
  if (!digits) return "";
  return digits.startsWith("91") ? `+${digits}` : `+91${digits}`;
}
