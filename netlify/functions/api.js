import serverless from 'serverless-http';
// Use relative paths for all requires to ensure they work in the Netlify environment
import express from 'express';
import cors from 'cors';
import auth from '../../backend/src/routes/auth.js';
import admin from '../../backend/src/routes/admin.js';
import video from '../../backend/src/routes/video.js';
import user from '../../backend/src/routes/user.js';
import errorHandler from '../../backend/src/middlewares/errorHandler.js';

// Create express app
const app = express();

// Add logging middleware to debug requests
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.path}`);
  next();
});

// CORS configuration for Netlify
const corsOptions = {
  origin: true, // Automatically set to the request origin
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors(corsOptions));

// Simple test route to verify function is working
app.get("/test", (req, res) => {
  res.status(200).json({ message: "Test endpoint working" });
});

// API Routes - Note: Netlify redirects /api/* to this function, so we don't need the /api prefix here
app.use("/v1/auth", auth);
app.use("/v1/admin", admin);
app.use("/v1/videos", video);
app.use("/v1/users", user);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Add a catch-all route for debugging
app.use("*", (req, res) => {
  console.log(`Catch-all route hit: ${req.method} ${req.path}`);
  res.status(404).json({ message: "Endpoint not found in function" });
});

// Error handling middleware
app.use(errorHandler);

// Export the serverless function
export const handler = serverless(app);