const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const { createRequest } = require("../controllers/featureController");

router.route("/").post(auth, createRequest);

module.exports = router;
