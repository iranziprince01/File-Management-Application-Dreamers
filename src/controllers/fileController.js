const File = require("../models/File");
const fs = require("fs");
const path = require("path");

// Upload a file
const uploadFile = async ({ userId, file, originalName }) => {
  try {
    const uploadDir = path.join(__dirname, "../uploads");
    const filePath = path.join(uploadDir, originalName);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(filePath, file);

    const fileData = {
      name: originalName,
      path: filePath,
      size: file.length,
      user: userId,
    };

    const uploadedFile = await File.create(fileData);
    return uploadedFile;
  } catch (err) {
    throw new Error("File upload failed: " + err.message);
  }
};

// Get files for the logged-in user
const getFiles = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user information found" });
    }

    const files = await File.find({ user: req.user.id });
    res.status(200).json({ files });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch files", error: err.message });
  }
};

// Delete a file
const deleteFile = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user information found" });
    }

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden: You are not authorized to delete this file",
      });
    }

    await file.deleteOne();
    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete file", error: err.message });
  }
};

// Update file details
const updateFile = async (id, userId, updateData) => {
  try {
    // Find the file by ID and verify ownership
    const file = await File.findById(id);

    if (!file) {
      return null; // File not found
    }

    // Check if the user is authorized to update the file
    if (file.user.toString() !== userId) {
      return null; // Not authorized to update the file
    }

    // Apply the update (in this case, the name)
    if (updateData.name) file.name = updateData.name;

    // Save the updated file and return it
    const updatedFile = await file.save();
    return updatedFile;
  } catch (err) {
    // Throw any errors to be handled in the route
    throw err;
  }
};

module.exports = { uploadFile, getFiles, deleteFile, updateFile };
