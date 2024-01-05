const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema(
  {
    createdBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      name: String,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "under-review", "planned", "in-progress", "complete"],
      default: "pending",
    },
    likes: {
      count: { type: Number, default: 0 },
      users: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          name: String,
        },
      ],
    },
    comments: {
      count: { type: Number, default: 0 },
      data: [
        {
          createdBy: {
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            name: String,
          },
          comment: String,
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Feature = mongoose.model("Feature", featureSchema);
module.exports = Feature;
