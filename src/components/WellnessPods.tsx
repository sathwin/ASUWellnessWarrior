import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaLock, FaHeart, FaComments, FaUserCircle, FaSearch } from 'react-icons/fa';

interface Pod {
  id: string;
  name: string;
  description: string;
  topic: string;
  memberCount: number;
  isActive: boolean;
  nextSession: string;
  privacy: 'anonymous' | 'semi-private' | 'private';
}

interface WellnessPodsProps {
  isDarkMode: boolean;
}

const WellnessPods: React.FC<WellnessPodsProps> = ({ isDarkMode }) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const pods: Pod[] = [
    {
      id: '1',
      name: 'Stress Management Pod',
      description: 'Share and learn stress management techniques',
      topic: 'stress',
      memberCount: 12,
      isActive: true,
      nextSession: 'Today, 3:00 PM',
      privacy: 'anonymous'
    },
    {
      id: '2',
      name: 'Academic Balance',
      description: 'Discuss work-life balance and study strategies',
      topic: 'academic',
      memberCount: 8,
      isActive: false,
      nextSession: 'Tomorrow, 2:00 PM',
      privacy: 'semi-private'
    },
    {
      id: '3',
      name: 'Social Connection',
      description: 'Build meaningful connections with peers',
      topic: 'social',
      memberCount: 15,
      isActive: true,
      nextSession: 'Today, 4:00 PM',
      privacy: 'anonymous'
    },
    {
      id: '4',
      name: 'Personal Growth',
      description: 'Share experiences and personal development tips',
      topic: 'growth',
      memberCount: 10,
      isActive: false,
      nextSession: 'Tomorrow, 5:00 PM',
      privacy: 'private'
    }
  ];

  const filteredPods = pods.filter(pod => {
    const matchesSearch = pod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || pod.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const getPrivacyIcon = (privacy: Pod['privacy']) => {
    switch (privacy) {
      case 'anonymous':
        return <FaLock className="text-green-500" />;
      case 'semi-private':
        return <FaLock className="text-yellow-500" />;
      case 'private':
        return <FaLock className="text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-asu-maroon mb-4">Wellness Pods</h2>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search pods..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className={`px-4 py-2 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
          }`}
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="all">All Topics</option>
          <option value="stress">Stress Management</option>
          <option value="academic">Academic Balance</option>
          <option value="social">Social Connection</option>
          <option value="growth">Personal Growth</option>
        </select>
      </div>

      {/* Pod Cards */}
      <div className="grid gap-4">
        {filteredPods.map((pod) => (
          <motion.div
            key={pod.id}
            className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-full bg-asu-maroon text-white">
                <FaUsers className="text-2xl" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{pod.name}</h3>
                  <div className="flex items-center space-x-2">
                    {getPrivacyIcon(pod.privacy)}
                    <span className={`text-sm ${
                      pod.isActive ? 'text-green-500' : 'text-gray-500'
                    }`}>
                      {pod.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {pod.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <FaUserCircle />
                    <span>{pod.memberCount} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaComments />
                    <span>Next session: {pod.nextSession}</span>
                  </div>
                </div>
                <button
                  className={`mt-3 px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-asu-maroon hover:bg-asu-gold'
                  } text-white transition-colors`}
                >
                  Join Pod
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WellnessPods; 