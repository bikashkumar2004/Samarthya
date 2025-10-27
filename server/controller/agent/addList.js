import { processExcelFile } from "../../helper/processxl.js";
import mongoose from "mongoose";
import ContactDetails from "../../models/contactDetails.js";
import Calls from "../../models/callHistory.js";

export const handleContactUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const result = await processExcelFile(req.file.path);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while processing the file",
    });
  }
};


export const addContactDetails = async (req, res) => {
  try {
    const { name, email, phone, whatsappNo, status,purpose } = req.body;

    if (!name || !email || !phone || !whatsappNo || !status || !purpose) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newContact = new ContactDetails({
      name,
      email,
      phone,
      whatsappNo,
      status,
      purpose
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
    const id = req.params.id.trim(); // Correct: trim the string directly
    if (!id) {
      return res.status(201).json({
        success: false,
        message: "Id not found",
      });
    }

     const { name, email, phone, whatsappNo, status,purpose } = req.body

    // Optional: validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid contact ID" });
    }

    const contact = await ContactDetails.findById(id);
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });
    }

    // Update only provided fields
    if (name) contact.name = name;
    if (email) contact.email = email;
    if (phone) contact.phone = phone;
    if (whatsappNo) contact.whatsappNo = whatsappNo;
    if (status) contact.status = status;
    if(purpose) contact.purpose =purpose;

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
    const id = req.params.id?.trim();

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Contact ID not provided",
      });
    }
    const contact = await ContactDetails.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // Delete all related call history
    const deletedCalls = await Calls.deleteMany({ customer_id: id });

    console.log(
      ` Deleted ${deletedCalls.deletedCount} call history records for contact: ${id}`
    );

    // 3️ Respond success
    res.status(200).json({
      success: true,
      message: `Contact and ${deletedCalls.deletedCount} related call history records deleted successfully.`,
    });
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while deleting contact and related call history",
      error: error.message,
    });
  }
};


export const fetchAllContactList = async (req, res) => {
  try {
    const listOfContacts = await ContactDetails.find({});
    res.status(200).json({
      success: true,
      data: listOfContacts,
    });
  } catch (error) {
    console.error("Fetch contacts error:", error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
};

export const showcontactDetails=async(req,res)=>{
  try{
    const id=req.params.id.trim();
    const contactList=await ContactDetails.findById(id)
    if(!contactList){
      return res.status(400).json({
        success:false,
        message:"Contact not found."
      })
    }
    res.status(200).json({
      success:true,
      data:contactList
    })
  }catch(e){
    console.error("Fetch contacts error:", error);
    res.status(500).json({ success: false, message: "Error occurred" });
  }
}