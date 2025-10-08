const express = require("express");
const multer = require('multer');
const router = express.Router();
const { recommendedVideos } = require("../controllers/user");
const { protect, admin, optionalAuth } = require("../middlewares/auth");

const {
  newVideo,
  getVideo,
  likeVideo,
  dislikeVideo,
  addComment,
  newView,
  searchVideo,
  getVideoFile,
  getThumbnailFile,
} = require("../controllers/video");

// Configure multer for handling both video and thumbnail file uploads
const upload = multer();

router.route("/").post(protect, admin, upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnailFile', maxCount: 1 }
]), newVideo);
router.route("/").get(recommendedVideos);
router.route("/search").get(optionalAuth, searchVideo);
router.route("/:id").get(optionalAuth, getVideo);
router.route("/:id/file").get(getVideoFile); // New route for serving video files
router.route("/:id/thumbnail").get(getThumbnailFile); // New route for serving thumbnail files
router.route("/:id/like").get(protect, likeVideo);
router.route("/:id/dislike").get(protect, dislikeVideo);
router.route("/:id/comment").post(protect, addComment);
router.route("/:id/view").get(optionalAuth, newView);

module.exports = router;