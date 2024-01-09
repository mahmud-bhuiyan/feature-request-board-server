const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/adminController");
const auth = require("../middlewares/auth");

// View user details
router.get("/", auth, getAllUsers);

module.exports = router;
