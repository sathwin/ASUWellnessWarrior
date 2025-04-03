import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaGraduationCap, FaBook, FaLightbulb, FaHeart } from 'react-icons/fa';

interface Wisdom {
  id: string;
  quote: string;
  author: string;
  department: string;
  category: 'academic' | 'life' | 'motivation' | 'wellness';
  likes: number;
  isLiked: boolean;
}

interface ProfessorWisdomProps {
  isDarkMode: boolean;
}

const ProfessorWisdom: React.FC<ProfessorWisdomProps> = ({ isDarkMode }) => {
  const [wisdom, setWisdom] = useState<Wisdom[]>([
    {
      id: '1',
      quote: "Success is not about perfection, but about progress. Every small step forward is a victory worth celebrating.",
      author: "Dr. Sarah Chen",
      department: "Psychology",
      category: "motivation",
      likes: 128,
      isLiked: false
    },
    {
      id: '2',
      quote: "Your mental health is just as important as your academic success. Take time to care for yourself.",
      author: "Dr. Michael Rodriguez",
      department: "Counseling",
      category: "wellness",
      likes: 256,
      isLiked: false
    },
    {
      id: '3',
      quote: "The best learning happens when you're curious and engaged, not when you're stressed and overwhelmed.",
      author: "Dr. Emily Thompson",
      department: "Education",
      category: "academic",
      likes: 192,
      isLiked: false
    },
    {
      id: '4',
      quote: "Remember that your worth is not defined by your grades or achievements, but by who you are as a person.",
      author: "Dr. James Wilson",
      department: "Philosophy",
      category: "life",
      likes: 164,
      isLiked: false
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleLike = (id: string) => {
    setWisdom(wisdom.map(item => 
      item.id === id 
        ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 }
        : item
    ));
  };

  const filteredWisdom = wisdom.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const getCategoryIcon = (category: Wisdom['category']) => {
    switch (category) {
      case 'academic':
        return <FaBook className="text-blue-500" />;
      case 'life':
        return <FaGraduationCap className="text-purple-500" />;
      case 'motivation':
        return <FaLightbulb className="text-yellow-500" />;
      case 'wellness':
        return <FaHeart className="text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-asu-maroon mb-4">Professor Wisdom</h2>
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full ${
            selectedCategory === 'all'
              ? 'bg-asu-maroon text-white'
              : isDarkMode
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-100 text-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setSelectedCategory('academic')}
          className={`px-4 py-2 rounded-full ${
            selectedCategory === 'academic'
              ? 'bg-asu-maroon text-white'
              : isDarkMode
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-100 text-gray-700'
          }`}
        >
          Academic
        </button>
        <button
          onClick={() => setSelectedCategory('life')}
          className={`px-4 py-2 rounded-full ${
            selectedCategory === 'life'
              ? 'bg-asu-maroon text-white'
              : isDarkMode
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-100 text-gray-700'
          }`}
        >
          Life
        </button>
        <button
          onClick={() => setSelectedCategory('motivation')}
          className={`px-4 py-2 rounded-full ${
            selectedCategory === 'motivation'
              ? 'bg-asu-maroon text-white'
              : isDarkMode
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-100 text-gray-700'
          }`}
        >
          Motivation
        </button>
        <button
          onClick={() => setSelectedCategory('wellness')}
          className={`px-4 py-2 rounded-full ${
            selectedCategory === 'wellness'
              ? 'bg-asu-maroon text-white'
              : isDarkMode
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-100 text-gray-700'
          }`}
        >
          Wellness
        </button>
      </div>

      {/* Wisdom Cards */}
      <div className="grid gap-4">
        {filteredWisdom.map((item) => (
          <motion.div
            key={item.id}
            className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl text-asu-maroon">
                <FaQuoteLeft />
              </div>
              <div className="flex-1">
                <p className="text-lg mb-3">{item.quote}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{item.author}</p>
                    <p className="text-sm text-gray-500">{item.department}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(item.category)}
                    <button
                      onClick={() => toggleLike(item.id)}
                      className={`flex items-center space-x-1 ${
                        item.isLiked ? 'text-red-500' : 'text-gray-500'
                      }`}
                    >
                      <FaHeart />
                      <span>{item.likes}</span>
                    </button>
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

export default ProfessorWisdom; 