// Load environment variables
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Env load
dotenv.config();

// Agar kerak bo‘lsa __dirname o‘rnini to‘ldiramiz
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import auth from "./routes/auth.js";
import admin from "./routes/admin.js";
import video from "./routes/video.js";
import user from "./routes/user.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// ✅ CORS sozlamasi — Netlify frontend manzilini ruxsat beramiz
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "https://ruzmovieuz.netlify.app"
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));

// ✅ API Routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/admin", admin);
app.use("/api/v1/videos", video);
app.use("/api/v1/users", user);

// ✅ Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// ❌ Frontend fayllarni Render orqali yuborish qismi olib tashlandi
// Chunki frontend Netlify’da ishlayapti

// ✅ 404 yoki noto‘g‘ri route uchun xabar
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// ✅ Xatoliklarni ushlash middleware
app.use(errorHandler);

// ✅ Serverni ishga tushurish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

export default app;