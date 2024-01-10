const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  softDeleteUserById,
} = require("../controllers/adminController");
const auth = require("../middlewares/auth");
const checkAdmin = require("../middlewares/checkAdmin");

// View all users
router.get("/", auth, checkAdmin, getAllUsers);

// soft delete a user
router.route("/:id").patch(auth, checkAdmin, softDeleteUserById);

module.exports = router;
