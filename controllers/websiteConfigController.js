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

module.exports = {
  getWebsiteInfo,
};
