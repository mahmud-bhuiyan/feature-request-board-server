const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  softDeleteUserById,
  makeAdmin,
} = require("../controllers/adminController");
const auth = require("../middlewares/auth");
const checkAdmin = require("../middlewares/checkAdmin");

// View all users
router.get("/", auth, checkAdmin, getAllUsers);

// soft delete a user
router.patch("/:id", auth, checkAdmin, softDeleteUserById);

// Make a user an admin
router.patch("/make-admin/:id", auth, checkAdmin, makeAdmin);

module.exports = router;
