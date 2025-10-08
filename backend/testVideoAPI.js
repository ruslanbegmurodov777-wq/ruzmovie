const axios = require('axios');

const testVideoAPI = async () => {
  try {
    console.log('🔍 Testing Video API without auth...\n');

    // Test getting videos endpoint directly without authentication (if it's a public endpoint)
    console.log('📹 Testing /api/v1/videos...');
    const response = await axios.get('http://localhost:5000/api/v1/videos');
    
    console.log('Status:', response.status);
    console.log('Response:', response.data);

  } catch (error) {
    console.error('❌ Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
};

testVideoAPI();