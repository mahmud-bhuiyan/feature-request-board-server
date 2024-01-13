const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const checkAdmin = require("../middlewares/checkAdmin");

const {
  getWebsiteInfo,
  updateWebsiteInfo,
} = require("../controllers/websiteConfigController");

router
  .route("/")
  .get(auth, checkAdmin, getWebsiteInfo)
  .patch(auth, checkAdmin, updateWebsiteInfo);

module.exports = router;
