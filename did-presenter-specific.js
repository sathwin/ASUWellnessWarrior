const axios = require('axios');
require('dotenv').config();

// Get the D-ID API key from environment variables
const didApiKey = process.env.REACT_APP_DID_API_KEY;

if (!didApiKey) {
  console.error('Error: D-ID API key is missing. Please check your .env file.');
  process.exit(1);
}

async function testWithSpecificPresenter() {
  console.log('\n🔧 D-ID API Test With Specific Presenter');
  console.log('--------------------------------------');
  console.log('Testing D-ID API using a known working presenter ID\n');
  
  // Using the specific presenter ID provided
  const presenterId = 'rian-pbMoTzs7an';
  console.log(`Using presenter ID: ${presenterId}`);
  
  try {
    // Create a talk using the specific presenter
    console.log('\nCreating a talk using the specified presenter...');
    
    const createResponse = await axios.post(
      'https://api.d-id.com/talks',
      {
        script: {
          type: 'text',
          input: 'Hello from ASU Wellness Warrior! This is a test of the D-ID API.',
          provider: {
            type: 'microsoft',
            voice_id: 'en-US-GuyNeural', // Male voice
          },
        },
        presenter_id: presenterId
      },
      {
        headers: {
          'Authorization': `Basic ${didApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!createResponse.data || !createResponse.data.id) {
      console.error('❌ Failed to create talk. Unexpected response format.');
      console.error('Response:', JSON.stringify(createResponse.data, null, 2));
      return;
    }
    
    const talkId = createResponse.data.id;
    console.log(`✅ Talk creation successful! Talk ID: ${talkId}`);
    
    // Poll for status updates
    console.log('\nPolling for status updates (this may take some time)...');
    
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
          'Authorization': `Basic ${didApiKey}`,
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
        
        // Provide instructions for updating the component
        console.log('\nTo update your ExpressAdvising component:');
        console.log('1. Use the specific presenter_id instead of source_url');
        console.log('2. Keep using Basic authentication format');
        console.log('3. Update your component with the following structure:');
        console.log(`
// Example code for your component:
const generateDIDResponse = async (text) => {
  if (!didApiKey) {
    console.error("D-ID API key is missing");
    return;
  }

  try {
    // Use D-ID API to generate a talking avatar video
    const response = await axios.post(
      'https://api.d-id.com/talks',
      {
        script: {
          type: 'text',
          input: text,
          provider: {
            type: 'microsoft',
            voice_id: 'en-US-JennyNeural',
          },
        },
        presenter_id: '${presenterId}' // Use this specific presenter ID
      },
      {
        headers: {
          'Authorization': \`Basic \${didApiKey}\`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Poll for the result
    const talkId = response.data.id;
    await pollDIDResult(talkId);
  } catch (error) {
    console.error('Error generating D-ID response:', error);
  }
};`);
        
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
}

// Run the test
testWithSpecificPresenter(); 