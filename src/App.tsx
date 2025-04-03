import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon, FaBrain, FaHeart, FaStar, FaGamepad, FaMapMarkedAlt, FaTrophy, FaBook, FaMicrophone, FaRegCalendarAlt, FaRobot, FaPaperPlane, FaUser, FaKeyboard } from 'react-icons/fa';
import WellnessWarrior from './components/WellnessWarrior';
import MemoryGame from './components/games/MemoryGame';
import ResourceMatchmaker from './components/ResourceMatchmaker';
import WellnessPods from './components/WellnessPods';
import CampusSoundscapes from './components/CampusSoundscapes';
import ProfessorWisdom from './components/ProfessorWisdom';
import MoodHeatMap from './components/MoodHeatMap';
import GameSelector from './components/games/GameSelector';
import WellnessMap from './components/WellnessMap';
import AchievementsTracker from './components/AchievementsTracker';
import ResourcesHub from './components/ResourcesHub';
import MicroInterventions from './components/MicroInterventions';

interface Streak {
  current: number;
  longest: number;
  lastCheckIn: string;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: Date;
}

// Add OpenAI API configuration
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || 'your-api-key-here';

const App: React.FC = () => {
  // State management
  const [streak, setStreak] = useState<Streak>({ 
    current: 5, 
    longest: 10,
    lastCheckIn: new Date().toISOString().split('T')[0]
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm your ASU Wellness Warrior. How are you feeling today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [points, setPoints] = useState(150);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [level, setLevel] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { 
      id: '1', 
      title: 'First Chat', 
      description: 'Started your wellness journey', 
      icon: '🎯', 
      unlocked: true,
      date: new Date()
    },
    { 
      id: '2', 
      title: 'Game Master', 
      description: 'Completed all brain games', 
      icon: '🎮', 
      unlocked: false 
    },
    { 
      id: '3', 
      title: 'Streak Champion', 
      description: 'Maintained a 7-day streak', 
      icon: '🔥', 
      unlocked: false 
    },
    { 
      id: '4', 
      title: 'Resource Explorer', 
      description: 'Accessed all ASU wellness resources', 
      icon: '📚', 
      unlocked: false 
    },
    { 
      id: '5', 
      title: 'Meditation Master', 
      description: 'Completed 5 meditation sessions', 
      icon: '🧘', 
      unlocked: false 
    }
  ]);

  // Add state for mental health resources chatbot
  const [mentalHealthChatInput, setMentalHealthChatInput] = useState('');
  const [mentalHealthChatMessages, setMentalHealthChatMessages] = useState<Message[]>([
    {
      id: 'init-mental-health',
      text: "Hi there! I'm your ASU Mental Health Assistant. How can I help you with mental health resources today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  // Calculate level based on points
  useEffect(() => {
    setLevel(Math.floor(points / 100) + 1);
  }, [points]);

  // Add informational message when switching to map tab
  useEffect(() => {
    if (activeTab === 'map') {
      const mapInfoMessage: Message = {
        id: `map-info-${Date.now()}`,
        text: "This map shows how students feel about different campus locations. Click on a marker to see details and add your own experience.",
        isUser: false,
        timestamp: new Date()
      };
      
      // Only add the message if it doesn't already exist
      if (!messages.some(m => m.text.includes("This map shows how students feel about different campus locations"))) {
        setMessages(prev => [...prev, mapInfoMessage]);
      }
    }
  }, [activeTab]);

  // Handle daily check-in
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (streak.lastCheckIn !== today) {
      setStreak(prev => ({
        ...prev,
        current: prev.current + 1,
        longest: Math.max(prev.longest, prev.current + 1),
        lastCheckIn: today
      }));
      
      // Award points for daily check-in
      setPoints(prev => prev + 10);
      
      // Check if 7-day streak achieved
      if ((streak.current + 1) % 7 === 0) {
        // Award bonus points
        setPoints(prev => prev + 100);
        
        // Unlock achievement if not already unlocked
        if (!achievements.find(a => a.id === '3')?.unlocked) {
          setAchievements(prev => 
            prev.map(a => a.id === '3' ? { ...a, unlocked: true, date: new Date() } : a)
          );
        }
      }
    }
  }, [streak, achievements]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      
      // Generate response based on user input
      setTimeout(() => {
        let response = "I'm here to support your wellness journey. How can I help you today?";
        
        // Simple keyword matching for demo purposes
        if (inputMessage.toLowerCase().includes('stress') || inputMessage.toLowerCase().includes('anxious') || inputMessage.toLowerCase().includes('anxiety')) {
          response = "I understand that you're feeling stressed. Would you like to try a quick breathing exercise, play a relaxing brain game, or connect with ASU counseling services?";
        } else if (inputMessage.toLowerCase().includes('sad') || inputMessage.toLowerCase().includes('depress')) {
          response = "I'm sorry to hear that you're feeling down. ASU has excellent mental health resources available. Would you like me to connect you with a counselor or show you some self-help resources?";
        } else if (inputMessage.toLowerCase().includes('sleep') || inputMessage.toLowerCase().includes('tired')) {
          response = "Sleep is crucial for mental wellbeing. ASU's health services offer sleep consultations. In the meantime, would you like to try our calming campus soundscapes to help you relax?";
        } else if (inputMessage.toLowerCase().includes('game') || inputMessage.toLowerCase().includes('play')) {
          response = "Games are a great way to take a mental break! Check out our Brain Games tab for memory match, word puzzles, and more.";
        } else if (inputMessage.toLowerCase().includes('resource') || inputMessage.toLowerCase().includes('help')) {
          response = "ASU offers many wellness resources! You can find counseling services, peer support, and self-help tools in our Resources Hub tab.";
        } else if (inputMessage.toLowerCase().includes('finals') || inputMessage.toLowerCase().includes('exam') || inputMessage.toLowerCase().includes('test')) {
          response = "Finals period can be stressful. ASU offers extended counseling hours during finals week. Would you like stress management techniques specifically for academic pressure?";
        }
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        
        // Award points for engagement
        setPoints(prev => prev + 5);
      }, 1000);
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // This would normally connect to the Web Speech API
      // For demo purposes, we'll simulate voice input after a delay
      setTimeout(() => {
        setInputMessage("I'm feeling stressed about finals");
        setIsListening(false);
      }, 2000);
    }
  };

  const handleGameComplete = (score: number) => {
    setPoints(prev => prev + 25);
    
    const botMessage: Message = {
      id: Date.now().toString(),
      text: `Great job! You earned ${score} points from that brain game. Games like this can help reduce stress and improve focus.`,
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
    
    // Check if all games completed
    if (!achievements.find(a => a.id === '2')?.unlocked) {
      // For demo purposes, we'll assume this completes all games
      setAchievements(prev => 
        prev.map(a => a.id === '2' ? { ...a, unlocked: true, date: new Date() } : a)
      );
    }
  };

  // Function to handle sending messages to the mental health chatbot
  const handleMentalHealthChat = async () => {
    if (mentalHealthChatInput.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        text: mentalHealthChatInput,
        isUser: true,
        timestamp: new Date()
      };
      
      setMentalHealthChatMessages(prev => [...prev, userMessage]);
      setMentalHealthChatInput('');
      setIsLoadingResponse(true);
      
      try {
        // Here we would integrate with OpenAI API
        // For now, simulate API response with a timeout
        setTimeout(async () => {
          // In a real implementation, you would call the OpenAI API here
          /* Example OpenAI API call:
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [
                { role: 'system', content: 'You are an ASU mental health assistant that helps students find mental health resources.' },
                { role: 'user', content: mentalHealthChatInput }
              ],
              max_tokens: 150
            })
          });
          
          const data = await response.json();
          const assistantResponse = data.choices[0].message.content;
          */
          
          // Simulate response for now
          let assistantResponse = "I can help you find ASU mental health resources. What specific support are you looking for?";
          
          // Simple keyword matching for demo purposes
          if (mentalHealthChatInput.toLowerCase().includes('stress') || mentalHealthChatInput.toLowerCase().includes('anxiety')) {
            assistantResponse = "ASU Counseling Services offers stress and anxiety management workshops and one-on-one counseling. Would you like me to provide contact information?";
          } else if (mentalHealthChatInput.toLowerCase().includes('depression') || mentalHealthChatInput.toLowerCase().includes('sad')) {
            assistantResponse = "If you're experiencing symptoms of depression, ASU Counseling Services offers confidential support. You can reach them at (480) 965-6146 or visit their office in the Student Services Building.";
          } else if (mentalHealthChatInput.toLowerCase().includes('emergency') || mentalHealthChatInput.toLowerCase().includes('crisis')) {
            assistantResponse = "For immediate help, please call ASU's 24/7 Crisis Line at (480) 965-6146 and press 1. If this is a life-threatening emergency, call 911.";
          } else if (mentalHealthChatInput.toLowerCase().includes('appointment') || mentalHealthChatInput.toLowerCase().includes('counselor')) {
            assistantResponse = "To schedule an appointment with an ASU counselor, call (480) 965-6146 or visit the ASU Health Services Patient Portal online.";
          }
          
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: assistantResponse,
            isUser: false,
            timestamp: new Date()
          };
          
          setMentalHealthChatMessages(prev => [...prev, botMessage]);
          setIsLoadingResponse(false);
        }, 1000);
      } catch (error) {
        console.error('Error communicating with OpenAI API:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, I encountered an error processing your request. Please try again later.",
          isUser: false,
          timestamp: new Date()
        };
        setMentalHealthChatMessages(prev => [...prev, errorMessage]);
        setIsLoadingResponse(false);
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="flex flex-col gap-8">
            {/* Two-column layout with primary components - enhanced styling */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 p-8 rounded-xl bg-white shadow-lg dark:bg-gray-800 relative overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-asu-gold opacity-10 rounded-bl-full"></div>
                
                <WellnessWarrior
                  level={level}
                  streak={streak.current}
                  points={points}
                  achievements={achievements.filter(a => a.unlocked).map(a => a.title)}
                  isDarkMode={isDarkMode}
                />
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-bold mb-4 text-asu-maroon flex items-center">
                    <span className="bg-asu-maroon text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <FaRegCalendarAlt />
                    </span>
                    Daily Wellness Moments
                  </h3>
                  <MicroInterventions isDarkMode={isDarkMode} />
                </div>
              </div>
              <div className="md:w-1/2 p-8 rounded-xl bg-white shadow-lg dark:bg-gray-800 relative overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-asu-maroon opacity-10 rounded-bl-full"></div>
                
                <h3 className="text-xl font-bold mb-4 text-asu-maroon flex items-center">
                  <span className="bg-asu-maroon text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 shadow-sm">
                    <FaHeart />
                  </span>
                  ASU Mental Health Resources
                </h3>
                <ResourceMatchmaker isDarkMode={isDarkMode} />
              </div>
            </div>
            
            {/* Mental Health Assistant with enhanced styling */}
            <div className="max-w-5xl mx-auto w-full p-8 rounded-xl bg-white shadow-lg dark:bg-gray-800 relative overflow-hidden transform transition-all duration-300 hover:shadow-xl">
              {/* Decorative elements for the chat container */}
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-asu-gold opacity-10 rounded-full"></div>
              <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-asu-maroon opacity-10 rounded-full"></div>
              <div className="absolute top-0 right-0 w-64 h-1 bg-gradient-to-r from-asu-maroon to-asu-gold"></div>
              <div className="absolute bottom-0 left-0 w-64 h-1 bg-gradient-to-r from-asu-gold to-asu-maroon"></div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="bg-gradient-to-r from-asu-maroon to-asu-gold p-4 rounded-full mr-4 shadow-md">
                    <FaRobot className="text-white text-3xl" />
                  </div>
                  <motion.div 
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-asu-maroon to-asu-gold">
                    ASU Mental Health Assistant
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Online • Ready to help</p>
                </div>
              </div>
              
              <p className="text-center mb-6 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Chat with me about wellness resources and mental health support at ASU. I'm here to help you navigate available services and find the support you need.
              </p>
              
              {/* Chat Messages - enhanced styling */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6 h-[350px] overflow-y-auto shadow-inner border border-gray-100 dark:border-gray-600 scroll-smooth">
                <div className="space-y-6">
                  {mentalHealthChatMessages.map((message, index) => (
                    <motion.div 
                      key={message.id} 
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (index % 3) }}
                    >
                      {!message.isUser && (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-asu-blue to-asu-maroon flex-shrink-0 mr-3 flex items-center justify-center shadow-md">
                          <FaRobot className="text-white text-sm" />
                        </div>
                      )}
                      <motion.div 
                        className={`p-4 rounded-2xl max-w-[80%] shadow-md ${
                          message.isUser 
                            ? 'bg-gradient-to-r from-asu-maroon to-asu-gold text-white' 
                            : 'bg-asu-blue text-white'
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <p className="text-base">{message.text}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {message.isUser && (
                            <div className="text-xs opacity-70">
                              <span>Sent</span>
                              <span className="ml-1">✓</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                      {message.isUser && (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-asu-gold to-asu-orange flex-shrink-0 ml-3 flex items-center justify-center shadow-md">
                          <FaUser className="text-white text-sm" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isLoadingResponse && (
                    <motion.div 
                      className="flex justify-start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-asu-blue to-asu-maroon flex-shrink-0 mr-3 flex items-center justify-center shadow-md">
                        <FaRobot className="text-white text-sm" />
                      </div>
                      <div className="bg-asu-blue text-white p-4 rounded-2xl shadow-md">
                        <div className="flex space-x-2">
                          <motion.div 
                            className="w-3 h-3 bg-white rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                          />
                          <motion.div 
                            className="w-3 h-3 bg-white rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                          />
                          <motion.div 
                            className="w-3 h-3 bg-white rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Predetermined Quick Options - enhanced styling */}
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {[
                  { text: "Stress management", query: "How can I manage stress during finals?", icon: "😓" },
                  { text: "Talk to counselor", query: "I need to talk to a counselor ASAP", icon: "🗣️" },
                  { text: "Find resources", query: "Where can I find mental health resources on campus?", icon: "🔍" },
                  { text: "Anxiety support", query: "I'm feeling anxious about my classes", icon: "😰" },
                  { text: "Depression help", query: "I'm feeling depressed and need help", icon: "😢" }
                ].map((option, index) => (
                  <motion.button 
                    key={index}
                    onClick={() => setMentalHealthChatInput(option.query)}
                    className="px-5 py-3 bg-asu-cream text-asu-gray rounded-full hover:bg-asu-gold hover:text-white transition-colors text-sm font-medium shadow-sm border border-transparent hover:border-asu-gold flex items-center"
                    whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mr-2">{option.icon}</span>
                    {option.text}
                  </motion.button>
                ))}
              </div>
              
              {/* Input Area - enhanced styling */}
              <div className="relative">
                <div className="flex space-x-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={mentalHealthChatInput}
                      onChange={(e) => setMentalHealthChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleMentalHealthChat()}
                      placeholder="Ask about mental health support..."
                      className={`w-full p-4 pl-12 rounded-full border text-base focus:ring-2 focus:ring-asu-gold focus:border-transparent transition-all ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                      disabled={isLoadingResponse}
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <FaKeyboard className="text-lg" />
                    </span>
                  </div>
                  <motion.button
                    onClick={handleMentalHealthChat}
                    className={`p-4 rounded-full bg-gradient-to-r from-asu-maroon to-asu-gold text-white flex items-center justify-center shadow-md ${
                      isLoadingResponse ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isLoadingResponse}
                    whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoadingResponse ? (
                      <motion.div 
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      />
                    ) : (
                      <FaPaperPlane className="text-xl" />
                    )}
                  </motion.button>
                </div>
                <div className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
                  Powered by ASU Counseling Services • Privacy Protected • <span className="text-asu-blue cursor-pointer hover:underline">Privacy Policy</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'games':
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white shadow-lg dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-asu-maroon">Brain Games</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">Exercise your mind and earn wellness points!</p>
              <div className="bg-asu-maroon text-white p-4 rounded-lg mb-6">
                <h3 className="font-bold flex items-center">
                  <FaStar className="mr-2 text-asu-gold" /> Daily Featured Game: Memory Match
                </h3>
                <p className="text-sm">2x point multiplier today!</p>
              </div>
              <GameSelector onGameComplete={handleGameComplete} isDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case 'map':
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white shadow-lg dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-asu-maroon">Campus Wellness Map</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Explore wellness resources and emotional markers across ASU campus
              </p>
              <WellnessMap isDarkMode={isDarkMode} />
            </div>
            <div className="p-6 rounded-xl bg-white shadow-lg dark:bg-gray-800">
              <MoodHeatMap isDarkMode={isDarkMode} />
            </div>
          </div>
        );
      case 'progress':
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white shadow-lg dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-asu-maroon">Progress & Achievements</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Track your wellness journey and unlock achievements
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-asu-maroon">Your Stats</h3>
                  <div className="bg-asu-cream p-4 rounded-lg dark:bg-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Level:</span>
                      <span className="bg-asu-maroon text-white px-3 py-1 rounded-full">{level}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Points:</span>
                      <span className="bg-asu-gold text-asu-gray px-3 py-1 rounded-full">{points}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Current Streak:</span>
                      <span className="bg-asu-blue text-white px-3 py-1 rounded-full">{streak.current} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Longest Streak:</span>
                      <span className="bg-asu-orange text-white px-3 py-1 rounded-full">{streak.longest} days</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-asu-maroon">Next Level</h3>
                  <div className="bg-asu-cream p-4 rounded-lg dark:bg-gray-700">
                    <p className="mb-2">Progress to Level {level + 1}:</p>
                    <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-600">
                      <div 
                        className="bg-asu-maroon h-4 rounded-full"
                        style={{ width: `${(points % 100) / 100 * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-right">{points % 100}/100 points</p>
                    <p className="mt-4 text-sm">Earn {100 - (points % 100)} more points to reach Level {level + 1} and unlock new avatar features!</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <AchievementsTracker achievements={achievements} isDarkMode={isDarkMode} />
              </div>
            </div>
            <div className="p-6 rounded-xl bg-white shadow-lg dark:bg-gray-800">
              <h3 className="text-xl font-bold mb-4 text-asu-maroon">Wellness Calendar</h3>
              <div className="flex items-center mb-4">
                <FaRegCalendarAlt className="text-asu-maroon mr-2" />
                <span className="font-semibold">Important Academic Dates</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-asu-cream rounded-lg dark:bg-gray-700">
                  <div className="font-bold">Finals Week</div>
                  <div className="text-sm">December 6-10, 2023</div>
                  <div className="text-sm text-asu-maroon mt-1">10 days remaining</div>
                </div>
                <div className="p-3 bg-asu-cream rounded-lg dark:bg-gray-700">
                  <div className="font-bold">Winter Break</div>
                  <div className="text-sm">December 11, 2023 - January 8, 2024</div>
                  <div className="text-sm text-asu-maroon mt-1">15 days remaining</div>
                </div>
                <div className="p-3 bg-asu-cream rounded-lg dark:bg-gray-700">
                  <div className="font-bold">Spring Semester Begins</div>
                  <div className="text-sm">January 9, 2024</div>
                  <div className="text-sm text-asu-maroon mt-1">44 days remaining</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'resources':
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white shadow-lg dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-asu-maroon">ASU Resources Hub</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Connect with ASU wellness and mental health resources
              </p>
              <ResourcesHub isDarkMode={isDarkMode} />
            </div>
            
            {/* Mental Health Chatbot moved to Home tab */}
            
            <div className="p-6 rounded-xl bg-white shadow-lg dark:bg-gray-800">
              <h3 className="text-xl font-bold mb-4 text-asu-maroon">Campus Soundscapes</h3>
              <CampusSoundscapes isDarkMode={isDarkMode} />
            </div>
            <div className="p-6 rounded-xl bg-white shadow-lg dark:bg-gray-800">
              <h3 className="text-xl font-bold mb-4 text-asu-maroon">Professor Wisdom</h3>
              <ProfessorWisdom isDarkMode={isDarkMode} />
            </div>
            <div className="p-6 rounded-xl bg-white shadow-lg dark:bg-gray-800">
              <h3 className="text-xl font-bold mb-4 text-asu-maroon">Wellness Pods</h3>
              <WellnessPods isDarkMode={isDarkMode} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        color: isDarkMode ? 'white' : '#4a4a4a',
      }}
    >
      {/* Background Image */}
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <img 
          src="downtown-night.jpg" 
          alt="Downtown ASU at night"
          className="w-full h-full object-cover"
          style={{ 
            opacity: 0.95,
            filter: "brightness(1.5) contrast(1.1)"
          }}
        />
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: isDarkMode ? '#121212' : '#ffffff',
            opacity: isDarkMode ? 0.25 : 0.1
          }}
        ></div>
      </div>
      
      {/* ASU Background Elements - Subtle and non-intrusive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-asu-maroon opacity-10 rounded-br-full transform -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-asu-gold opacity-10 rounded-tl-full transform translate-x-1/3 translate-y-1/3"></div>
        
        {/* Subtle ASU pattern - will only show in light mode */}
        {!isDarkMode && (
          <>
            <div className="absolute top-20 right-10 w-32 h-32 border-4 border-asu-maroon opacity-5 transform rotate-12"></div>
            <div className="absolute bottom-40 left-20 w-20 h-20 border-4 border-asu-gold opacity-5 transform -rotate-12"></div>
            <div className="hidden md:block absolute top-1/4 right-1/4 w-72 h-72 rounded-full border-8 border-dashed border-asu-gold opacity-5"></div>
          </>
        )}
      </div>

      {/* Header with improved styling */}
      <header className={`p-5 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white bg-opacity-90'} relative`} style={{ zIndex: 10 }}>
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-asu-maroon to-asu-gold flex items-center justify-center shadow-md">
                <FaBrain className="text-5xl text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-asu-gold text-asu-maroon text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-sm border-2 border-white">{level}</span>
            </div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-asu-maroon to-asu-gold">ASU Wellness Warrior</h1>
          </div>
          <div className="flex items-center space-x-4">
            <motion.div 
              className="flex items-center space-x-2 bg-gradient-to-r from-asu-cream to-asu-gold bg-opacity-90 py-2 px-4 rounded-full shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              <FaStar className="text-asu-maroon text-xl" />
              <span className="font-bold text-lg text-asu-maroon">{points} pts</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2 bg-gradient-to-r from-asu-maroon to-asu-gold py-2 px-4 rounded-full shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              <FaHeart className="text-white text-xl" />
              <span className="font-bold text-lg text-white">{streak.current} day streak</span>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-full shadow-md ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              {isDarkMode ? <FaSun className="text-asu-gold text-xl" /> : <FaMoon className="text-asu-maroon text-xl" />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content with improved styling */}
      <main className="container mx-auto p-4 relative" style={{ zIndex: 10 }}>
        {/* Navigation Tabs with enhanced styling */}
        <div className="flex space-x-2 md:space-x-4 mb-8 overflow-x-auto py-3 px-2">
          {[
            { id: 'home', icon: <FaBrain className="mr-2 text-xl" />, label: 'Home' },
            { id: 'games', icon: <FaGamepad className="mr-2 text-xl" />, label: 'Brain Games' },
            { id: 'map', icon: <FaMapMarkedAlt className="mr-2 text-xl" />, label: 'Campus Map' },
            { id: 'progress', icon: <FaTrophy className="mr-2 text-xl" />, label: 'Progress' },
            { id: 'resources', icon: <FaBook className="mr-2 text-xl" />, label: 'Resources' }
          ].map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-full whitespace-nowrap flex items-center text-lg ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-asu-maroon to-asu-gold text-white'
                  : isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-white hover:bg-gray-50 text-asu-gray shadow-md'
              } transition-all duration-300 ease-in-out`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.icon} {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content Area with enhanced animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer with ASU branding */}
      <footer className={`mt-12 py-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-70">
            ASU Wellness Warrior • Arizona State University • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App; 