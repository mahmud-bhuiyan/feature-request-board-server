const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  createRequest,
  getAllRequest,
  getFeatureRequestById,
} = require("../controllers/featureController");

router.route("/").post(auth, createRequest).get(auth, getAllRequest);

router.route("/:id").get(auth, getFeatureRequestById);

module.exports = router;
