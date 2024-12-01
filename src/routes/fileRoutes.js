const express = require("express");
const multer = require("multer");
const { protect } = require("../middlewares/auth");
const {
  uploadFile,
  getFiles,
  deleteFile,
  updateFile,
} = require("../controllers/fileController");

const router = express.Router();

// Configure Multer for file uploads (uses memory storage)
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Invalid file data
 *       500:
 *         description: Internal server error
 */
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    const userId = req.user.id; // User ID from the `protect` middleware
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Directly handle file upload
    const uploadedFile = await uploadFile({
      userId,
      file: file.buffer,
      originalName: file.originalname,
    });

    res.status(201).json({
      message: req.t("file_upload_success"),
      file: uploadedFile,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "Error uploading file", error: error.message });
    }
  }
});

/**
 * @swagger
 * /api/files:
 *   get:
 *     summary: Get all files for the logged-in user
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of files
 *       500:
 *         description: Failed to fetch files
 */
router.get("/", protect, async (req, res) => {
  try {
    const files = await getFiles(req, res);
    if (!res.headersSent) {
      res.status(200).json(files); // This is handled in the controller method itself
    }
  } catch (err) {
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "Failed to fetch files", error: err.message });
    }
  }
});

/**
 * @swagger
 * /api/files/{id}:
 *   delete:
 *     summary: Delete a file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found or not authorized
 *       500:
 *         description: Failed to delete file
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    await deleteFile(req, res);
  } catch (err) {
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "Failed to delete file", error: err.message });
    }
  }
});

/**
 * @swagger
 * /api/files/{id}:
 *   put:
 *     summary: Update file details
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: File updated successfully
 *       404:
 *         description: File not found or not authorized
 *       500:
 *         description: Failed to update file
 */
router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    // Pass req, res, and other necessary parameters to the updateFile function
    const updatedFile = await updateFile(id, userId, updateData);

    // You should now handle the response inside the controller
    if (updatedFile) {
      res.status(200).json({
        message: req.t("file_update_success"),
        file: updatedFile,
      });
    } else {
      res.status(404).json({ message: "File not found or not authorized" });
    }
  } catch (error) {
    console.error("Error updating file:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "Error updating file", error: error.message });
    }
  }
});

module.exports = router;
