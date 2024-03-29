const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { createCustomError } = require("../errors/customError");

// custom user details
const customUserDetails = (user) => {
  const { _id, name, email, photoURL, role } = user;
  return { _id, name, email, photoURL, role };
};

// JWT token generator
const generateAuthToken = (userId) => {
  return jwt.sign(
    {
      _id: userId.toString(),
    },
    process.env.JWT_SECRET_KEY
  );
};

/**
 * user register
 * /api/v1/users/register
 * public route
 */
const registerUser = asyncWrapper(async (req, res) => {
  // Extract user data from the request body
  const { name, email, password, confirmPassword } = req.body;

  // Checking if the provided password and confirmPassword match
  if (password !== confirmPassword) {
    throw createCustomError("Password and Confirm Password do not match", 400);
  }

  // Duplicate user handling
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createCustomError("Email is already in use", 400);
  }

  // Hashing the user's password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Creating a new User instance with hashed password
  const user = new User({ name, email, password: hashedPassword });

  // Generating a JWT token for the newly registered user
  const token = generateAuthToken(user._id);

  // Saving the new user in the database
  await user.save();

  // user details
  const userDetails = customUserDetails(user);

  res
    .status(201)
    .send({ message: "User Created Successfully", user: userDetails, token });
});

/**
 * google-signin
 * /api/v1/users/google-signin
 * public route
 */
const googleSignIn = async (req, res) => {
  // Extract user data from the request body
  const { name, email, photoURL } = req.body;

  // Duplicate user handling
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    // Generate a JWT token for the existing user
    const token = generateAuthToken(existingUser._id);

    // Return the token and user details
    const userDetails = customUserDetails(existingUser);
    return res.status(200).send({
      message: "Sign In with Google Successful",
      user: userDetails,
      token,
    });
  }

  // Creating a new User instance with hashed password
  const user = new User({ name, email, photoURL });

  // Generating a JWT token for the newly registered user
  const token = generateAuthToken(user._id);

  // Saving the new user in the database
  await user.save();

  // user details
  const userDetails = customUserDetails(user);

  res
    .status(201)
    .send({ message: "User created successfully", user: userDetails, token });
};

/**
 * user login
 * /api/v1/users/register
 * public route
 */
const loginUser = asyncWrapper(async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  // Find the user in the database using the provided email
  const user = await User.findOne({ email });

  // If no user is found
  if (!user) {
    throw createCustomError("User not found!", 404);
  }

  if (!user?.password) {
    throw createCustomError("Please Login with Google", 401);
  } else {
    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match
    if (!isMatch) {
      throw createCustomError("Invalid credentials", 401);
    }

    // Generate a JSON Web Token (JWT) for authentication
    const token = generateAuthToken(user._id);

    // Get custom details about the user
    const userDetails = customUserDetails(user);

    // Send a successful response with the user details and token
    res
      .status(200)
      .send({ message: "Logged in successfully", user: userDetails, token });
  }
});

/**
 * viewUserDetails
 * /api/v1/users/me
 * private route
 */
const viewUserDetails = asyncWrapper(async (req, res) => {
  // Extract user ID from the authenticated user in the request object
  const userId = req.user._id;

  // Find the user in the database by ID
  const user = await User.findById(userId);

  // If no user is found
  if (!user) {
    throw createCustomError("User not found!", 404);
  }

  // user details
  const userDetails = customUserDetails(user);

  // Sending the response with user details
  res.status(200).json({ message: "User found", user: userDetails });
});

module.exports = {
  registerUser,
  googleSignIn,
  loginUser,
  viewUserDetails,
};
