import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: Date;
}

interface AchievementsTrackerProps {
  achievements: Achievement[];
  isDarkMode: boolean;
}

const AchievementsTracker: React.FC<AchievementsTrackerProps> = ({ achievements, isDarkMode }) => {
  const [selectedTab, setSelectedTab] = useState<'unlocked' | 'locked'>('unlocked');

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-asu-maroon">Achievements</h3>
      
      <div className="flex space-x-2 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            selectedTab === 'unlocked'
              ? 'bg-asu-maroon text-white'
              : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}
          onClick={() => setSelectedTab('unlocked')}
        >
          Unlocked ({unlockedAchievements.length})
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            selectedTab === 'locked'
              ? 'bg-asu-maroon text-white'
              : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}
          onClick={() => setSelectedTab('locked')}
        >
          Locked ({lockedAchievements.length})
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(selectedTab === 'unlocked' ? unlockedAchievements : lockedAchievements).map(achievement => (
          <motion.div
            key={achievement.id}
            className={`p-4 rounded-xl ${
              isDarkMode
                ? 'bg-gray-700'
                : achievement.unlocked ? 'bg-white shadow-md' : 'bg-gray-100'
            }`}
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start">
              <div className={`text-3xl mr-3 ${achievement.unlocked ? '' : 'opacity-40'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h4 className={`font-bold ${
                  achievement.unlocked 
                    ? 'text-asu-maroon' 
                    : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h4>
                <p className={`text-sm ${
                  achievement.unlocked
                    ? isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    : 'text-gray-500'
                }`}>
                  {achievement.description}
                </p>
                {achievement.unlocked && achievement.date && (
                  <p className="text-xs text-asu-blue mt-2">
                    Unlocked on {formatDate(achievement.date)}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {unlockedAchievements.length === 0 && selectedTab === 'unlocked' && (
        <div className="text-center py-6">
          <p className="text-gray-500">Complete activities to unlock achievements!</p>
        </div>
      )}
      
      {lockedAchievements.length === 0 && selectedTab === 'locked' && (
        <div className="text-center py-6">
          <p className="text-gray-500">You've unlocked all achievements! Great job!</p>
        </div>
      )}
    </div>
  );
};

export default AchievementsTracker; 