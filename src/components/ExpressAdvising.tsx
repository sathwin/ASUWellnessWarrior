import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaVideo, FaMicrophone, FaPhoneSlash, FaUser, FaComment, FaCog } from 'react-icons/fa';
import OpenAI from 'openai';
import Webcam from 'react-webcam';
import axios from 'axios';

interface ExpressAdvisingProps {
  isDarkMode: boolean;
}

const ExpressAdvising: React.FC<ExpressAdvisingProps> = ({ isDarkMode }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<{text: string, isUser: boolean, timestamp: Date}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [advisorUrl, setAdvisorUrl] = useState<string | null>(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState('academic');
  
  const webcamRef = useRef<Webcam>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // API keys (using environment variables)
  const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
  const didApiKey = process.env.REACT_APP_DID_API_KEY; // You'll need to add this to your .env file
  
  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: openaiApiKey,
    dangerouslyAllowBrowser: true
  });

  const advisors = {
    academic: {
      name: "Dr. Morgan Chen",
      title: "Academic Advisor",
      description: "Specialized in academic planning and course selection",
      avatar: "https://didgeneration.com/static/did_showcase/image_f2/f4.jpeg",
      prompt: "You are Dr. Morgan Chen, an academic advisor at Arizona State University. You help students with course selection, academic planning, degree requirements, and study strategies. You are knowledgeable about ASU's academic policies, majors, and resources. Be supportive, clear, and provide specific recommendations based on the student's situation.",
    },
    career: {
      name: "Prof. Jamie Rivera",
      title: "Career Counselor",
      description: "Expert in career pathways and professional development",
      avatar: "https://didgeneration.com/static/did_showcase/image_f2/f5.jpeg",
      prompt: "You are Prof. Jamie Rivera, a career counselor at Arizona State University. You help students with career exploration, job search strategies, resume building, interview preparation, and professional development. You are knowledgeable about various career paths, industry trends, and employment opportunities for ASU graduates. Be encouraging, practical, and provide tailored advice based on the student's interests and goals.",
    },
    wellness: {
      name: "Dr. Taylor Washington",
      title: "Wellness Specialist",
      description: "Focuses on mental health and well-being strategies",
      avatar: "https://didgeneration.com/static/did_showcase/image_f2/f3.jpeg",
      prompt: "You are Dr. Taylor Washington, a wellness specialist at Arizona State University. You help students with mental health concerns, stress management, work-life balance, healthy habits, and accessing wellness resources on campus. You are knowledgeable about holistic well-being approaches, coping strategies, and ASU's wellness services. Be compassionate, attentive, and provide thoughtful advice based on the student's needs.",
    }
  };

  // Function to start the video call
  const startCall = async () => {
    setIsCallActive(true);
    
    // Add initial welcome message
    const initialMessage = {
      text: `Hello, I'm ${advisors[selectedAdvisor as keyof typeof advisors].name}, your ${advisors[selectedAdvisor as keyof typeof advisors].title}. How can I help you today?`,
      isUser: false,
      timestamp: new Date()
    };
    
    setConversation([initialMessage]);
    
    try {
      // Try to initialize the D-ID talking avatar
      await generateInitialDIDResponse(initialMessage.text);
    } catch (error) {
      console.error("Error initializing D-ID avatar:", error);
    }
  };

  // Function to end the video call
  const endCall = () => {
    setIsCallActive(false);
    setAdvisorUrl(null);
    setConversation([]);
  };

  // Function to toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Function to send a message
  const sendMessage = async () => {
    if (message.trim() === '') return;
    
    // Add user message to conversation
    const userMessage = {
      text: message,
      isUser: true,
      timestamp: new Date()
    };
    
    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);
    setMessage('');
    
    try {
      // Get AI response
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system" as const,
            content: advisors[selectedAdvisor as keyof typeof advisors].prompt
          },
          ...conversation.map(msg => ({
            role: msg.isUser ? "user" as const : "assistant" as const,
            content: msg.text
          })),
          {
            role: "user" as const,
            content: message
          }
        ]
      });
      
      const aiResponse = response.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";
      
      // Add AI response to conversation
      const aiMessage = {
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, aiMessage]);
      
      // Generate talking avatar video
      await generateDIDResponse(aiResponse);
      
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Add error message to conversation
      setConversation(prev => [
        ...prev,
        {
          text: "I'm sorry, I encountered an error. Please try again.",
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
    
    setIsLoading(false);
  };

  // Function to generate D-ID talking avatar response for initial message
  const generateInitialDIDResponse = async (text: string) => {
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
          source_url: advisors[selectedAdvisor as keyof typeof advisors].avatar,
        },
        {
          headers: {
            'Authorization': `Bearer ${didApiKey}`,
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
  };

  // Function to generate D-ID talking avatar response
  const generateDIDResponse = async (text: string) => {
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
          source_url: advisors[selectedAdvisor as keyof typeof advisors].avatar,
        },
        {
          headers: {
            'Authorization': `Bearer ${didApiKey}`,
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
  };

  // Function to poll D-ID API for result
  const pollDIDResult = async (talkId: string) => {
    if (!didApiKey) return;

    const maxAttempts = 30;
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await axios.get(`https://api.d-id.com/talks/${talkId}`, {
          headers: {
            'Authorization': `Bearer ${didApiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.status === 'done') {
          setAdvisorUrl(response.data.result_url);
          if (videoRef.current) {
            videoRef.current.load();
          }
          return;
        }

        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 1000);
        }
      } catch (error) {
        console.error('Error polling D-ID result:', error);
      }
    };

    await poll();
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  // Play the video when advisorUrl changes
  useEffect(() => {
    if (advisorUrl && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(err => console.error('Error playing video:', err));
    }
  }, [advisorUrl]);

  return (
    <div className={`w-full h-full rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      {/* Header */}
      <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-asu-maroon text-white'} flex items-center justify-between`}>
        <h2 className="text-xl font-bold">Express Advising</h2>
        
        {!isCallActive && (
          <div className="flex space-x-4">
            <select 
              className={`rounded-md p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
              value={selectedAdvisor}
              onChange={(e) => setSelectedAdvisor(e.target.value)}
            >
              <option value="academic">Academic Advisor</option>
              <option value="career">Career Counselor</option>
              <option value="wellness">Wellness Specialist</option>
            </select>
          </div>
        )}
      </div>
      
      {!isCallActive ? (
        <div className="p-6 flex flex-col items-center justify-center h-[80vh]">
          {/* Advisor Information */}
          <div className={`mb-8 p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} max-w-md text-center`}>
            <img
              src={advisors[selectedAdvisor as keyof typeof advisors].avatar}
              alt={advisors[selectedAdvisor as keyof typeof advisors].name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-bold">{advisors[selectedAdvisor as keyof typeof advisors].name}</h3>
            <p className="text-lg font-semibold">{advisors[selectedAdvisor as keyof typeof advisors].title}</p>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {advisors[selectedAdvisor as keyof typeof advisors].description}
            </p>
          </div>
          
          {/* Start Call Button */}
          <motion.button
            className="bg-asu-maroon text-white px-6 py-3 rounded-lg font-bold flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startCall}
          >
            <FaVideo className="mr-2" /> Start Video Consultation
          </motion.button>
          
          <p className={`mt-6 text-center max-w-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Connect with an AI-powered advisor for personalized guidance. Our advisors can help with academic planning, 
            career decisions, and wellness strategies.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 h-[80vh]">
          {/* Video Call Section */}
          <div className={`relative flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            {/* Advisor Video */}
            <div className="flex-1 flex items-center justify-center p-4">
              {advisorUrl ? (
                <video 
                  ref={videoRef}
                  className="w-full max-h-full rounded-lg"
                  autoPlay
                  controls={false}
                  loop
                >
                  <source src={advisorUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className={`w-full h-64 flex items-center justify-center rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <FaUser className="text-5xl opacity-50" />
                </div>
              )}
            </div>
            
            {/* User Video */}
            <div className="absolute bottom-4 right-4 w-1/3 h-1/4">
              <Webcam
                ref={webcamRef}
                className="w-full h-full rounded-lg object-cover"
                audio={true}
                mirrored={true}
                videoConstraints={{
                  facingMode: "user"
                }}
              />
            </div>
            
            {/* Call Controls */}
            <div className="p-4 flex justify-center space-x-4">
              <motion.button
                className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-green-500'} text-white`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMute}
              >
                <FaMicrophone />
              </motion.button>
              
              <motion.button
                className="p-3 rounded-full bg-red-500 text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={endCall}
              >
                <FaPhoneSlash />
              </motion.button>
            </div>
          </div>
          
          {/* Chat Section */}
          <div className={`flex flex-col h-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Conversation */}
            <div className="flex-1 p-4 overflow-y-auto">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    msg.isUser 
                      ? 'ml-auto max-w-[80%]' 
                      : 'mr-auto max-w-[80%]'
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      msg.isUser
                        ? `${isDarkMode ? 'bg-asu-maroon' : 'bg-asu-gold'} text-white`
                        : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div
                    className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="mr-auto max-w-[80%] mb-4">
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Message Input */}
            <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className={`flex-1 p-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white placeholder-gray-400' 
                      : 'bg-white text-gray-800 placeholder-gray-400'
                  }`}
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  className="p-2 rounded-lg bg-asu-maroon text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  <FaComment />
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpressAdvising; 