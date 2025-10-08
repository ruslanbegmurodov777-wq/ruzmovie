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

// Configure multer for video file uploads
const videoStorage = multer.memoryStorage();
const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept video files only
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});

// Configure multer for thumbnail file uploads
const thumbnailStorage = multer.memoryStorage();
const thumbnailUpload = multer({
  storage: thumbnailStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for images
  },
  fileFilter: (req, file, cb) => {
    // Accept image files only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Handle both video and thumbnail file uploads
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