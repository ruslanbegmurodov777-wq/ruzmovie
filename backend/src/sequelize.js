import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
if (process.env.NODE_ENV === "production") {
  dotenv.config();
} else {
  dotenv.config({ path: ".env.local" });
}

// Detect Aiven MySQL (ssl required)
const isAiven = process.env.DB_HOST?.includes("aivencloud.com");

const sequelize = new Sequelize(
  process.env.DB_NAME || "movie",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "ruslanbek777",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,

    dialectOptions: isAiven
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
          connectTimeout: 60000,
        }
      : {
          connectTimeout: 60000,
        },

    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  }
);

// Test connection
(async () => {
  try {
    console.log("🚀 Attempting to connect to database...");
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`SSL Required: ${isAiven ? "✅ Yes" : "❌ No"}`);

    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    await sequelize.sync({ force: false });
    console.log("✅ All models synchronized successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to database:", error.message);
    console.error("Error code:", error.original?.code);
  }
})();

// Models
import UserModel from "./models/User.js";
import VideoModel from "./models/Video.js";
import VideoLikeModel from "./models/VideoLike.js";
import CommentModel from "./models/Comment.js";
import SubscriptionModel from "./models/Subscription.js";
import ViewModel from "./models/View.js";

const User = UserModel(sequelize, DataTypes);
const Video = VideoModel(sequelize, DataTypes);
const VideoLike = VideoLikeModel(sequelize, DataTypes);
const Comment = CommentModel(sequelize, DataTypes);
const Subscription = SubscriptionModel(sequelize, DataTypes);
const View = ViewModel(sequelize, DataTypes);

// Relationships
Video.belongsTo(User, { foreignKey: "userId" });
User.belongsToMany(Video, { through: VideoLike, foreignKey: "userId" });
Video.belongsToMany(User, { through: VideoLike, foreignKey: "videoId" });
User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });
Video.hasMany(Comment, { foreignKey: "videoId" });
User.hasMany(Subscription, { foreignKey: "subscribeTo" });
User.belongsToMany(Video, { through: View, foreignKey: "userId" });
Video.belongsToMany(User, { through: View, foreignKey: "videoId" });

// Create admin
(async () => {
  try {
    const adminExists = await User.findOne({
      where: { email: "admin@movie.com" },
    });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);

      await User.create({
        firstname: "Admin",
        lastname: "User",
        username: "admin",
        email: "admin@movie.com",
        password: hashedPassword,
        isAdmin: true,
      });

      console.log("✅ Admin user created (admin@movie.com / admin123)");
    }
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  }
})();

export { sequelize, User, Video, VideoLike, Comment, Subscription, View };
export default sequelize;
