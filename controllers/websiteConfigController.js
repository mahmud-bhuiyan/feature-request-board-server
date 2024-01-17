const WebsiteConfig = require("../models/WebsiteConfig");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { createCustomError } = require("../errors/customError");
const fs = require("fs").promises;
const path = require("path");

// custom website details
const customWebsiteDetails = (websiteDetails) => {
  const { name, title, description, logoUrl, boardStatus, sortingOrder } =
    websiteDetails;

  return { name, title, description, logoUrl, boardStatus, sortingOrder };
};

/**
 * get Website Info
 * /api/v1/website/
 * private route (get)
 */
const getWebsiteInfo = asyncWrapper(async (req, res) => {
  // Fetch the website details from the database
  const websiteDetails = await WebsiteConfig.findOne();

  if (!websiteDetails) {
    throw createCustomError("Website details not found", 404);
  }

  const websiteInfo = customWebsiteDetails(websiteDetails);

  res.status(200).json({
    message: "Website info fetched successfully",
    websiteInfo,
  });
});

/**
 * update Website Info
 * /api/v1/website/
 * private route (patch)
 */
const updateWebsiteInfo = asyncWrapper(async (req, res) => {
  // Assuming req.body contains the updated website information
  // using the schema to check the req.body values validation
  const updatedWebsiteInfo = req.body;

  // Find the existing website details in the database
  let websiteDetails = await WebsiteConfig.findOne();

  if (websiteDetails) {
    // Update only the fields that are present in the request
    Object.keys(updatedWebsiteInfo).forEach((key) => {
      if (websiteDetails.schema.paths[key]) {
        websiteDetails[key] = updatedWebsiteInfo[key];
      }
    });
  }

  // Save the updated/created website details
  await websiteDetails.save();

  const websiteInfo = customWebsiteDetails(websiteDetails);

  res.status(200).json({
    message: "Website info updated successfully",
    websiteInfo,
  });
});

/**
 * update image
 * /api/v1/website/upload
 * private route (patch)
 */
// Route for handling image upload
const uploadImage = asyncWrapper(async (req, res) => {
  const data = req.body;

  // Find the existing website details in the database
  let websiteDetails = await WebsiteConfig.findOne();

  if (websiteDetails) {
    websiteDetails.logoUrl = data.logoUrl;

    // Save the updated image
    await websiteDetails.save();
  }

  res
    .status(200)
    .json({ success: true, message: "Image uploaded successfully" });
});

module.exports = {
  getWebsiteInfo,
  updateWebsiteInfo,
  uploadImage,
};
