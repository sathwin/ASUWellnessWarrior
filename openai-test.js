const { OpenAI } = require('openai');
require('dotenv').config();

// Get the OpenAI API key from environment variables
const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

if (!openaiApiKey) {
  console.error('Error: OpenAI API key is missing. Please check your .env file.');
  process.exit(1);
}

// Test the OpenAI API
async function testOpenAI() {
  console.log('\n🤖 Testing OpenAI API Connection');
  console.log('-----------------------------');
  console.log('This test will:');
  console.log('1. Connect to the OpenAI API');
  console.log('2. Request a simple completion from GPT-4o');
  console.log('3. Display the response\n');
  
  try {
    console.log('Initializing OpenAI client...');
    console.log(`Using API key: ${openaiApiKey.substring(0, 5)}...${openaiApiKey.substring(openaiApiKey.length - 5)}`);
    
    // Initialize the OpenAI client
    const openai = new OpenAI({
      apiKey: openaiApiKey,
      dangerouslyAllowBrowser: true // Only needed for browser usage, not for Node.js
    });
    
    console.log('Making a simple request to GPT-4o...');
    
    // Make a simple request to the API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system", 
          content: "You are a helpful assistant for ASU Wellness Warrior."
        },
        {
          role: "user", 
          content: "Say hello and confirm that the API is working correctly."
        }
      ],
      max_tokens: 150
    });
    
    // Check the response
    if (response && response.choices && response.choices.length > 0) {
      const message = response.choices[0].message.content;
      
      console.log('\n✅ OpenAI API connection successful!');
      console.log('\nResponse from GPT-4o:');
      console.log('------------------------');
      console.log(message);
      console.log('------------------------');
      
      console.log('\n🎉 Your OpenAI API key is working correctly!');
      console.log('You can now use the Express Advising feature with confidence.');
    } else {
      console.error('\n⚠️ Received an unexpected response format from OpenAI API.');
      console.error('Response data:', JSON.stringify(response, null, 2));
    }
    
  } catch (error) {
    console.error('\n❌ OpenAI API request failed:');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Error message:', error.response.data.error.message);
      
      // Provide guidance based on common error codes
      if (error.response.status === 401) {
        console.error('\n💡 Authentication error: Your API key appears to be invalid or expired.');
        console.error('Please check your API key in the .env file.');
      } else if (error.response.status === 429) {
        console.error('\n💡 Rate limit exceeded: You have sent too many requests or exceeded your quota.');
        console.error('Consider upgrading your OpenAI plan or waiting before trying again.');
      }
    } else {
      console.error('Error details:', error.message);
    }
  }
}

// Run the test
testOpenAI(); 