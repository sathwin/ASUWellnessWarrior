const axios = require('axios');
require('dotenv').config();

// Get the D-ID API key from environment variables
const didApiKey = process.env.REACT_APP_DID_API_KEY;

if (!didApiKey) {
  console.error('Error: D-ID API key is missing. Please check your .env file.');
  process.exit(1);
}

// Simplified test with minimal parameters
async function simplifiedTest() {
  console.log('\n🎬 Simplified D-ID Avatar Test');
  console.log('-----------------------------');
  console.log('Using a minimal request to avoid potential server issues.\n');
  
  try {
    // Check API credits first
    console.log('Checking D-ID credits...');
    
    const creditsResponse = await axios.get('https://api.d-id.com/credits', {
      headers: {
        'Authorization': `Basic ${didApiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ Credits check successful!');
    console.log(`Available credits: ${creditsResponse.data.remaining}/${creditsResponse.data.total}`);
    
    if (creditsResponse.data.remaining <= 0) {
      console.error('❌ You have no credits remaining. Please add credits to your D-ID account.');
      return;
    }
    
    // Create a talking avatar with minimal parameters
    console.log('\nCreating a minimal talking avatar...');
    
    const createResponse = await axios.post(
      'https://api.d-id.com/talks',
      {
        script: {
          type: 'text',
          input: 'Hello',
        },
        source_url: 'https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg',
      },
      {
        headers: {
          'Authorization': `Basic ${didApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const talkId = createResponse.data.id;
    console.log(`✅ Talk created with ID: ${talkId}`);
    
    // Check status a few times with longer intervals
    console.log('\nChecking status (this may take up to a minute)...');
    
    let attempts = 0;
    const maxAttempts = 10;
    let videoUrl = null;
    
    while (attempts < maxAttempts) {
      attempts++;
      
      // Wait 5 seconds between checks to reduce load
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      console.log(`Status check ${attempts}/${maxAttempts}...`);
      
      try {
        const statusResponse = await axios.get(`https://api.d-id.com/talks/${talkId}`, {
          headers: {
            'Authorization': `Basic ${didApiKey}`,
            'Content-Type': 'application/json',
          },
        });
        
        const status = statusResponse.data.status;
        console.log(`Current status: ${status}`);
        
        if (status === 'done') {
          videoUrl = statusResponse.data.result_url;
          console.log(`\n✅ Video generation complete!`);
          break;
        } else if (status === 'error') {
          console.error(`\n❌ Error in video generation: ${statusResponse.data.error || 'Unknown error'}`);
          break;
        }
      } catch (statusError) {
        console.log(`Status check failed: ${statusError.message}`);
        console.log('Continuing to next attempt...');
      }
    }
    
    if (videoUrl) {
      console.log('\n🎉 SUCCESS! Your D-ID API can create talking avatars.');
      console.log('\nVideo URL:');
      console.log(videoUrl);
      console.log('\nYou can open this URL in your browser to view the generated video.');
    } else {
      console.log('\n⚠️ The test did not complete successfully.');
      console.log('The D-ID API is authenticating correctly, but there might be issues with video generation.');
      console.log('This could be due to server load or temporary issues on D-ID\'s side.');
      console.log('\nSuggestions:');
      console.log('1. Try again later');
      console.log('2. Check the D-ID status page for any known issues');
      console.log('3. Try with different parameters in your app');
    }
    
  } catch (error) {
    console.error('\n❌ Error during simplified test:');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 500) {
        console.log('\n⚠️ The D-ID service is experiencing internal issues.');
        console.log('This is not related to your API key or code.');
        console.log('The authentication is working correctly, but the service is currently unstable.');
        console.log('Please try again later.');
      }
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
simplifiedTest(); 