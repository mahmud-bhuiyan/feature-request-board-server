const WebsiteConfig = require("../models/WebsiteConfig");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { createCustomError } = require("../errors/customError");

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
// const imageUpload = asyncWrapper(async (req, res) => {
//   const image = req.file.filename;

//   // Find the existing website details in the database
//   let websiteDetails = await WebsiteConfig.findOne();
//   console.log(websiteDetails?.logoUrl);
//   if (websiteDetails) {
//     // Update the logoUrl with the new image filename
//     websiteDetails.logoUrl = image;
//   }
//   await websiteDetails.save();
//   const websiteInfo = customWebsiteDetails(websiteDetails);
//   res.status(200).json({
//     message: "Website image updated successfully",
//     websiteInfo,
//   });
// });

const fs = require("fs").promises;
const path = require("path");

const imageUpload = asyncWrapper(async (req, res) => {
  const image = req.file;

  // Check if a file is provided in the request
  if (!image) {
    throw createCustomError("No file provided", 400);
  }

  // Find the existing website details in the database
  let websiteDetails = await WebsiteConfig.findOne();

  if (websiteDetails.logoUrl) {
    const existingLogoPath = path.join("public/Images", websiteDetails.logoUrl);

    // Check if the existing logo file exists in the Images folder
    try {
      await fs.access(existingLogoPath);

      // If the file exists, delete it
      await fs.unlink(existingLogoPath);
      console.log(`Deleted existing logo file`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }

  // Update the logoUrl with the new image filename
  websiteDetails.logoUrl = image.filename;
  await websiteDetails.save();
  const websiteInfo = customWebsiteDetails(websiteDetails);
  res.status(200).json({
    message: "Website image updated successfully",
    websiteInfo,
  });
});

module.exports = {
  getWebsiteInfo,
  updateWebsiteInfo,
  imageUpload,
};
