require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const auth = require("./routes/auth");
const admin = require("./routes/admin");
const video = require("./routes/video");
const user = require("./routes/user");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// CORS configuration for development
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(express.json({ limit: "10mb" })); // Limit JSON payload size
app.use(cors(corsOptions));

// API Routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/admin", admin);
app.use("/api/v1/videos", video);
app.use("/api/v1/users", user);

// Serve static files from the React app build directory with caching
app.use(
  express.static(path.join(__dirname, "../../frontend/build"), {
    maxAge: "1d", // Cache static files for 1 day
    etag: true,
  })
);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// For any request that doesn't match the API routes, send back React's index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
});

// Error handling middleware
app.use(errorHandler);

// Only start the server if this file is run directly (for local development)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for use in Netlify functions
module.exports = app;