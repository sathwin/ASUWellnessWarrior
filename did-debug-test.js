const axios = require('axios');
require('dotenv').config();

// Get the D-ID API key from environment variables
const didApiKey = process.env.REACT_APP_DID_API_KEY;

if (!didApiKey) {
  console.error('Error: D-ID API key is missing. Please check your .env file.');
  process.exit(1);
}

// Test with debug mode on
async function testWithDebug() {
  console.log('\n🔧 D-ID API Debug Test');
  console.log('--------------------');
  console.log('Testing D-ID API with proper Basic authentication handling\n');
  
  try {
    // 1. First, try the credits endpoint which is known to be working
    console.log('Testing credits endpoint...');
    
    let response = await axios.get('https://api.d-id.com/credits', {
      headers: {
        'Authorization': `Basic ${didApiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ Credits endpoint successful');
    console.log(`Credits remaining: ${response.data.remaining}/${response.data.total}`);
    
    // 2. Try to create a basic talk with improved error handling
    console.log('\nTrying to create a talking avatar (basic approach)...');
    
    try {
      const createResponse = await axios.post(
        'https://api.d-id.com/talks',
        {
          source_url: 'https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg',
          script: {
            type: 'text',
            input: 'Test message',
          },
        },
        {
          headers: {
            'Authorization': `Basic ${didApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('✅ Talk creation request accepted!');
      console.log('Talk ID:', createResponse.data.id);
      
      // Poll for status
      const talkId = createResponse.data.id;
      console.log('\nPolling for status updates...');
      
      let attempts = 0;
      const maxAttempts = 10;
      let completed = false;
      
      while (attempts < maxAttempts && !completed) {
        attempts++;
        
        // Wait 3 seconds between checks
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log(`Status check ${attempts}/${maxAttempts}...`);
        
        const statusResponse = await axios.get(`https://api.d-id.com/talks/${talkId}`, {
          headers: {
            'Authorization': `Basic ${didApiKey}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log(`Status: ${statusResponse.data.status}`);
        
        if (statusResponse.data.status === 'done') {
          console.log('\n🎉 Success! Video avatar generated successfully.');
          console.log('URL:', statusResponse.data.result_url);
          completed = true;
          break;
        } else if (statusResponse.data.status === 'error') {
          console.error('\n❌ Error in video generation:', statusResponse.data.error);
          break;
        }
      }
      
      if (!completed) {
        console.log('\n⚠️ Status polling timed out. The operation may still be processing.');
      }
      
    } catch (error) {
      console.error('\n❌ Talk creation failed:');
      
      if (error.response) {
        console.error(`Status code: ${error.response.status}`);
        console.error('Error data:', JSON.stringify(error.response.data, null, 2));
        
        if (error.response.status === 500) {
          console.log('\n💡 Server error: D-ID is experiencing technical difficulties.');
          console.log('This error is on their side, not yours. Your API key is valid.');
          console.log('Try again later when their service stabilizes.');
        }
      } else {
        console.error('Error message:', error.message);
      }
    }
    
    console.log('\n📝 Test Results Summary:');
    console.log('- API Authentication: ✅ Working');
    console.log('- Credits Check: ✅ Working');
    console.log('- Talk Creation: See results above');
    
  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error(error.message);
  }
}

// Run the test
testWithDebug(); 