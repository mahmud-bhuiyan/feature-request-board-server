const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  createRequest,
  getAllRequest,
  getFeatureRequestById,
  updateRequestsLikesById,
  addFeatureRequestCommentsById,
  deleteCommentsById,
  updateRequestsStatusById,
} = require("../controllers/featureController");

// Create and get feature requests
router.route("/").post(auth, createRequest).get(getAllRequest);

// Get a specific feature request by ID
router.route("/:id").get(getFeatureRequestById);

// Update feature request status
router.route("/:id/status").patch(auth, updateRequestsStatusById);

// Update feature request likes
router.route("/:id/likes").patch(auth, updateRequestsLikesById);

router.route("/:id/comments").patch(auth, addFeatureRequestCommentsById);

router
  .route("/:featureId/comments/:commentId")
  .delete(auth, deleteCommentsById);

module.exports = router;
