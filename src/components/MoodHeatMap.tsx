import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaSmile, FaSadTear, FaMeh, FaHeartbeat, FaExclamationTriangle } from 'react-icons/fa';

interface MoodHeatMapProps {
  isDarkMode: boolean;
}

interface MoodData {
  date: string;
  moods: {
    happy: number;
    sad: number;
    neutral: number;
    love: number;
    stress: number;
  };
  locations: {
    [key: string]: {
      happy: number;
      sad: number;
      neutral: number;
      love: number;
      stress: number;
    };
  };
}

const MoodHeatMap: React.FC<MoodHeatMapProps> = ({ isDarkMode }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [showDetails, setShowDetails] = useState(false);

  // Placeholder data for the mood heatmap
  const moodData: MoodData[] = [
    {
      date: '2023-11-27',
      moods: {
        happy: 65,
        sad: 15,
        neutral: 40,
        love: 25,
        stress: 55
      },
      locations: {
        'Hayden Library': {
          happy: 35,
          sad: 20,
          neutral: 45,
          love: 15,
          stress: 75
        },
        'Memorial Union': {
          happy: 80,
          sad: 10,
          neutral: 30,
          love: 45,
          stress: 25
        },
        'Palm Walk': {
          happy: 85,
          sad: 5,
          neutral: 25,
          love: 60,
          stress: 15
        },
        'Student Pavilion': {
          happy: 70,
          sad: 15,
          neutral: 40,
          love: 30,
          stress: 35
        },
        'Tempe Marketplace': {
          happy: 75,
          sad: 10,
          neutral: 35,
          love: 40,
          stress: 30
        }
      }
    },
    {
      date: '2023-11-28',
      moods: {
        happy: 55,
        sad: 25,
        neutral: 45,
        love: 20,
        stress: 65
      },
      locations: {
        'Hayden Library': {
          happy: 30,
          sad: 25,
          neutral: 40,
          love: 10,
          stress: 85
        },
        'Memorial Union': {
          happy: 75,
          sad: 15,
          neutral: 35,
          love: 40,
          stress: 30
        },
        'Palm Walk': {
          happy: 80,
          sad: 10,
          neutral: 30,
          love: 55,
          stress: 20
        },
        'Student Pavilion': {
          happy: 65,
          sad: 20,
          neutral: 45,
          love: 25,
          stress: 40
        },
        'Tempe Marketplace': {
          happy: 70,
          sad: 15,
          neutral: 40,
          love: 35,
          stress: 35
        }
      }
    },
    {
      date: '2023-11-29',
      moods: {
        happy: 45,
        sad: 35,
        neutral: 50,
        love: 15,
        stress: 75
      },
      locations: {
        'Hayden Library': {
          happy: 25,
          sad: 30,
          neutral: 35,
          love: 5,
          stress: 95
        },
        'Memorial Union': {
          happy: 70,
          sad: 20,
          neutral: 40,
          love: 35,
          stress: 35
        },
        'Palm Walk': {
          happy: 75,
          sad: 15,
          neutral: 35,
          love: 50,
          stress: 25
        },
        'Student Pavilion': {
          happy: 60,
          sad: 25,
          neutral: 50,
          love: 20,
          stress: 45
        },
        'Tempe Marketplace': {
          happy: 65,
          sad: 20,
          neutral: 45,
          love: 30,
          stress: 40
        }
      }
    }
  ];

  // Get aggregate mood data based on selected timeframe
  const getAggregatedMoodData = () => {
    // For demo purposes, we'll just use the first entry
    let data = moodData[0];
    
    if (selectedTimeframe === 'day') {
      data = moodData[0];
    } else if (selectedTimeframe === 'week') {
      // Simulate aggregated data for a week
      data = {
        date: 'Week of Nov 27 - Dec 3, 2023',
        moods: {
          happy: 55,
          sad: 25,
          neutral: 45,
          love: 20,
          stress: 65
        },
        locations: {
          'Hayden Library': {
            happy: 30,
            sad: 25,
            neutral: 40,
            love: 10,
            stress: 85
          },
          'Memorial Union': {
            happy: 75,
            sad: 15,
            neutral: 35,
            love: 40,
            stress: 30
          },
          'Palm Walk': {
            happy: 80,
            sad: 10,
            neutral: 30,
            love: 55,
            stress: 20
          },
          'Student Pavilion': {
            happy: 65,
            sad: 20,
            neutral: 45,
            love: 25,
            stress: 40
          },
          'Tempe Marketplace': {
            happy: 70,
            sad: 15,
            neutral: 40,
            love: 35,
            stress: 35
          }
        }
      };
    } else if (selectedTimeframe === 'month') {
      // Simulate aggregated data for a month
      data = {
        date: 'November 2023',
        moods: {
          happy: 60,
          sad: 20,
          neutral: 40,
          love: 30,
          stress: 50
        },
        locations: {
          'Hayden Library': {
            happy: 40,
            sad: 20,
            neutral: 35,
            love: 15,
            stress: 70
          },
          'Memorial Union': {
            happy: 85,
            sad: 5,
            neutral: 25,
            love: 50,
            stress: 20
          },
          'Palm Walk': {
            happy: 90,
            sad: 5,
            neutral: 20,
            love: 65,
            stress: 10
          },
          'Student Pavilion': {
            happy: 75,
            sad: 10,
            neutral: 35,
            love: 35,
            stress: 30
          },
          'Tempe Marketplace': {
            happy: 80,
            sad: 5,
            neutral: 30,
            love: 45,
            stress: 25
          }
        }
      };
    }
    
    return data;
  };

  const moodIcons = {
    happy: <FaSmile className="text-yellow-400 text-2xl" />,
    sad: <FaSadTear className="text-blue-400 text-2xl" />,
    neutral: <FaMeh className="text-gray-400 text-2xl" />,
    love: <FaHeartbeat className="text-red-400 text-2xl" />,
    stress: <FaExclamationTriangle className="text-orange-400 text-2xl" />
  };

  const getDominantMood = (moods: Record<string, number>) => {
    let maxMood = '';
    let maxValue = 0;
    
    for (const [mood, value] of Object.entries(moods)) {
      if (value > maxValue) {
        maxMood = mood;
        maxValue = value;
      }
    }
    
    return maxMood;
  };

  const data = getAggregatedMoodData();
  const dominantMood = getDominantMood(data.moods);

  return (
    <div className="relative">
      <h3 className="text-2xl font-bold mb-4 text-asu-maroon">ASU Community Mood Map</h3>
      
      <div className="mb-6">
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setSelectedTimeframe('day')}
            className={`px-4 py-2 rounded-lg ${
              selectedTimeframe === 'day'
                ? 'bg-asu-maroon text-white'
                : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setSelectedTimeframe('week')}
            className={`px-4 py-2 rounded-lg ${
              selectedTimeframe === 'week'
                ? 'bg-asu-maroon text-white'
                : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setSelectedTimeframe('month')}
            className={`px-4 py-2 rounded-lg ${
              selectedTimeframe === 'month'
                ? 'bg-asu-maroon text-white'
                : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            This Month
          </button>
        </div>
        
        <div className={`p-6 rounded-xl mb-4 ${
          isDarkMode ? 'bg-gray-700' : 'bg-asu-cream'
        }`}>
          <div className="flex items-center mb-3">
            <FaCalendarAlt className="text-asu-maroon mr-2" />
            <h4 className="text-xl font-semibold">{data.date}</h4>
          </div>
          
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(data.moods).map(([mood, value]) => (
              <div key={mood} className="text-center">
                <div className="flex flex-col items-center">
                  <div className="mb-2">
                    {moodIcons[mood as keyof typeof moodIcons]}
                  </div>
                  <div className="text-lg font-semibold capitalize">
                    {mood}
                  </div>
                  <div className="mt-2 text-lg">
                    {value}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-1 dark:bg-gray-600">
                    <div
                      className={`h-3 rounded-full ${
                        mood === 'happy' ? 'bg-yellow-400' :
                        mood === 'sad' ? 'bg-blue-400' :
                        mood === 'neutral' ? 'bg-gray-400' :
                        mood === 'love' ? 'bg-red-400' :
                        'bg-orange-400'
                      }`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-lg">
              {selectedTimeframe === 'day' 
                ? 'Today, the ASU community is feeling ' 
                : selectedTimeframe === 'week'
                  ? 'This week, the ASU community is feeling '
                  : 'This month, the ASU community is feeling '}
              <span className="font-bold">
                {dominantMood === 'happy' ? 'happy and energetic' :
                 dominantMood === 'sad' ? 'a bit down' :
                 dominantMood === 'neutral' ? 'balanced' :
                 dominantMood === 'love' ? 'connected and supported' :
                 'stressed and under pressure'}
              </span>
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-4 py-2 bg-asu-maroon text-white rounded-lg hover:bg-opacity-90 flex items-center justify-center"
          >
            {showDetails ? 'Hide Location Details' : 'Show Location Details'}
          </button>
        </div>
        
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4">
              {Object.entries(data.locations).map(([location, moods]) => {
                const locationDominantMood = getDominantMood(moods);
                
                return (
                  <div
                    key={location}
                    className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700' : 'bg-white shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-lg font-semibold">{location}</h4>
                      <div>
                        {moodIcons[locationDominantMood as keyof typeof moodIcons]}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2">
                      {Object.entries(moods).map(([mood, value]) => (
                        <div key={mood} className="text-center">
                          <div className="text-sm capitalize">{mood}</div>
                          <div className="text-sm font-semibold">{value}%</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                            <div
                              className={`h-2 rounded-full ${
                                mood === 'happy' ? 'bg-yellow-400' :
                                mood === 'sad' ? 'bg-blue-400' :
                                mood === 'neutral' ? 'bg-gray-400' :
                                mood === 'love' ? 'bg-red-400' :
                                'bg-orange-400'
                              }`}
                              style={{ width: `${value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          This data represents aggregated, anonymized emotional experiences reported by ASU community members.
        </p>
      </div>
    </div>
  );
};

export default MoodHeatMap; 