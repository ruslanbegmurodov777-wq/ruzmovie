const { User, Video } = require('./sequelize');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user if not exists
    const adminEmail = 'admin@movie.com';
    let adminUser = await User.findOne({ where: { email: adminEmail } });
    
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      adminUser = await User.create({
        firstname: 'Admin',
        lastname: 'User',
        username: 'admin',
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
        channelDescription: 'Administrator of the movie platform'
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Create sample regular user if not exists
    const userEmail = 'user@movie.com';
    let regularUser = await User.findOne({ where: { email: userEmail } });
    
    if (!regularUser) {
      const hashedPassword = await bcrypt.hash('user123', 12);
      regularUser = await User.create({
        firstname: 'John',
        lastname: 'Doe',
        username: 'johndoe',
        email: userEmail,
        password: hashedPassword,
        isAdmin: false,
        channelDescription: 'Movie enthusiast and regular user'
      });
      console.log('✅ Regular user created');
    } else {
      console.log('✅ Regular user already exists');
    }

    // Check if videos exist
    const existingVideos = await Video.count();
    
    if (existingVideos === 0) {
      // Create sample videos
      const sampleVideos = [
        {
          title: 'Sample YouTube Video - Big Buck Bunny',
          description: 'A beautiful animated short film from Blender Studio. This is a sample video for testing the movie platform.',
          url: 'https://www.youtube.com/watch?v=YE7VzlLtp-4',
          thumbnail: 'https://img.youtube.com/vi/YE7VzlLtp-4/maxresdefault.jpg',
          userId: adminUser.id
        },
        {
          title: 'Sample Educational Video - How Movies Work',
          description: 'Learn about the fascinating world of filmmaking and how movies are created from start to finish.',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          userId: adminUser.id
        },
        {
          title: 'Documentary Sample - Nature & Wildlife',
          description: 'Explore the beauty of nature and wildlife in this stunning documentary footage.',
          url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
          thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
          userId: adminUser.id
        },
        {
          title: 'Action Movie Trailer - Sample',
          description: 'An exciting action-packed movie trailer showcasing spectacular stunts and effects.',
          url: 'https://www.youtube.com/watch?v=6ZfuNTqbHE8',
          thumbnail: 'https://img.youtube.com/vi/6ZfuNTqbHE8/maxresdefault.jpg',
          userId: adminUser.id
        },
        {
          title: 'Comedy Short Film',
          description: 'A hilarious comedy short that will make you laugh out loud. Perfect for entertainment.',
          url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
          thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
          userId: adminUser.id
        }
      ];

      for (const videoData of sampleVideos) {
        await Video.create(videoData);
      }
      
      console.log(`✅ ${sampleVideos.length} sample videos created`);
    } else {
      console.log(`✅ ${existingVideos} videos already exist in database`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('📧 Admin login: admin@movie.com / admin123');
    console.log('📧 User login: user@movie.com / user123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

module.exports = seedDatabase;

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
}