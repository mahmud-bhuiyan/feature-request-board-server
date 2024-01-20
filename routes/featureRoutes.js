const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const checkAdmin = require("../middlewares/checkAdmin");

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
  deleteRequestById,
  deleteFeatureRequestById,
  updateFeatureRequestById,
  updateCommentById,
} = require("../controllers/featureController");

// Create and get feature requests
router.route("/").post(auth, createRequest).get(getAllRequest);

// Get, soft delete by admin and delete feature request by ID
router
  .route("/:id")
  .get(getFeatureRequestById)
  .patch(auth, checkAdmin, deleteRequestById)
  .delete(auth, deleteFeatureRequestById);

// Update feature request status
router.route("/:id/update").patch(auth, updateFeatureRequestById);

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

// Update a comment by ID
router.route("/:featureId/comments/:commentId").patch(auth, updateCommentById);

// Search feature requests
router.route("/search/:searchTerm").get(searchFeatures);

module.exports = router;
