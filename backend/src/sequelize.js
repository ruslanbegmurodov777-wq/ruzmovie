const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config();
} else {
  require('dotenv').config({ path: '.env.local' });
}

// Check if we're using Railway deployment or local development
const isRailwayDeployment = process.env.DB_HOST && process.env.DB_HOST.includes('railway.app');

// Use environment variables with fallbacks
const sequelize = new Sequelize(
  process.env.DB_NAME || "movie",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "ruslanbek777",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
    // Add connection timeout settings
    dialectOptions: {
      connectTimeout: 60000 // 60 seconds
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  }
);

// Connection check
(async () => {
  try {
    console.log(`Attempting to connect to database...`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Host: ${process.env.DB_HOST || "127.0.0.1"}`);
    console.log(`Database: ${process.env.DB_NAME || "movie"}`);
    console.log(`User: ${process.env.DB_USER || "root"}`);
    console.log(`Port: ${process.env.DB_PORT || 3306}`);
    
    await sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");
    // Use force: false to avoid schema conflicts
    await sequelize.sync({ force: false });
    console.log("✅ All models were synchronized successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
    console.error("Error code:", error.original?.code);
    console.error("Error errno:", error.original?.errno);
    
    // Provide specific guidance based on error type
    if (error.original?.code === 'ETIMEDOUT') {
      console.error("\n🔧 Troubleshooting steps:");
      console.error("1. Check if your database server is running");
      console.error("2. Verify network connectivity to the database host");
      console.error("3. Check firewall settings");
      console.error("4. Verify database credentials in environment file");
      
      if (isRailwayDeployment) {
        console.error("\n📝 For Railway deployment:");
        console.error("  - Ensure your Railway database is online");
        console.error("  - Check if there are any network restrictions");
        console.error("  - Verify the credentials in your .env file");
        console.error("\n📝 For local development, set NODE_ENV=development to use local database");
      } else {
        console.error("\n📝 For local development:");
        console.error("  - Ensure MySQL is running on your local machine");
        console.error("  - Verify the credentials in your .env.local file");
      }
    }
  }
})();

// Model imports
const User = require("./models/User")(sequelize, DataTypes);
const Video = require("./models/Video")(sequelize, DataTypes);
const VideoLike = require("./models/VideoLike")(sequelize, DataTypes);
const Comment = require("./models/Comment")(sequelize, DataTypes);
const Subscription = require("./models/Subscription")(sequelize, DataTypes);
const View = require("./models/View")(sequelize, DataTypes);

// Associations
Video.belongsTo(User, { foreignKey: "userId" });
User.belongsToMany(Video, { through: VideoLike, foreignKey: "userId" });
Video.belongsToMany(User, { through: VideoLike, foreignKey: "videoId" });
User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });
Video.hasMany(Comment, { foreignKey: "videoId" });
User.hasMany(Subscription, { foreignKey: "subscribeTo" });
User.belongsToMany(Video, { through: View, foreignKey: "userId" });
Video.belongsToMany(User, { through: View, foreignKey: "videoId" });

// Create admin user after models are defined
(async () => {
  try {
    const adminExists = await User.findOne({ where: { email: 'admin@movie.com' } });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        firstname: 'Admin',
        lastname: 'User',
        username: 'admin',
        email: 'admin@movie.com',
        password: hashedPassword,
        isAdmin: true
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('Admin login: admin@movie.com / admin123');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
})();

module.exports = {
  sequelize,
  User,
  Video,
  VideoLike,
  Comment,
  Subscription,
  View,
};