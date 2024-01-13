const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  createRequest,
  getAllRequest,
  getFeatureRequestById,
  likeFeatureRequestById,
  unlikeFeatureRequestById,
  addFeatureRequestCommentsById,
  deleteCommentById,
  updateRequestsStatusById,
  searchFeatures,
} = require("../controllers/featureController");

// Create and get feature requests
router.route("/").post(auth, createRequest).get(getAllRequest);

// Get a specific feature request by ID
router.route("/:id").get(getFeatureRequestById);

// Update feature request status
router.route("/:id/status").patch(auth, updateRequestsStatusById);

// Like a feature request
router.patch("/:id/like", auth, likeFeatureRequestById);

// Unlike a feature request
router.patch("/:id/unlike", auth, unlikeFeatureRequestById);

// Add comments to a feature request
router.route("/:id/comments").patch(auth, addFeatureRequestCommentsById);

// Delete a comment by ID
router.route("/:featureId/comments/:commentId").delete(auth, deleteCommentById);

// Search feature requests
router.route("/search/:searchTerm").get(searchFeatures);

module.exports = router;
