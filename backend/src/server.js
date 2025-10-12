// Load environment variables
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

// ✅ CORS sozlamasi — Netlify frontend manzilini ruxsat beramiz
const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://ruzmovieuz.netlify.app",
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
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}

module.exports = app;
