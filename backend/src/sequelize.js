const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

const sequelize = new Sequelize("movie", "root", "ruslanbek777", {
  host: "127.0.0.1",
  port: 3306,
  dialect: "mysql",
  logging: false,
});

// Ulanishni tekshirish
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");
    // Use force: false to avoid schema conflicts
    await sequelize.sync({ force: false });
    console.log("✅ All models were synchronized successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
})();

// Model importlari
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