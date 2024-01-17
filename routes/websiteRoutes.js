const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const checkAdmin = require("../middlewares/checkAdmin");

const {
  getWebsiteInfo,
  updateWebsiteInfo,
  uploadImage,
} = require("../controllers/websiteConfigController");

router
  .route("/")
  .get(getWebsiteInfo)
  .patch(auth, checkAdmin, updateWebsiteInfo);

router.route("/upload").patch(auth, checkAdmin, uploadImage);

module.exports = router;
