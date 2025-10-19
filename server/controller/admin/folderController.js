
import Folder from"../../models/createList.js"

export const createFolder = async (req, res) => {
  try {
    const { folderName } = req.body;
    if (!folderName)
      return res
        .status(400)
        .json({ success: false, message: "Folder name is required" });

    const existing = await Folder.findOne({ folderName });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Folder already exists" });

    const folder = await Folder.create({ folderName });
    res.status(201).json({ success: true, data: folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.find().sort({ createdAt: -1 });
    res.json({ success: true, data: folders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    await Folder.findByIdAndDelete(id);
    res.json({ success: true, message: "Folder deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
