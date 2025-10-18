import { processExcelFile } from "../../helper/processxl.js";
import leadSchema from "../../models/contactDetails.js";


export const handleContactDetailsUsingXlsx = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // processExcelFile(filePath, batchSize)
    const result = await processExcelFile(req.file.path, 100);

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("Excel upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Some error occurred",
    });
  }
};


export const addContactDetails = async (req, res) => {
  try {
    const { name, email, phone, whatshapNo, createdAt, source } = req.body;

    if (!name || !email || !phone || !whatshapNo || !createdAt || !source) {
      return res.status(400).json({
        success: false,
        message: "Some details are missing",
      });
    }

    const newContact = new leadSchema({
      name,
      email,
      phone,
      whatshapNo,
      createdAt,
      source,
    });

    await newContact.save();
    res.status(200).json({
      success: true,
      message: "Contact added successfully",
    });
  } catch (error) {
    console.error("Add contact error:", error);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};


export const editList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, whatshapNo, createdAt, source } = req.body;

    const contact = await leadSchema.findById(id);
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });
    }

    contact.name = name || contact.name;
    contact.email = email || contact.email;
    contact.phone = phone || contact.phone;
    contact.whatshapNo = whatshapNo || contact.whatshapNo;
    contact.createdAt = createdAt || contact.createdAt;
    contact.source = source || contact.source;

    await contact.save();
    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
    });
  } catch (error) {
    console.error("Edit contact error:", error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};


export const deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await leadSchema.findByIdAndDelete(id);

    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};


export const fetchAllContactList = async (req, res) => {
  try {
    const contacts = await leadSchema.find({});
    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Fetch contacts error:", error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};
