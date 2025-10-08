const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testUpload() {
  try {
    console.log('Testing video upload...');
    
    // First, login to get auth token
    console.log('Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin@movie.com',
      password: 'admin123'
    });
    
    console.log('Login response:', loginResponse.data);
    const token = loginResponse.data.data; // Token is in data field
    console.log('Token:', token);
    
    // Test URL upload endpoint with proper data
    console.log('Testing URL upload endpoint...');
    
    // For URL upload, we need to provide all required fields
    const urlUploadData = {
      title: 'Test Video',
      description: 'Test video description',
      category: 'movies',
      url: 'https://example.com/test-video.mp4',
      thumbnail: 'https://example.com/thumbnail.jpg'
    };
    
    const response = await axios.post('http://localhost:5000/api/v1/admin/videos', 
      urlUploadData, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('URL upload test response:', response.data);
    
    console.log('URL upload test completed successfully!');
    
  } catch (error) {
    console.error('Upload test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else {
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    }
  }
}

testUpload();