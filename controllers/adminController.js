const User = require("../models/User");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { createCustomError } = require("../errors/customError");

/**
 * all users
 * /api/v1/admins/
 * private route (get)
 */
const getAllUsers = asyncWrapper(async (req, res) => {
  // Fetch all users from the database
  const users = await User.find({ isDeleted: false }).sort({ _id: -1 });

  // Map the features array to include only the desired fields
  const userDetails = users.map((user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    photoURL: user.photoURL,
    role: user.role,
    isDeleted: user.isDeleted,
  }));

  res.status(200).json({
    message: "Users fetched successfully",
    users: userDetails,
  });
});

/**
 * Make a user an admin
 * /api/v1/admins/make-admin/:id
 * private route (patch)
 */
const makeAdmin = asyncWrapper(async (req, res) => {
  // Get the delete users ID from req.params
  const userId = req.params.id;

  // Fetch user from the database
  const user = await User.findOne({ _id: userId, isDeleted: false });

  if (!user) {
    throw createCustomError("User not found or has been deleted", 404);
  }

  // Make a user an admin
  user.role = "admin";
  await user.save();

  res.status(200).json({
    message: `${user.name} is now an Admin`,
    user: {
      _id: user._id,
      name: user.name,
      role: user.role,
    },
  });
});

/**
 * delete user
 * /api/v1/admins/:id
 * private route (patch)
 */
const softDeleteUserById = asyncWrapper(async (req, res) => {
  // Get the delete users ID from req.params
  const userId = req.params.id;

  // Fetch user from the database
  const deletedUser = await User.findById(userId);

  // Soft delete the user
  deletedUser.isDeleted = true;
  await deletedUser.save();

  res.status(200).json({
    message: "Users deleted successfully",
  });
});

module.exports = {
  getAllUsers,
  softDeleteUserById,
  makeAdmin,
};
