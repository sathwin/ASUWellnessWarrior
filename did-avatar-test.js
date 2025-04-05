const axios = require('axios');
require('dotenv').config();

// Get the D-ID API key from environment variables
const didApiKey = process.env.REACT_APP_DID_API_KEY;

if (!didApiKey) {
  console.error('Error: D-ID API key is missing. Please check your .env file.');
  process.exit(1);
}

// Test creating a talking avatar with shorter text and error handling
async function testAvatar() {
  console.log('\n🎬 Testing D-ID Avatar Creation');
  console.log('--------------------------------');
  console.log('This test will:');
  console.log('1. Create a talking avatar video (might take 10-20 seconds)');
  console.log('2. Check the status of the video generation');
  console.log('3. Display the video URL when it\'s ready\n');
  
  try {
    console.log('Creating talking avatar...');
    
    // Step 1: Create the talking avatar
    const createResponse = await axios.post(
      'https://api.d-id.com/talks',
      {
        script: {
          type: 'text',
          input: 'Welcome to ASU Wellness Warrior! I am your virtual advisor.',
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
    
    const talkId = createResponse.data.id;
    console.log(`✅ Talk created successfully! ID: ${talkId}`);
    
    // Step 2: Poll for the result
    console.log('\nChecking status (this may take a few seconds)...');
    
    let attempts = 0;
    const maxAttempts = 30;
    let videoUrl = null;
    
    while (attempts < maxAttempts) {
      attempts++;
      
      console.log(`Polling attempt ${attempts}...`);
      
      const statusResponse = await axios.get(`https://api.d-id.com/talks/${talkId}`, {
        headers: {
          'Authorization': `Basic ${didApiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      const status = statusResponse.data.status;
      console.log(`Status: ${status}`);
      
      if (status === 'done') {
        videoUrl = statusResponse.data.result_url;
        console.log(`\n✅ Video generation complete!`);
        break;
      } else if (status === 'error') {
        console.error(`\n❌ Error generating video: ${statusResponse.data.error}`);
        break;
      }
      
      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    if (videoUrl) {
      console.log('\n🎉 SUCCESS! Your D-ID API is working correctly.');
      console.log('\nVideo URL:');
      console.log(videoUrl);
      console.log('\nYou can open this URL in your browser to view the generated video.');
      console.log('\nTo use this in your Express Advising feature:');
      console.log('1. Make sure you\'re using Basic authentication in ExpressAdvising.tsx');
      console.log('2. Start your React app and navigate to the Express Advising tab');
      console.log('3. Start a video consultation to test the complete feature');
    } else if (attempts >= maxAttempts) {
      console.error('\n⚠️ Video generation timed out. This might be due to high server load.');
      console.error('Try again later or check your D-ID account dashboard for status.');
    }
    
  } catch (error) {
    console.error('\n❌ Error testing avatar creation:');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Error data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.error('\n💡 Authentication error: Your API key appears to be invalid.');
        console.error('Please check that you\'re using the correct API key format (Basic auth).');
      } else if (error.response.status === 402) {
        console.error('\n💡 Payment required: You may have run out of credits.');
        console.error('Check your credit balance in the D-ID dashboard.');
      } else if (error.response.status === 403) {
        console.error('\n💡 Permission error: Your API key doesn\'t have the required permissions.');
      } else if (error.response.status === 500) {
        console.error('\n💡 Server error: D-ID is experiencing internal issues.');
        console.error('This is not related to your key. Try again later.');
      }
    } else if (error.request) {
      console.error('No response received from the API server.');
      console.error('Please check your internet connection.');
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testAvatar(); 