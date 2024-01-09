const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  createRequest,
  getAllRequest,
  getFeatureRequestById,
  updateFeatureRequestLikesById,
  addFeatureRequestCommentsById,
  deleteCommentsById,
} = require("../controllers/featureController");

router.route("/").post(auth, createRequest).get(auth, getAllRequest);

router
  .route("/:id")
  .get(auth, getFeatureRequestById)
  .patch(auth, updateFeatureRequestLikesById);

router.route("/:id/comments").patch(auth, addFeatureRequestCommentsById);

router
  .route("/:featureId/comments/:commentId")
  .delete(auth, deleteCommentsById);

module.exports = router;
