import React from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaHeart, FaStar, FaShieldAlt, FaLightbulb } from 'react-icons/fa';

interface WellnessWarriorProps {
  level: number;
  streak: number;
  points: number;
  achievements: string[];
  isDarkMode: boolean;
}

type AvatarFeature = 'base' | 'glow' | 'wings' | 'crown' | 'aura';

const WellnessWarrior: React.FC<WellnessWarriorProps> = ({
  level,
  streak,
  points,
  achievements,
  isDarkMode
}) => {
  const getAvatarFeatures = (): AvatarFeature[] => {
    const features: AvatarFeature[] = [];
    if (level >= 1) features.push('base');
    if (level >= 2) features.push('glow');
    if (level >= 3) features.push('wings');
    if (level >= 4) features.push('crown');
    if (level >= 5) features.push('aura');
    return features;
  };

  const getAvatarColor = () => {
    if (level >= 5) return 'from-purple-500 to-pink-500';
    if (level >= 3) return 'from-blue-500 to-purple-500';
    return 'from-asu-maroon to-asu-gold';
  };

  return (
    <div className="relative">
      <motion.div
        className={`w-48 h-48 mx-auto rounded-full bg-gradient-to-br ${getAvatarColor()} p-1`}
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className={`w-full h-full rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} flex items-center justify-center`}>
          <FaBrain className="text-6xl text-asu-maroon" />
        </div>
      </motion.div>

      {/* Level Badge */}
      <div className="absolute -top-4 -right-4 bg-asu-gold text-asu-maroon rounded-full w-8 h-8 flex items-center justify-center font-bold">
        {level}
      </div>

      {/* Stats */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaStar className="text-yellow-400" />
            <span className="text-sm">Level {level}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaHeart className="text-red-400" />
            <span className="text-sm">{streak} day streak</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaShieldAlt className="text-blue-400" />
            <span className="text-sm">{points} points</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaLightbulb className="text-green-400" />
            <span className="text-sm">{achievements.length} achievements</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-4 flex justify-center space-x-2">
        {getAvatarFeatures().map((feature, index) => (
          <motion.div
            key={feature}
            className="w-2 h-2 rounded-full bg-asu-gold"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WellnessWarrior; 