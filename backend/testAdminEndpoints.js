const axios = require('axios');

const testAdminEndpoints = async () => {
  try {
    console.log('🔍 Testing Admin API Endpoints...\n');

    // First, let's try to authenticate as admin
    const loginResponse = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin@movie.com',
      password: 'admin123'
    });

    const token = loginResponse.data.data;
    console.log('✅ Admin login successful');
    console.log('🔑 Token obtained:', token.substring(0, 20) + '...');

    // Set the authorization header for subsequent requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Test getting videos
    console.log('\n📹 Testing /api/v1/admin/videos...');
    const videosResponse = await axios.get('http://localhost:5000/api/v1/admin/videos');
    console.log('✅ Videos endpoint working');
    console.log('📊 Videos found:', videosResponse.data.data.length);
    console.log('📋 First video:', videosResponse.data.data[0]);

    // Test getting users
    console.log('\n👥 Testing /api/v1/admin/users...');
    const usersResponse = await axios.get('http://localhost:5000/api/v1/admin/users');
    console.log('✅ Users endpoint working');
    console.log('📊 Users found:', usersResponse.data.data.length);
    console.log('👤 First user:', usersResponse.data.data[0]);

    console.log('\n🎉 All admin endpoints working correctly!');

  } catch (error) {
    console.error('❌ Error testing admin endpoints:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
};

// Run the test
testAdminEndpoints();