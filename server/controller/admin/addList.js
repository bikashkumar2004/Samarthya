import { processExcelFile } from "../../helper/processxl.js";
import ContactDetails from "../../models/contactDetails.js"; 
import Folder from "../../models/createList.js";

export const handleContactDetailsUsingXlsx = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

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
    const { folderId, name, email, phone, whatsappNo, source } = req.body;

    // ✅ Basic validation
    if (!name || !email || !phone || !whatsappNo || !source || !folderId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const folder = await Folder.findById(folderId);
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

 
    const newContact = new ContactDetails({
      name,
      email,
      phone,
      whatsappNo,
      source,
      folderId,
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Contact added successfully",
      data: newContact,
    });
  } catch (error) {
    console.error("Add contact error:", error);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};


export const editList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, whatsappNo, source, folderId } = req.body;

    const contact = await ContactDetails.findById(id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    // Update only provided fields
    if (name) contact.name = name;
    if (email) contact.email = email;
    if (phone) contact.phone = phone;
    if (whatsappNo) contact.whatsappNo = whatsappNo;
    if (source) contact.source = source;
    if (folderId) contact.folderId = folderId;

    await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Edit contact error:", error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};


export const deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await ContactDetails.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
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
    // Populate folder name
    const contacts = await ContactDetails.find({}).populate("folderId", "folderName");
    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Fetch contacts error:", error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};
