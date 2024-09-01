const multer = require("multer");
const path = require("path");

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the destination directory
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Use the current timestamp and original filename
  },
});

// File filter to allow only specific file types (e.g., images)
const fileFilter = function (req, file, cb) {
  const filetypes = /jpeg|jpg|png|gif|mp4/; // Allowed file types
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only image files are allowed!"));
};

// Initialize multer with storage and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: fileFilter,
});

module.exports = upload;
