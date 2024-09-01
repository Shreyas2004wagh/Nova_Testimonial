const multer = require("multer");
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|mp4)$/)) {
    return cb(new Error("Only JPEG and PNG files are allowed"));
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