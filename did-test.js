const axios = require('axios');
require('dotenv').config();

// Get the D-ID API key from environment variables
const didApiKey = process.env.REACT_APP_DID_API_KEY;

if (!didApiKey) {
  console.error('Error: D-ID API key is missing. Please check your .env file.');
  process.exit(1);
}

// Test the D-ID API by making a simple request
async function testDIDApi() {
  console.log('Testing D-ID API connection...');
  console.log(`Using API key: ${didApiKey.substring(0, 5)}...${didApiKey.substring(didApiKey.length - 5)}`);
  
  try {
    // Make a simple request to the D-ID API (get credits)
    const response = await axios.get('https://api.d-id.com/credits', {
      headers: {
        'Authorization': `Basic ${didApiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('\n✅ D-ID API connection successful!');
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('\n❌ D-ID API connection failed:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Status: ${error.response.status}`);
      console.error('Error data:', JSON.stringify(error.response.data, null, 2));
      
      // Provide specific advice based on error codes
      if (error.response.status === 401) {
        console.error('\n💡 Authentication error: Your API key appears to be invalid or expired.');
        console.error('Please check that you\'re using the correct API key format.');
        console.error('For Basic authentication, your key should be in the format username:password');
        console.error('Try visiting the D-ID dashboard to generate a new API key.');
      } else if (error.response.status === 403) {
        console.error('\n💡 Permission error: Your API key doesn\'t have the required permissions.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from the API server.');
      console.error('Please check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up the request:', error.message);
    }
    
    return false;
  }
}

// Create a function to test creating a talking avatar
async function testCreateTalkingAvatar() {
  console.log('\nTesting creation of a talking avatar...');
  
  try {
    // Make a request to create a talking avatar
    const response = await axios.post(
      'https://api.d-id.com/talks',
      {
        script: {
          type: 'text',
          input: 'Hello! This is a test of the D-ID API for the ASU Wellness Warrior project.',
          provider: {
            type: 'microsoft',
            voice_id: 'en-US-JennyNeural',
          },
        },
        source_url: 'https://didgeneration.com/static/did_showcase/image_f2/f4.jpeg',
      },
      {
        headers: {
          'Authorization': `Basic ${didApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('\n✅ Successfully created a talking avatar!');
    console.log('Talk ID:', response.data.id);
    console.log('\nTo check the status and get the video URL, run:');
    console.log(`node -e "require('dotenv').config(); const axios = require('axios'); axios.get('https://api.d-id.com/talks/${response.data.id}', { headers: { 'Authorization': 'Basic ${didApiKey}' } }).then(res => console.log(res.data)).catch(err => console.error(err))"`);
    
    return response.data.id;
  } catch (error) {
    console.error('\n❌ Failed to create a talking avatar:');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Error data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 402) {
        console.error('\n💡 Payment required: You may have exceeded your free usage limit.');
      }
    } else {
      console.error('Error:', error.message);
    }
    
    return null;
  }
}

// Run the tests
async function runTests() {
  const apiWorks = await testDIDApi();
  
  if (apiWorks) {
    await testCreateTalkingAvatar();
  }
}

runTests(); 