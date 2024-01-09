const User = require("../models/User");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { createCustomError } = require("../errors/customError");

/**
 * all users
 * /api/v1/admins/
 * private route (get)
 */
const getAllUsers = asyncWrapper(async (req, res) => {
  const user = req.user;

  // Check if the user has the "admin" role
  if (user.role !== "admin") {
    throw createCustomError("You are not an admin!", 403);
  }

  // Fetch all users from the database
  const users = await User.find().sort({ _id: -1 });

  // Map the features array to include only the desired fields
  const userDetails = users.map((user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    photoURL: user.photoURL,
    role: user.role,
  }));

  res.status(200).json({
    message: "Users fetched successfully",
    users: userDetails,
  });
});

module.exports = {
  getAllUsers,
};
