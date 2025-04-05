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

### 2. Getting a D-ID API Key

1. Go to [D-ID.com](https://www.d-id.com/)
2. Sign up for an account
3. Navigate to the API section
4. Create a new API key
5. Copy the key and add it to your `.env` file

D-ID offers a free trial with limited usage, which should be sufficient for testing. The paid plans start at around $9/month, which fits within your $10 budget.

### 3. Usage

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