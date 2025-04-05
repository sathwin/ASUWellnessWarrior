const axios = require('axios');
require('dotenv').config();

// Get the D-ID API key from environment variables
const didApiKey = process.env.REACT_APP_DID_API_KEY;

if (!didApiKey) {
  console.error('Error: D-ID API key is missing. Please check your .env file.');
  process.exit(1);
}

// Test alternative approach using presenters
async function testPresentersTalk() {
  console.log('\n🎭 Testing D-ID Presenters API');
  console.log('-----------------------------');
  console.log('This test will:');
  console.log('1. Get available presenters from D-ID');
  console.log('2. Try to create a talk using a presenter');
  console.log('3. Display results\n');
  
  try {
    // 1. Get available presenters
    console.log('Retrieving available presenters...');
    const presenterResponse = await axios.get('https://api.d-id.com/presenters', {
      headers: {
        'Authorization': `Basic ${didApiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (presenterResponse.data && presenterResponse.data.presenters && presenterResponse.data.presenters.length > 0) {
      console.log(`✅ Found ${presenterResponse.data.presenters.length} available presenters!`);
      
      // Get the first presenter
      const presenter = presenterResponse.data.presenters[0];
      console.log(`Using presenter: ${presenter.name} (ID: ${presenter.presenter_id})`);
      
      // 2. Create a talk using the presenter
      console.log('\nCreating a talk using presenter...');
      
      const createResponse = await axios.post(
        'https://api.d-id.com/talks',
        {
          script: {
            type: 'text',
            input: 'Hello from ASU Wellness Warrior!',
            provider: {
              type: 'microsoft',
              voice_id: 'en-US-GuyNeural',
            },
          },
          presenter_id: presenter.presenter_id,
          driver_id: 'uM1n5qJzY4'  // Default driver
        },
        {
          headers: {
            'Authorization': `Basic ${didApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (createResponse.data && createResponse.data.id) {
        const talkId = createResponse.data.id;
        console.log(`✅ Talk created successfully! ID: ${talkId}`);
        
        // 3. Poll for the result
        console.log('\nChecking status (this may take some time)...');
        
        let attempts = 0;
        const maxAttempts = 15;
        let completed = false;
        
        while (attempts < maxAttempts && !completed) {
          attempts++;
          
          await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds between checks
          
          console.log(`Polling attempt ${attempts}/${maxAttempts}...`);
          
          const statusResponse = await axios.get(`https://api.d-id.com/talks/${talkId}`, {
            headers: {
              'Authorization': `Basic ${didApiKey}`,
              'Content-Type': 'application/json',
            },
          });
          
          const status = statusResponse.data.status;
          console.log(`Status: ${status}`);
          
          if (status === 'done') {
            console.log(`\n✅ Video generation complete!`);
            console.log(`Result URL: ${statusResponse.data.result_url}`);
            console.log(`\nThis URL is valid for a limited time and can be used to view the generated video.`);
            console.log(`Your Express Advising feature should work properly now!`);
            completed = true;
            break;
          } else if (status === 'error') {
            console.error(`\n❌ Error generating video: ${statusResponse.data.error || 'Unknown error'}`);
            break;
          }
        }
        
        if (!completed) {
          console.log('\n⚠️ Video generation not completed within the timeout period.');
          console.log('It may still be processing on the D-ID servers.');
          console.log('You can check the status manually by visiting the D-ID dashboard.');
        }
      } else {
        console.error('\n❌ Failed to create talk with presenter.');
        console.error('Response:', JSON.stringify(createResponse.data, null, 2));
      }
    } else {
      console.error('\n❌ No presenters found or response format unexpected.');
      console.error('Response:', JSON.stringify(presenterResponse.data, null, 2));
    }
  } catch (error) {
    console.error('\n❌ Error testing presenter talks:');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 404) {
        console.error('\n💡 The presenters endpoint may not be available on your plan.');
        console.error('Try using the standard talks endpoint instead.');
      } else if (error.response.status === 500) {
        console.error('\n💡 D-ID is experiencing server issues right now.');
        console.error('This is not related to your API key or implementation.');
        console.error('Please try again later.');
      }
    } else {
      console.error('Error message:', error.message);
    }
  }
}

// Run the test
testPresentersTalk(); 