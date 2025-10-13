import { User, Video } from "./sequelize.js";
import bcrypt from "bcryptjs";

// Function to create a test user
async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({
      where: { email: "test@example.com" }
    });
    
    if (existingUser) {
      console.log("Test user already exists");
      return existingUser;
    }
    
    // Create a test user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("test123", salt);
    
    const user = await User.create({
      firstname: "Test",
      lastname: "User",
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
      isAdmin: false
    });
    
    console.log("Test user created successfully");
    return user;
  } catch (error) {
    console.error("Error creating test user:", error.message);
    return null;
  }
}

// Function to create a test video
async function createTestVideo(userId) {
  try {
    // Create a test video
    const video = await Video.create({
      title: "Test Video",
      description: "This is a test video for debugging purposes",
      url: "https://example.com/test-video.mp4",
      thumbnail: "https://example.com/test-thumbnail.jpg",
      featured: true,
      category: "movies",
      userId: userId
    });
    
    console.log("Test video created successfully");
    return video;
  } catch (error) {
    console.error("Error creating test video:", error.message);
    return null;
  }
}

// Main function to seed the database
async function seedDatabase() {
  try {
    console.log("Seeding database with test data...");
    
    // Create test user
    const user = await createTestUser();
    if (!user) {
      console.log("Failed to create test user");
      return;
    }
    
    // Create test video
    const video = await createTestVideo(user.id);
    if (!video) {
      console.log("Failed to create test video");
      return;
    }
    
    console.log("Database seeding completed successfully!");
    console.log("Test user credentials:");
    console.log("- Email: test@example.com");
    console.log("- Password: test123");
  } catch (error) {
    console.error("Error seeding database:", error.message);
  }
}

// Run the seeding function
seedDatabase();