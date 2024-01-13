const mongoose = require("mongoose");

const websiteConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [25, "Website name can not be more than 25 characters"],
  },
  title: {
    type: String,
    required: true,
    maxlength: [25, "Tittle can not be more than 25 characters"],
  },
  description: {
    type: String,
    required: true,
    maxlength: [255, "Description can not be more than 255 characters"],
  },
  logoUrl: {
    type: String,
    required: true,
  },
  boardStatus: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  sortingOrder: {
    type: String,
    enum: ["MostVoted", "NewestFirst", "OldestFirst"],
    default: "MostVoted",
  },
});

module.exports = mongoose.model("WebsiteConfig", websiteConfigSchema);
