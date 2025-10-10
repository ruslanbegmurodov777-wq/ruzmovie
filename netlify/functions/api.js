const serverless = require('serverless-http');
// Use relative paths for all requires to ensure they work in the Netlify environment
const express = require('express');
const cors = require('cors');
const auth = require('../../backend/src/routes/auth');
const admin = require('../../backend/src/routes/admin');
const video = require('../../backend/src/routes/video');
const user = require('../../backend/src/routes/user');
const errorHandler = require('../../backend/src/middlewares/errorHandler');

// Create express app
const app = express();

// CORS configuration for Netlify
const corsOptions = {
  origin: true, // Automatically set to the request origin
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors(corsOptions));

// API Routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/admin", admin);
app.use("/api/v1/videos", video);
app.use("/api/v1/users", user);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use(errorHandler);

// Export the serverless function
module.exports.handler = serverless(app);