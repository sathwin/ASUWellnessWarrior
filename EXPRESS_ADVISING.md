# Express Advising Feature

This feature allows users to have video consultations with AI-powered advisors. The AI advisor appears as a realistic talking face that responds to user questions in real-time.

## Features

- **Video Call Interface**: Simulates a real video call experience
- **AI-Powered Responses**: Uses GPT-4o for intelligent, contextual responses
- **Animated Talking Avatar**: Creates realistic talking head videos using D-ID API
- **Multiple Advisor Types**: Choose between academic, career, and wellness advisors
- **Real-time Chat**: Text-based chat alongside video for enhanced communication
- **Webcam Integration**: Shows the user's webcam feed for a two-way video experience

## Setup Instructions

### 1. API Keys

Two API keys are required for this feature:

1. **OpenAI API Key**: For the GPT-4o model that powers the advisor's responses
2. **D-ID API Key**: For generating the realistic talking avatar videos

Add these to your `.env` file:

```
REACT_APP_OPENAI_API_KEY=your_openai_api_key
REACT_APP_DID_API_KEY=your_did_api_key
```

### 2. Getting a D-ID API Key - Detailed Steps

1. **Create a D-ID Account**:
   - Go to [D-ID.com](https://www.d-id.com/)
   - Click on "Sign Up" in the top right corner
   - Complete the registration process
   
2. **Navigate to API Dashboard**:
   - After logging in, click on your profile icon in the top right
   - Select "Dashboard" from the dropdown
   - In the left sidebar, click on "API Keys"
   
3. **Generate an API Key**:
   - Click on the "Create API Key" button
   - Give your key a name (e.g., "ASU Wellness Warrior")
   - Set appropriate permissions (for this feature, you need "Talks" permissions)
   - Click "Create"
   
4. **Copy Your API Key**:
   - Once created, copy the API key
   - **Important**: This is the only time you'll see the full key, so make sure to copy it immediately
   
5. **Add to Environment Variables**:
   - Open your `.env` file in the project root
   - Find the `REACT_APP_DID_API_KEY` variable
   - Replace `your_did_api_key_here` with your actual API key

D-ID offers a free trial with 20 minutes of video generation, which should be sufficient for initial testing. The paid plans start at around $9/month, which fits within your $10 budget.

### 3. Understanding D-ID API Quotas

- **Free Plan**: 20 minutes of video generation
- **Basic Plan** ($9/month): 10 minutes of video generation per day
- **API calls**: Each response generates approximately 10-30 seconds of video

The ExpressAdvising component is optimized to use short, concise responses to maximize the number of interactions possible within your quota.

### 4. Usage

- Select "Express Advising" from the main navigation
- Choose an advisor type (Academic, Career, or Wellness)
- Click "Start Video Consultation"
- Allow webcam and microphone access when prompted
- Type your questions in the chat box and receive both text and video responses

## Technical Implementation

- React with TypeScript for the UI
- Framer Motion for animations
- OpenAI GPT-4o for conversation
- D-ID API for talking avatar generation
- Webcam integration using react-webcam
- Real-time state management with React hooks

## Notes for Developers

- The D-ID API has usage limits, so responses might be delayed during high traffic
- Video generation typically takes 2-5 seconds, depending on the length of the response
- Error handling is implemented for both API failures
- The advisors have different system prompts to specialize their responses
- Mobile-responsive design is implemented with a stacked layout on smaller screens

## Troubleshooting

### Common Issues:

1. **"D-ID API key is missing" error in console**:
   - Ensure you've added the API key to the `.env` file
   - Make sure the variable is exactly `REACT_APP_DID_API_KEY`
   - Restart your development server after changing the `.env` file

2. **Video doesn't load or shows error**:
   - Check the browser console for specific error messages
   - Verify your API key is valid and hasn't expired
   - Ensure you have sufficient quota remaining on your D-ID account

3. **"Authorization" errors in console**:
   - Make sure you're using the correct authentication format (Bearer token)
   - Check that your D-ID API key is correct and has the proper permissions

For any other issues, consult the [D-ID API documentation](https://docs.d-id.com/). 