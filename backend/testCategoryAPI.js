const axios = require('axios');

const testCategoryAPI = async () => {
  try {
    console.log('🔍 Testing Category API...\n');

    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin@movie.com',
      password: 'admin123'
    });

    const token = loginResponse.data.data;
    console.log('✅ Admin login successful');

    // Set the authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Test getting videos to check category field
    console.log('\n📹 Testing /api/v1/videos for category field...');
    const videosResponse = await axios.get('http://localhost:5000/api/v1/videos');
    console.log('✅ Videos endpoint working');
    console.log('📊 Videos found:', videosResponse.data.data.length);
    
    if (videosResponse.data.data.length > 0) {
      const firstVideo = videosResponse.data.data[0];
      console.log('📋 First video category:', firstVideo.category || 'MISSING');
      console.log('📋 First video fields:', Object.keys(firstVideo));
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testCategoryAPI();