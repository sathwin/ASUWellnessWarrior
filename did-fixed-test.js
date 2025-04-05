const axios = require('axios');
require('dotenv').config();

// Get the D-ID API key from environment variables
const didApiKey = process.env.REACT_APP_DID_API_KEY;

if (!didApiKey) {
  console.error('Error: D-ID API key is missing. Please check your .env file.');
  process.exit(1);
}

async function testFixedApproach() {
  console.log('\n🔧 Fixed D-ID API Test Based on Support Feedback');
  console.log('----------------------------------------------');
  console.log('Testing D-ID API using the correct approach with valid presenters\n');
  
  try {
    // Step 1: Get available presenters
    console.log('Step 1: Retrieving available presenters...');
    
    const presenterResponse = await axios.get('https://api.d-id.com/presenters', {
      headers: {
        'Authorization': `Bearer ${didApiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!presenterResponse.data.presenters || presenterResponse.data.presenters.length === 0) {
      console.error('❌ No presenters found. Cannot proceed.');
      return;
    }
    
    console.log(`✅ Found ${presenterResponse.data.presenters.length} available presenters!`);
    
    // Display available presenters
    console.log('\nAvailable Presenters:');
    presenterResponse.data.presenters.forEach((presenter, index) => {
      console.log(`${index + 1}. ${presenter.name} (ID: ${presenter.presenter_id})`);
    });
    
    // Step 2: Use the first available presenter to create a talk
    const presenter = presenterResponse.data.presenters[0];
    console.log(`\nStep 2: Creating a talk using presenter: ${presenter.name} (ID: ${presenter.presenter_id})...`);
    
    try {
      const createResponse = await axios.post(
        'https://api.d-id.com/talks',
        {
          script: {
            type: 'text',
            input: 'Hello from ASU Wellness Warrior! This is a test of the D-ID API.',
            provider: {
              type: 'microsoft',
              voice_id: 'en-US-JennyNeural', // Female voice
            },
          },
          presenter_id: presenter.presenter_id,
          driver_id: 'uM1n5qJzY4' // Default driver
        },
        {
          headers: {
            'Authorization': `Bearer ${didApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!createResponse.data || !createResponse.data.id) {
        console.error('❌ Failed to create talk. Unexpected response format.');
        return;
      }
      
      const talkId = createResponse.data.id;
      console.log(`✅ Talk creation successful! Talk ID: ${talkId}`);
      
      // Step 3: Poll for status updates
      console.log('\nStep 3: Polling for status updates (this may take some time)...');
      
      let attempts = 0;
      const maxAttempts = 20; // Increased for longer processing time
      let completed = false;
      
      while (attempts < maxAttempts && !completed) {
        attempts++;
        
        // Wait 3 seconds between checks
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log(`Polling attempt ${attempts}/${maxAttempts}...`);
        
        const statusResponse = await axios.get(`https://api.d-id.com/talks/${talkId}`, {
          headers: {
            'Authorization': `Bearer ${didApiKey}`,
            'Content-Type': 'application/json',
          },
        });
        
        const status = statusResponse.data.status;
        console.log(`Status: ${status}`);
        
        if (status === 'done') {
          console.log('\n🎉 Success! Video avatar generated successfully.');
          console.log('\nResult URL:');
          console.log(statusResponse.data.result_url);
          console.log('\nYou can open this URL in a browser to view the generated video.');
          
          // Step 4: Update the component with the working approach
          console.log('\nStep 4: Update your ExpressAdvising component');
          console.log('Replace the current implementation with the approach used in this test.');
          console.log('Specifically:');
          console.log('1. Use the presenters endpoint to get valid presenter IDs');
          console.log('2. Use a valid presenter_id instead of source_url');
          console.log('3. Use Bearer token in the Authorization header');
          completed = true;
          break;
        } else if (status === 'error') {
          console.error(`\n❌ Error in video generation: ${statusResponse.data.error || 'Unknown error'}`);
          break;
        }
      }
      
      if (!completed) {
        console.log('\n⚠️ Status polling timed out. The operation may still be processing.');
        console.log('Check the D-ID dashboard for the status of your talk.');
      }
      
    } catch (error) {
      console.error('\n❌ Talk creation failed:');
      
      if (error.response) {
        console.error(`Status code: ${error.response.status}`);
        console.error('Error data:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('Error message:', error.message);
      }
    }
  } catch (error) {
    console.error('\n❌ Failed to get presenters:');
    
    if (error.response) {
      console.error(`Status code: ${error.response.status}`);
      console.error('Error data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error message:', error.message);
    }
  }
}

// Run the test
testFixedApproach(); 