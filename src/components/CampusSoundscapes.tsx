import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

interface Soundscape {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: string;
  volume: number;
  isPlaying: boolean;
}

interface CampusSoundscapesProps {
  isDarkMode: boolean;
}

const CampusSoundscapes: React.FC<CampusSoundscapesProps> = ({ isDarkMode }) => {
  const [soundscapes, setSoundscapes] = useState<Soundscape[]>([
    {
      id: '1',
      name: 'Palm Walk Ambience',
      description: 'Gentle breeze through palm trees and distant student chatter',
      icon: '🌴',
      duration: '30:00',
      volume: 0.7,
      isPlaying: false
    },
    {
      id: '2',
      name: 'Hayden Library',
      description: 'Soft keyboard typing and page turning sounds',
      icon: '📚',
      duration: '45:00',
      volume: 0.5,
      isPlaying: false
    },
    {
      id: '3',
      name: 'Memorial Union',
      description: 'Cafeteria ambiance and social gathering sounds',
      icon: '🏛️',
      duration: '20:00',
      volume: 0.6,
      isPlaying: false
    },
    {
      id: '4',
      name: 'ASU Gammage',
      description: 'Orchestral warm-up and performance ambiance',
      icon: '🎭',
      duration: '60:00',
      volume: 0.4,
      isPlaying: false
    }
  ]);

  const togglePlay = (id: string) => {
    setSoundscapes(soundscapes.map(soundscape => 
      soundscape.id === id 
        ? { ...soundscape, isPlaying: !soundscape.isPlaying }
        : soundscape
    ));
  };

  const adjustVolume = (id: string, newVolume: number) => {
    setSoundscapes(soundscapes.map(soundscape => 
      soundscape.id === id 
        ? { ...soundscape, volume: newVolume }
        : soundscape
    ));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-asu-maroon mb-4">Campus Soundscapes</h2>
      
      <div className="grid gap-4">
        {soundscapes.map((soundscape) => (
          <motion.div
            key={soundscape.id}
            className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start space-x-4">
              <div className="text-4xl">{soundscape.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{soundscape.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {soundscape.description}
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => togglePlay(soundscape.id)}
                    className={`p-2 rounded-full ${
                      soundscape.isPlaying 
                        ? 'bg-asu-gold text-asu-maroon' 
                        : 'bg-asu-maroon text-white'
                    }`}
                  >
                    {soundscape.isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <div className="flex items-center space-x-2">
                    <FaVolumeUp className="text-gray-500" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={soundscape.volume}
                      onChange={(e) => adjustVolume(soundscape.id, parseFloat(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">
                      {Math.round(soundscape.volume * 100)}%
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {soundscape.duration}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CampusSoundscapes; 