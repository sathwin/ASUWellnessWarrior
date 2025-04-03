import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaSmile, FaSadTear, FaMeh, FaHeartbeat, FaExclamationTriangle, FaFilter } from 'react-icons/fa';

interface MapLocation {
  id: string;
  name: string;
  description: string;
  coordinates: { x: number; y: number };
  emotions: {
    happy: number;
    sad: number;
    neutral: number;
    love: number;
    stress: number;
  };
  resources?: string[];
}

interface WellnessMapProps {
  isDarkMode: boolean;
}

const WellnessMap: React.FC<WellnessMapProps> = ({ isDarkMode }) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [showAddEmotion, setShowAddEmotion] = useState(false);
  const [userStory, setUserStory] = useState('');

  const locations: MapLocation[] = [
    {
      id: 'hayden',
      name: 'Hayden Library',
      description: 'Central campus library with study spaces and resources',
      coordinates: { x: 45, y: 35 },
      emotions: {
        happy: 52,
        sad: 10,
        neutral: 25,
        love: 35,
        stress: 62
      },
      resources: ['Quiet study zones', 'Computer access', 'Academic resources']
    },
    {
      id: 'manzanita',
      name: 'Manzanita Hall',
      description: 'Residential hall for students',
      coordinates: { x: 20, y: 60 },
      emotions: {
        happy: 75,
        sad: 15,
        neutral: 30,
        love: 45,
        stress: 22
      }
    },
    {
      id: 'memorial',
      name: 'Memorial Union',
      description: 'Student union with dining, meeting spaces, and services',
      coordinates: { x: 70, y: 45 },
      emotions: {
        happy: 82,
        sad: 8,
        neutral: 42,
        love: 38,
        stress: 28
      },
      resources: ['Food services', 'Relaxation spaces', 'Student services']
    },
    {
      id: 'old-main',
      name: 'Old Main',
      description: 'Historic building housing administrative offices',
      coordinates: { x: 55, y: 20 },
      emotions: {
        happy: 35,
        sad: 12,
        neutral: 55,
        love: 25,
        stress: 32
      }
    },
    {
      id: 'palm-walk',
      name: 'Palm Walk',
      description: 'Iconic pathway through campus lined with palm trees',
      coordinates: { x: 60, y: 75 },
      emotions: {
        happy: 92,
        sad: 5,
        neutral: 20,
        love: 75,
        stress: 8
      }
    },
    {
      id: 'counseling',
      name: 'Counseling Services',
      description: 'ASU Counseling Services for students',
      coordinates: { x: 85, y: 30 },
      emotions: {
        happy: 45,
        sad: 32,
        neutral: 50,
        love: 28,
        stress: 18
      },
      resources: ['Individual counseling', 'Group therapy', 'Crisis intervention', 'Mental health workshops']
    },
    {
      id: 'student-pavilion',
      name: 'Student Pavilion',
      description: 'Modern building for student activities and events',
      coordinates: { x: 30, y: 25 },
      emotions: {
        happy: 75,
        sad: 12,
        neutral: 35,
        love: 42,
        stress: 25
      }
    }
  ];

  const emotions = [
    { id: 'happy', name: 'Happy', icon: <FaSmile className="text-yellow-400" />, description: 'Joyful, content, peaceful' },
    { id: 'sad', name: 'Sad', icon: <FaSadTear className="text-blue-400" />, description: 'Down, blue, melancholy' },
    { id: 'neutral', name: 'Neutral', icon: <FaMeh className="text-gray-400" />, description: 'Calm, balanced, okay' },
    { id: 'love', name: 'Love', icon: <FaHeartbeat className="text-red-400" />, description: 'Connected, appreciative, loved' },
    { id: 'stress', name: 'Stress', icon: <FaExclamationTriangle className="text-orange-400" />, description: 'Anxious, overwhelmed, tense' }
  ];

  const getTopEmotion = (location: MapLocation) => {
    const { emotions } = location;
    let topEmotion = 'neutral';
    let topValue = 0;
    
    Object.entries(emotions).forEach(([emotion, value]) => {
      if (value > topValue) {
        topValue = value;
        topEmotion = emotion;
      }
    });
    
    return topEmotion;
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happy': return 'text-yellow-400';
      case 'sad': return 'text-blue-400';
      case 'neutral': return 'text-gray-400';
      case 'love': return 'text-red-400';
      case 'stress': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getEmotionIcon = (emotion: string) => {
    const found = emotions.find(e => e.id === emotion);
    return found ? found.icon : <FaMeh className="text-gray-400" />;
  };

  const filteredLocations = selectedEmotion
    ? locations.filter(location => {
        const emotionValue = location.emotions[selectedEmotion as keyof typeof location.emotions];
        // Show locations where this emotion is significant (arbitrary threshold)
        return emotionValue > 40;
      })
    : locations;

  const handleAddEmotion = () => {
    // In a real app, this would save to a database
    if (selectedLocation) {
      setShowAddEmotion(false);
      setUserStory('');
      
      // Show success message
      alert('Thank you for sharing your experience!');
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-asu-maroon">ASU Tempe Campus</h3>
        <div className="flex items-center space-x-3">
          <span className="text-base font-medium">Filter by emotion:</span>
          <div className="relative">
            <button
              className={`p-3 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'}`}
              onClick={() => setSelectedEmotion(prev => prev ? null : 'show')}
            >
              <FaFilter className={`text-xl ${selectedEmotion ? 'text-asu-maroon' : 'text-gray-400'}`} />
            </button>
            
            {selectedEmotion === 'show' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute right-0 mt-2 p-4 rounded-lg z-10 w-56 shadow-xl ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                {emotions.map(emotion => (
                  <button
                    key={emotion.id}
                    className="flex items-center w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-2 transition-all"
                    onClick={() => {
                      setSelectedEmotion(emotion.id);
                    }}
                  >
                    <span className="mr-3 text-xl">{emotion.icon}</span>
                    <span className="text-base font-medium">{emotion.name}</span>
                  </button>
                ))}
                <div className="border-t pt-2 mt-2">
                  <button
                    className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-asu-blue"
                    onClick={() => setSelectedEmotion(null)}
                  >
                    Clear filter
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Map Container */}
      <div className={`relative w-full h-[650px] rounded-xl overflow-hidden ${
        isDarkMode ? 'bg-gray-800' : 'bg-asu-cream'
      } shadow-lg`}>
        {/* ASU Map Background */}
        <div className="absolute inset-0">
          <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
            <div className="w-full h-full p-5">
              <div className="w-full h-full bg-asu-cream relative rounded-xl shadow-lg border-3 border-asu-gold overflow-hidden">
                {/* Main campus outline */}
                <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] bg-asu-cream border-2 border-gray-300 rounded-lg"></div>
                
                {/* Campus buildings - larger and more detailed */}
                <div className="absolute top-[20%] left-[45%] w-[25%] h-[15%] bg-asu-gold rounded-md shadow-md flex items-center justify-center transform hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-base">Memorial Union</span>
                </div>
                
                <div className="absolute top-[40%] left-[30%] w-[25%] h-[20%] bg-asu-maroon rounded-md shadow-md flex items-center justify-center transform hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-base">Hayden Library</span>
                </div>
                
                <div className="absolute top-[35%] left-[65%] w-[20%] h-[25%] bg-asu-blue rounded-md shadow-md flex items-center justify-center transform hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-base">Student Pavilion</span>
                </div>
                
                <div className="absolute top-[15%] left-[15%] w-[15%] h-[15%] bg-gray-300 rounded-md shadow-md flex items-center justify-center transform hover:scale-105 transition-transform">
                  <span className="text-gray-700 font-bold text-base">Old Main</span>
                </div>
                
                <div className="absolute top-[65%] left-[50%] w-[15%] h-[20%] bg-gray-300 rounded-md shadow-md flex items-center justify-center transform hover:scale-105 transition-transform">
                  <span className="text-gray-700 font-bold text-base">Sun Devil Stadium</span>
                </div>
                
                <div className="absolute top-[25%] left-[75%] w-[15%] h-[15%] bg-gray-300 rounded-md shadow-md flex items-center justify-center transform hover:scale-105 transition-transform">
                  <span className="text-gray-700 font-bold text-base">Counseling Services</span>
                </div>
                
                {/* Palm Walk - iconic campus feature */}
                <div className="absolute top-[15%] left-[55%] w-[4%] h-[70%] bg-green-700 flex flex-col items-center">
                  <div className="absolute top-[90%] w-[200%] text-center">
                    <span className="text-sm font-semibold bg-white px-3 py-1 rounded-md shadow-sm">Palm Walk</span>
                  </div>
                  
                  {/* Palm trees along the walk */}
                  {[10, 25, 40, 55, 70, 85].map((pos) => (
                    <div key={pos} className="absolute" style={{ top: `${pos}%` }}>
                      <div className="w-8 h-8 flex justify-center">
                        <div className="w-2 h-4 bg-brown-600 mt-4"></div>
                        <div className="absolute w-7 h-4 bg-green-500 rounded-full -mt-0.5"></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Major paths */}
                <div className="absolute top-[50%] left-[10%] w-[80%] h-[5px] bg-gray-400"></div>
                <div className="absolute top-[10%] left-[40%] w-[5px] h-[80%] bg-gray-400"></div>
                <div className="absolute top-[35%] left-[10%] w-[80%] h-[4px] bg-gray-400"></div>
                <div className="absolute top-[10%] left-[70%] w-[5px] h-[80%] bg-gray-400"></div>
                
                {/* Water feature */}
                <div className="absolute top-[65%] left-[15%] w-[20%] h-[15%] bg-blue-400 rounded-full opacity-80"></div>
                
                {/* Grass areas */}
                <div className="absolute top-[25%] left-[20%] w-[15%] h-[15%] bg-green-600 rounded-lg opacity-40"></div>
                <div className="absolute top-[50%] left-[60%] w-[25%] h-[10%] bg-green-600 rounded-lg opacity-40"></div>
                
                {/* Compass */}
                <div className="absolute top-[15px] right-[15px] w-[70px] h-[70px] bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg border border-gray-200">
                  <div className="relative w-[50px] h-[50px]">
                    <div className="absolute top-0 left-[50%] transform -translate-x-1/2 text-sm font-bold">N</div>
                    <div className="absolute bottom-0 left-[50%] transform -translate-x-1/2 text-sm font-bold">S</div>
                    <div className="absolute top-[50%] right-0 transform -translate-y-1/2 text-sm font-bold">E</div>
                    <div className="absolute top-[50%] left-0 transform -translate-y-1/2 text-sm font-bold">W</div>
                    <div className="absolute w-[1px] h-[50px] bg-gray-500 left-[50%]"></div>
                    <div className="absolute w-[50px] h-[1px] bg-gray-500 top-[50%]"></div>
                    <div className="absolute w-[10px] h-[10px] bg-red-500 rounded-full top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-[15px] left-[15px] bg-white bg-opacity-95 p-3 rounded-md shadow-lg border border-gray-200">
                  <div className="text-sm font-bold mb-2 text-asu-maroon">Map Legend</div>
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 bg-asu-maroon mr-2 rounded-sm"></div>
                    <span className="text-sm">Main Buildings</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-4 h-4 bg-gray-400 mr-2 rounded-sm"></div>
                    <span className="text-sm">Paths</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-600 opacity-60 mr-2 rounded-sm"></div>
                    <span className="text-sm">Green Spaces</span>
                  </div>
                </div>
                
                {/* Scale */}
                <div className="absolute bottom-[15px] right-[15px] bg-white bg-opacity-95 px-3 py-2 rounded-md shadow-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-[60px] h-[3px] bg-black"></div>
                    <span className="text-sm ml-2 font-medium">500m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-5 left-5 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl z-10 border-l-4 border-asu-maroon">
          <h3 className="text-xl font-bold mb-3 text-asu-maroon">ASU Tempe Campus</h3>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-3">Tap on markers to see emotion data and resources</p>
          <div className="flex flex-wrap gap-3">
            {emotions.map(emotion => (
              <div key={emotion.id} className="flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                <span className="mr-2 text-lg">{emotion.icon}</span>
                <span className="text-sm font-medium">{emotion.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Location Markers */}
        {filteredLocations.map(location => {
          const topEmotion = getTopEmotion(location);
          const emotionColor = getEmotionColor(topEmotion);
          
          return (
            <motion.div
              key={location.id}
              className="absolute cursor-pointer z-20"
              style={{ left: `${location.coordinates.x}%`, top: `${location.coordinates.y}%` }}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setSelectedLocation(location.id);
                setShowDetails(true);
              }}
            >
              <div className="relative">
                <FaMapMarkerAlt className={`text-5xl ${emotionColor} drop-shadow-lg`} />
                <div className={`absolute -bottom-1 -right-1 rounded-full w-6 h-6 ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                } flex items-center justify-center shadow-md`}>
                  {getEmotionIcon(topEmotion)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Location Details */}
      {showDetails && selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-5 p-5 rounded-lg ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
          }`}
        >
          {(() => {
            const location = locations.find(loc => loc.id === selectedLocation);
            if (!location) return null;
            
            return (
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-asu-maroon">{location.name}</h3>
                  <button 
                    className="text-gray-500 text-2xl hover:text-gray-700 transition-colors"
                    onClick={() => setShowDetails(false)}
                  >
                    ×
                  </button>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-5 mt-2">{location.description}</p>
                
                {location.resources && (
                  <div className="mb-5 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg text-asu-maroon mb-3">Available Resources:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {location.resources.map((resource, idx) => (
                        <li key={idx} className="text-base text-gray-600 dark:text-gray-300">{resource}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mb-5 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg text-asu-maroon mb-3">Community Emotional Experience:</h4>
                  <div className="grid grid-cols-5 gap-3">
                    {emotions.map(emotion => {
                      const value = location.emotions[emotion.id as keyof typeof location.emotions];
                      return (
                        <div key={emotion.id} className="text-center bg-white dark:bg-gray-600 p-3 rounded-lg shadow-sm">
                          <div className="flex flex-col items-center">
                            <div className="text-2xl mb-1">{emotion.icon}</div>
                            <div className="text-base font-semibold">{emotion.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-300 mt-1">{value} users</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {showAddEmotion ? (
                  <div className="mt-5 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-lg text-asu-maroon mb-3">Share Your Experience:</h4>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      {emotions.map(emotion => (
                        <button
                          key={emotion.id}
                          className={`p-3 rounded-lg flex flex-col items-center ${
                            selectedEmotion === emotion.id
                              ? 'bg-asu-maroon bg-opacity-10 border-2 border-asu-maroon'
                              : isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-50 border border-gray-200'
                          } transition-colors`}
                          onClick={() => setSelectedEmotion(emotion.id)}
                        >
                          <div className="text-2xl mb-1">{emotion.icon}</div>
                          <div className="text-sm font-medium mt-1">{emotion.name}</div>
                        </button>
                      ))}
                    </div>
                    <textarea
                      className={`w-full p-4 rounded-lg mb-4 text-base ${
                        isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border border-gray-300'
                      }`}
                      rows={3}
                      placeholder="Share your story about this location (optional)"
                      value={userStory}
                      onChange={(e) => setUserStory(e.target.value)}
                    ></textarea>
                    <div className="flex space-x-3">
                      <button
                        className="px-5 py-3 bg-asu-maroon text-white rounded-lg hover:bg-opacity-90 font-medium text-base shadow-md transition-colors"
                        onClick={handleAddEmotion}
                      >
                        Submit
                      </button>
                      <button
                        className="px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-base transition-colors"
                        onClick={() => setShowAddEmotion(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="px-5 py-3 bg-asu-blue text-white rounded-lg hover:bg-opacity-90 font-medium text-base shadow-md transition-colors"
                    onClick={() => setShowAddEmotion(true)}
                  >
                    Add Your Emotion
                  </button>
                )}
              </div>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
};

export default WellnessMap; 