# ASU Wellness Bot

An interactive mental wellness platform featuring a human-like talking avatar and gamified elements, designed specifically for ASU students.

## Features

- Interactive talking avatar
- Real-time chat interface
- Gamified mental wellness activities
- Streak tracking and achievements
- ASU Mental Health Services integration
- Responsive design with ASU branding

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

The application will open in your default browser at `http://localhost:3000`.

## Tech Stack

- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Icons for icons

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Environment Variables

This project uses environment variables to securely store API keys and other sensitive information. To set up the environment variables:

1. Create a `.env` file in the root of the project (it should already exist)
2. Add your API keys in the following format:
   ```
   REACT_APP_OPENAI_API_KEY=your_api_key_here
   ```
3. The application will automatically use these environment variables

**Important Notes:**
- In Create React App, all environment variables must be prefixed with `REACT_APP_` to be accessible
- The `.env` file should never be committed to version control (it's already in .gitignore)
- Environment variables are embedded during build time, not runtime
- If you change the `.env` file while the app is running, you'll need to restart the development server

**For Production:**
- Consider using a backend proxy to secure your API keys instead of including them in the client-side code
- The current implementation with `dangerouslyAllowBrowser: true` is suitable for development but not recommended for production 