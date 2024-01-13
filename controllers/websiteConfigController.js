const WebsiteConfig = require("../models/WebsiteConfig");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { createCustomError } = require("../errors/customError");

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

  res.status(200).json({
    message: "Website info fetched successfully",
    websiteInfo: websiteDetails,
  });
});

/**
 * update Website Info
 * /api/v1/website/
 * private route (patch)
 */
const updateWebsiteInfo = asyncWrapper(async (req, res) => {
  // Assuming req.body contains the updated website information
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

  res.status(200).json({
    message: "Website info updated successfully",
    websiteInfo: websiteDetails,
  });
});

module.exports = {
  getWebsiteInfo,
  updateWebsiteInfo,
};
