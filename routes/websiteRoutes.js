const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const checkAdmin = require("../middlewares/checkAdmin");

const { getWebsiteInfo } = require("../controllers/websiteConfigController");

router.route("/").get(auth, checkAdmin, getWebsiteInfo);

module.exports = router;
