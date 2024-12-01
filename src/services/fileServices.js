const fs = require('fs');
const path = require('path');
const File = require('../models/File'); // Ensure correct path

/**
 * Upload a file to the server and save metadata to the database.
 * @param {String} userId - The ID of the user uploading the file.
 * @param {Object} file - The file object provided by Multer.
 * @returns {Object} - The saved file document.
 */
const uploadFile = async (userId, file) => {
  try {
    // Ensure 'uploads' directory exists
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    // Define upload path
    const uploadPath = path.join(uploadsDir, file.originalname);

    // Write file buffer to disk
    fs.writeFileSync(uploadPath, file.buffer);

    // Save file metadata in the database
    const newFile = new File({
      name: file.originalname,
      path: uploadPath,
      size: file.size,
      user: userId,
    });

    await newFile.save();
    return newFile;
  } catch (error) {
    console.error('Error uploading file:', error.message);
    throw error;
  }
};

/**
 * Retrieve all files for a specific user.
 * @param {String} userId - The ID of the user.
 * @returns {Array} - A list of files.
 */
const getFilesByUser = async (userId) => {
  try {
    return await File.find({ user: userId });
  } catch (error) {
    console.error('Error fetching files:', error.message);
    throw error;
  }
};

module.exports = {
  uploadFile,
  getFilesByUser,
};
