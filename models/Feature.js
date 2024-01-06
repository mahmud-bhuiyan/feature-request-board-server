const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "under-review", "planned", "in-progress", "complete"],
      default: "pending",
    },
    likes: {
      count: {
        type: Number,
        default: 0,
      },
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    comments: {
      count: {
        type: Number,
        default: 0,
      },
      data: [
        {
          commentsBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          comment: String,
          createdAt: {
            type: Date,
            default: Date.now,
          },
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        },
      ],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Feature = mongoose.model("Feature", featureSchema);
module.exports = Feature;
