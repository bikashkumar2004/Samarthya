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

function cleanHeaderKey(k) {
  return String(k || "")
    .toLowerCase()
    .replace(/^[\uFEFF\xEF\xBB\xBF\s"']+/, "")
    .replace(/[\s"']+$/, "")
    .replace(/[^a-z0-9]/g, "");
}

function matchesName(k) {
  return ["name", "fullname", "contactname", "customername", "clientname", "client", "customer", "user", "username"].includes(k);
}
function matchesPhone(k) {
  return ["phoneno", "phone", "phonenumber", "mobile", "mobileno", "mobilenumber", "contactno", "contactnumber", "contact", "tel", "telephone", "cell"].includes(k);
}
function matchesEmail(k) {
  return ["emailid", "email", "emailaddress", "mail", "mailid"].includes(k);
}
function matchesCategory(k) {
  return ["category", "department", "type", "querytype", "issuetype", "issuecategory", "leadtype", "dept"].includes(k);
}
function matchesDesc(k) {
  return ["description", "issuedescription", "problemdescription", "issue", "problem", "remark", "remarks", "purpose", "notes", "comment", "comments", "query", "details", "reason"].includes(k);
}

function formatPhoneNumber(phone) {
  if (!phone) return "";
  const digits = String(phone).replace(/[^\d]/g, "");
  if (!digits) return "";

  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return `+91${digits.slice(1)}`;
  }
  if (digits.startsWith("91")) {
    return `+${digits}`;
  }
  return `+91${digits}`;
}

export async function processExcelFile(filePath, userId, batchSize = 100) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawMatrix = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "" });

    // Filter out rows that are completely empty
    const matrix = rawMatrix.filter((row) =>
      Array.isArray(row) && row.some((cell) => cell !== undefined && cell !== null && String(cell).trim() !== "")
    );

    if (!matrix.length) throw new Error("Uploaded Excel file is empty");

    console.log(`[Excel Import] Processing: ${path.basename(filePath)} | Total non-empty rows: ${matrix.length}`);

    // Detect if Row 0 is a Header Row or a Data Row
    const row0 = matrix[0].map((c) => String(c).trim());
    const hasEmail = row0.some((c) => c.includes("@") && c.includes("."));
    const hasPhone = row0.some((c) => {
      const d = c.replace(/[^\d]/g, "");
      return d.length >= 10 && d.length <= 13;
    });

    const headerKeywords = [
      "name", "fullname", "customer", "contact",
      "phone", "phoneno", "phonenumber", "mobile",
      "email", "emailid", "emailaddress", "mail",
      "category", "dept", "department", "type",
      "description", "issue", "remark", "purpose"
    ];

    const headerMatchCount = row0.filter((c) => {
      const clean = cleanHeaderKey(c);
      return headerKeywords.some((kw) => clean.includes(kw) || kw.includes(clean));
    }).length;

    const isHeaderRow =
      (headerMatchCount >= 2 && !hasEmail && !hasPhone) ||
      (headerMatchCount >= 1 && !hasEmail && !hasPhone && !matrix[0].some((c) => String(c).length > 40));

    console.log(
      `[Excel Import] Header row detected: ${isHeaderRow ? "YES (using column names)" : "NO (auto-detecting columns from data)"}`
    );

    let nameCol = -1, phoneCol = -1, emailCol = -1, categoryCol = -1, descCol = -1;
    let dataRows = [];

    if (isHeaderRow) {
      matrix[0].forEach((colName, colIdx) => {
        const clean = cleanHeaderKey(colName);
        if (nameCol === -1 && matchesName(clean)) nameCol = colIdx;
        if (phoneCol === -1 && matchesPhone(clean)) phoneCol = colIdx;
        if (emailCol === -1 && matchesEmail(clean)) emailCol = colIdx;
        if (categoryCol === -1 && matchesCategory(clean)) categoryCol = colIdx;
        if (descCol === -1 && matchesDesc(clean)) descCol = colIdx;
      });
      dataRows = matrix.slice(1);
    } else {
      // Auto-detect columns based on data patterns
      const numCols = Math.max(...matrix.map((r) => r.length));

      // 1. Detect Email column (contains '@' and '.')
      for (let c = 0; c < numCols; c++) {
        const values = matrix.slice(0, 10).map((r) => String(r[c] || "").trim()).filter(Boolean);
        if (emailCol === -1 && values.some((v) => v.includes("@") && v.includes("."))) {
          emailCol = c;
          break;
        }
      }

      // 2. Detect Phone column (digits length 10-13)
      for (let c = 0; c < numCols; c++) {
        if (c === emailCol) continue;
        const values = matrix.slice(0, 10).map((r) => String(r[c] || "").trim()).filter(Boolean);
        if (phoneCol === -1 && values.some((v) => {
          const d = v.replace(/[^\d]/g, "");
          return d.length >= 10 && d.length <= 13;
        })) {
          phoneCol = c;
          break;
        }
      }

      // 3. Detect Description column (longest text or sentences)
      for (let c = 0; c < numCols; c++) {
        if (c === emailCol || c === phoneCol) continue;
        const values = matrix.slice(0, 10).map((r) => String(r[c] || "").trim()).filter(Boolean);
        const avgLen = values.reduce((sum, v) => sum + v.length, 0) / (values.length || 1);
        if (descCol === -1 && (avgLen > 25 || values.some((v) => v.split(" ").length >= 4))) {
          descCol = c;
          break;
        }
      }

      // 4. Map Name and Category from remaining columns
      for (let c = 0; c < numCols; c++) {
        if (c === emailCol || c === phoneCol || c === descCol) continue;
        if (nameCol === -1) {
          nameCol = c;
        } else if (categoryCol === -1) {
          categoryCol = c;
        }
      }

      // Fallback indices if not assigned
      if (nameCol === -1) nameCol = 0;
      if (phoneCol === -1) phoneCol = 1;
      if (emailCol === -1) emailCol = 2;
      if (categoryCol === -1) categoryCol = 3;
      if (descCol === -1) descCol = 4;

      dataRows = matrix; // Row 0 is also a data row!
    }

    console.log(
      `[Excel Import] Column Mapping -> Name: Col ${nameCol}, Phone: Col ${phoneCol}, Email: Col ${emailCol}, Category: Col ${categoryCol}, Description: Col ${descCol}`
    );

    const validData = [];

    for (let index = 0; index < dataRows.length; index++) {
      const row = dataRows[index];
      const name = String(row[nameCol] || "").trim();
      const phoneRaw = String(row[phoneCol] || "").trim();
      const emailRaw = String(row[emailCol] || "").trim();
      const category = String(row[categoryCol] || "").trim() || "General";
      const description = String(row[descCol] || "").trim() || "General inquiry";

      const phoneNo = formatPhoneNumber(phoneRaw);
      const email = emailRaw ? emailRaw.toLowerCase() : "";

      if (name && phoneNo && email) {
        validData.push({
          name,
          phoneNo,
          email,
          category,
          description,
          userId,
        });
      } else {
        console.warn(
          `[Excel Import] Row ${index + 1} skipped - Missing required fields:`,
          { name: !!name, phone: !!phoneNo, email: !!email, raw: row }
        );
      }
    }

    console.log(`[Excel Import] Total valid contacts extracted: ${validData.length}`);

    if (!validData.length) {
      throw new Error(
        "No valid records found in uploaded file. Please ensure rows contain at least a Name, a 10-digit Phone number, and an Email address."
      );
    }

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
