import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import mysql from "mysql2";

import auth from "./routes/auth.js";
import admin from "./routes/admin.js";
import video from "./routes/video.js";
import user from "./routes/user.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

// ✅ CORS — Netlify frontend manzili
const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://ruzmovie2.netlify.app",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));

// ✅ MySQL ulanadi
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ MySQL connected successfully to Railway!");
  }
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
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

export default app;
