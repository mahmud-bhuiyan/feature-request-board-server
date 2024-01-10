const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  softDeleteUserById,
} = require("../controllers/adminController");
const auth = require("../middlewares/auth");

// View all users
router.get("/", auth, getAllUsers);

// soft delete a user
router.route("/:id").patch(auth, softDeleteUserById);

module.exports = router;
