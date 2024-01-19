const User = require("../models/User");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { createCustomError } = require("../errors/customError");

/**
 * all users
 * /api/v1/admins/
 * private route (get)
 */
const getAllUsers = asyncWrapper(async (req, res) => {
  // Pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  // Calculate the skip value based on the page and limit
  const skip = (page - 1) * limit;

  // Fetch users from the database with pagination
  const users = await User.find({ isDeleted: false })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);

  // Map the features array to include only the desired fields
  const userDetails = users.map((user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    photoURL: user.photoURL,
    role: user.role,
    isDeleted: user.isDeleted,
  }));

  // Calculate total pages and total users
  const totalUsersCount = await User.countDocuments({ isDeleted: false });
  const totalPages = Math.ceil(totalUsersCount / limit);

  res.status(200).json({
    message: "Users fetched successfully",
    users: userDetails,
    pageInfo: {
      currentPage: page,
      totalPages: totalPages,
      totalUsers: totalUsersCount,
    },
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
 * delete user (soft delete)
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
