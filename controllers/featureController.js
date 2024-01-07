const Feature = require("../models/Feature");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { createCustomError } = require("../errors/customError");

/**
 * add new request
 * /api/v1/features/
 * private route
 */
const createRequest = asyncWrapper(async (req, res) => {
  // Extract feature details from the request body
  const { title, description } = req.body;

  // Check if a feature with the same title and createdBy userId already exists
  const existingFeature = await Feature.findOne({
    title: { $regex: new RegExp(title, "i") },
    // "createdBy.userId": req.user._id,
  });

  if (existingFeature) {
    throw createCustomError("Feature with the same title already exists", 400);
  }

  // If no existing feature found, create a new one
  const feature = new Feature({
    title,
    description,
    createdBy: req.user._id,
  });

  // Save the new feature to the database
  await feature.save();

  res.status(201).json({
    message: "Feature created successfully",
    feature,
  });
});

/**
 * all requests
 * /api/v1/features/
 * private route
 */
// const getAllRequest = asyncWrapper(async (req, res) => {
//   const features = await Feature.find().sort({ _id: -1 });

//   res.status(200).json({
//     message: "All features retrieved successfully",
//     features,
//   });
// });

const getAllRequest = asyncWrapper(async (req, res) => {
  const features = await Feature.find({ isDeleted: false })
    .sort({ _id: -1 })
    .populate({
      path: "createdBy",
      select: "name email photoURL",
    })
    .populate("likes.users")
    .populate("comments.data.commentsBy");

  // Map the features array to include only the desired fields
  const simplifiedFeatures = features.map((feature) => ({
    _id: feature._id,
    title: feature.title,
    description: feature.description,
    createdBy: feature.createdBy,
    createdAt: feature.createdAt,
    isDeleted: feature.isDeleted,
    likes: feature.likes,
    status: feature.status,
    comments: feature.comments,
  }));

  res.status(200).json({
    message: "All features retrieved successfully",
    features: simplifiedFeatures,
  });
});

/**
 * get a requests by id
 * /api/v1/features/:id
 * private route
 */
const getFeatureRequestById = asyncWrapper(async (req, res) => {
  // Get the request ID from req.params
  const featureId = req.params.id;

  const feature = await Feature.findById(featureId).populate("createdBy");

  if (!feature) {
    throw createCustomError("Feature not found", 404);
  }

  // Format the feature details for the response
  const formattedFeature = {
    id: feature._id,
    title: feature.title,
    description: feature.description,
    status: feature.status,
    createdBy: {
      id: feature.createdBy._id,
      name: feature.createdBy.name,
      email: feature.createdBy.email,
      photoURL: feature.createdBy.photoURL,
    },
    likes: {
      count: feature.likes.count,
      users: feature.likes.users,
    },
    comments: {
      count: feature.comments.count,
      data: feature.comments.data,
    },
    createdAt: feature.createdAt,
  };

  res.status(200).json({
    message: "Feature fetched successfully",
    feature: formattedFeature,
  });
});

/**
 * update a requests by id
 * /api/v1/features/:id
 * private route
 */
const updateFeatureRequestLikesById = asyncWrapper(async (req, res) => {
  const featureId = req.params.id;
  const userId = req.user.id;

  // Check if the feature request exists
  const feature = await Feature.findById(featureId);

  if (!feature) {
    throw createCustomError("Feature not found", 404);
  }

  // Check if the user has already liked this feature
  const isLiked = feature.likes.users.includes(userId);

  if (isLiked) {
    // User already liked the feature, so unlike it
    feature.likes.users.pull(userId);
    feature.likes.count -= 1;
  } else {
    // User hasn't liked the feature, so like it
    feature.likes.users.push(userId);
    feature.likes.count += 1;
  }

  // Save the updated feature to the database
  await feature.save();

  // Respond with the updated feature
  res.json({ feature });
});

module.exports = {
  createRequest,
  getAllRequest,
  getFeatureRequestById,
  updateFeatureRequestLikesById,
};
