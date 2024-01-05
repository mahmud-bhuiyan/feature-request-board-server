const Feature = require("../models/Feature");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { createCustomError } = require("../errors/customError");

// add new request
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
    createdBy: {
      userId: req.user._id,
      name: req.user.name,
    },
  });

  // Save the new feature to the database
  await feature.save();

  res.status(201).json({
    message: "Feature created successfully",
    feature,
  });
});

module.exports = {
  createRequest,
};
