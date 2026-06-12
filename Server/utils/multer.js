const multer = require("multer");
const fs = require("fs");
const os = require("os");
const path = require("path");

const uploadDir = path.join(os.tmpdir(), "nova-testimonial-uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(gif|jpe?g|mp4|png)$/i;
  const allowedMimeTypes = /^(image\/(gif|jpeg|png)|video\/mp4)$/i;

  if (!allowedExtensions.test(file.originalname) || !allowedMimeTypes.test(file.mimetype)) {
    return cb(new Error("Only GIF, JPEG, PNG, and MP4 files are allowed"));
  }

  cb(null, true);
};

const limits = {
  fileSize: 5 * 1024 * 1024,
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

module.exports = upload;
