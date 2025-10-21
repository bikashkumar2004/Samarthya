import { processExcelFile } from "../../helper/processxl.js";
import mongoose from "mongoose";
import ContactDetails from "../../models/contactDetails.js";

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

const formatPhone = (number) => {
  if (!number) return number;
  const cleaned = number.replace(/\D/g, ""); // remove non-digits
  if (cleaned.length !== 10) throw new Error("Phone number must be 10 digits");
  return "+91" + cleaned;
};

export const addContactDetails = async (req, res) => {
  try {
    const { name, email, phone, whatsappNo, status } = req.body;

    if (!name || !email || !phone || !whatsappNo || !status) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newContact = new ContactDetails({
      name,
      email,
      phone: formatPhone(phone),
      whatsappNo: formatPhone(whatsappNo),
      status,
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Contact added successfully",
      data: newContact,
    });
  } catch (error) {
    console.error("Add contact error:", error);
    res.status(500).json({ success: false, message: error.message || "Some error occurred" });
  }
};

export const editList = async (req, res) => {
  try {
    const id = req.params.id.trim();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid contact ID" });
    }

    const contact = await ContactDetails.findById(id);
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });

    const { name, email, phone, whatsappNo, status } = req.body;

    if (name) contact.name = name;
    if (email) contact.email = email;
    if (phone) contact.phone = formatPhone(phone);
    if (whatsappNo) contact.whatsappNo = formatPhone(whatsappNo);
    if (status) contact.status = status;

    await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Edit contact error:", error);
    res.status(500).json({ success: false, message: error.message || "Error occurred" });
  }
};


export const deleteList = async (req, res) => {
  try {
    const id = req.params.id.trim();
    console.log(id);

    if (!id) {
      return res.status(201).json({
        success: false,
        message: "Id not found",
      });
    }
    const contact = await ContactDetails.findByIdAndDelete(id);

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