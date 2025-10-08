const { Video } = require('./src/sequelize');

const updateVideosFeatured = async () => {
  try {
    console.log('🔄 Updating videos to add featured field...');
    
    // Update all existing videos to have featured = true by default
    const [updatedCount] = await Video.update(
      { featured: true },
      { where: { featured: null } }
    );
    
    console.log(`✅ Updated ${updatedCount} videos to be featured by default`);
    
    // Get all videos to show current state
    const videos = await Video.findAll({
      attributes: ['id', 'title', 'featured']
    });
    
    console.log('📹 Current videos status:');
    videos.forEach((video, index) => {
      console.log(`  ${index + 1}. ${video.title} - Featured: ${video.featured ? '⭐ Yes' : '📝 No'}`);
    });
    
    console.log('🎉 Videos update completed!');
    
  } catch (error) {
    console.error('❌ Error updating videos:', error);
  }
};

// Run the update
updateVideosFeatured().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('❌ Update failed:', error);
  process.exit(1);
});