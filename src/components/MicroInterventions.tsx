import React from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaCalendarAlt, FaLightbulb, FaHeart, FaBrain } from 'react-icons/fa';

interface MicroIntervention {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  color: string;
  schedule: {
    time: string;
    days: string[];
  };
}

interface MicroInterventionsProps {
  isDarkMode: boolean;
}

const MicroInterventions: React.FC<MicroInterventionsProps> = ({ isDarkMode }) => {
  const interventions: MicroIntervention[] = [
    {
      id: '1',
      title: 'Morning Mindfulness',
      description: 'Start your day with a 5-minute guided meditation',
      duration: '5 min',
      icon: <FaBrain className="text-2xl" />,
      color: 'bg-blue-500',
      schedule: {
        time: '8:00 AM',
        days: ['Monday', 'Wednesday', 'Friday']
      }
    },
    {
      id: '2',
      title: 'Stress Relief Break',
      description: 'Quick breathing exercises between classes',
      duration: '3 min',
      icon: <FaHeart className="text-2xl" />,
      color: 'bg-red-500',
      schedule: {
        time: '11:00 AM',
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      }
    },
    {
      id: '3',
      title: 'Study Motivation',
      description: 'Positive affirmations and study tips',
      duration: '2 min',
      icon: <FaLightbulb className="text-2xl" />,
      color: 'bg-yellow-500',
      schedule: {
        time: '2:00 PM',
        days: ['Monday', 'Wednesday', 'Friday']
      }
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-asu-maroon mb-4">Daily Wellness Moments</h2>
      <div className="grid gap-4">
        {interventions.map((intervention) => (
          <motion.div
            key={intervention.id}
            className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start space-x-4">
              <div className={`${intervention.color} p-3 rounded-full text-white`}>
                {intervention.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{intervention.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {intervention.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <FaClock />
                    <span>{intervention.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaCalendarAlt />
                    <span>{intervention.schedule.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MicroInterventions; 