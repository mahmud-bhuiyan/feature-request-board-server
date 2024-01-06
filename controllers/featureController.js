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
  let page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  // If the user requests a page beyond the initial 20, calculate the new page
  if (page > 4) {
    page = Math.ceil((pageSize * (page - 4)) / 20) + 1;
  }

  const skip = (page - 1) * pageSize;

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

// const getAllRequest = asyncWrapper(async (req, res) => {
//   const features = await Feature.find({ isDeleted: false })
//     .sort({ _id: -1 })
//     .populate({
//       path: "createdBy",
//       select: "name email photoURL",
//     })
//     .populate("likes.users")
//     .populate("comments.data.commentsBy");

//   // Map the features array to include only the desired fields
//   const simplifiedFeatures = features.map((feature) => ({
//     _id: feature._id,
//     title: feature.title,
//     description: feature.description,
//     createdBy: feature.createdBy,
//     createdAt: feature.createdAt,
//     isDeleted: feature.isDeleted,
//     likes: feature.likes,
//     status: feature.status,
//     comments: feature.comments,
//   }));

//   res.status(200).json({
//     message: "All features retrieved successfully",
//     features: simplifiedFeatures,
//   });
// });

module.exports = {
  createRequest,
  getAllRequest,
};
