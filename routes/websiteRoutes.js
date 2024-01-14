const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middlewares/auth");
const checkAdmin = require("../middlewares/checkAdmin");

const {
  getWebsiteInfo,
  updateWebsiteInfo,
  imageUpload,
} = require("../controllers/websiteConfigController");

router
  .route("/")
  .get(getWebsiteInfo)
  .patch(auth, checkAdmin, updateWebsiteInfo);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

router
  .route("/upload")
  .patch(auth, checkAdmin, upload.single("file"), imageUpload);

module.exports = router;
