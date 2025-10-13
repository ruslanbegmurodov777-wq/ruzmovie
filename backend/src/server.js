import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import auth from "./routes/auth.js";
import admin from "./routes/admin.js";
import video from "./routes/video.js";
import user from "./routes/user.js";
import errorHandler from "./middlewares/errorHandler.js";

// Import sequelize and models
import { sequelize, User, Video, VideoLike, Comment, Subscription, View } from "./sequelize.js";

const app = express();

// ✅ CORS — Netlify frontend manzili
const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://ruzmovieuz.netlify.app",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ message: "🎬 RuzMovie backend is running successfully!" });
});

// ✅ API routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/admin", admin);
app.use("/api/v1/videos", video);
app.use("/api/v1/users", user);

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// ✅ Error handler
app.use(errorHandler);

// ✅ Serverni ishga tushurish
const PORT = process.env.PORT || 5000;

// Only start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, async () => {
    console.log(`✅ Server running on port ${PORT}`);
    
    try {
      // Test database connection
      await sequelize.authenticate();
      console.log("✅ Database connection established successfully.");
      
      // Sync models
      await sequelize.sync({ force: false });
      console.log("✅ All models synchronized successfully.");
      
      console.log(`🚀 Server is ready at http://localhost:${PORT}`);
    } catch (error) {
      console.error("❌ Database connection failed:", error.message);
      process.exit(1);
    }
  });
}

export default app;