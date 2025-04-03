import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGamepad, FaPuzzlePiece, FaFont, FaQuestionCircle, FaBrain, FaLightbulb } from 'react-icons/fa';
import MemoryGame from './MemoryGame';
import WordScramble from './WordScramble';
import PatternRecognition from './PatternRecognition';
import PuzzleGame from './PuzzleGame';

interface GameSelectorProps {
  onGameComplete: (score: number) => void;
  isDarkMode: boolean;
}

interface Game {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  benefits: string;
  component: React.ReactNode;
  category?: string;
}

const GameSelector: React.FC<GameSelectorProps> = ({ onGameComplete, isDarkMode }) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleGameComplete = (score: number) => {
    // Apply difficulty multiplier
    const multiplier = difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.5 : 1;
    const finalScore = Math.round(score * multiplier);
    
    onGameComplete(finalScore);
    
    // Reset selected game after a delay
    setTimeout(() => {
      setSelectedGame(null);
    }, 2000);
  };

  const games: Game[] = [
    {
      id: 'memory',
      name: 'Memory Match',
      description: 'Pair matching cards to test and improve your memory',
      icon: <FaGamepad className="text-3xl text-asu-maroon" />,
      benefits: 'Improves short-term memory, focus, and concentration. Great for reducing stress and anxiety.',
      component: <MemoryGame onComplete={handleGameComplete} isDarkMode={isDarkMode} />,
      category: 'focus'
    },
    {
      id: 'word',
      name: 'Word Scramble',
      description: 'Unscramble words related to wellness and mental health',
      icon: <FaFont className="text-3xl text-asu-blue" />,
      benefits: 'Enhances vocabulary, language processing, and cognitive flexibility. Helps maintain verbal skills.',
      component: <WordScramble onComplete={handleGameComplete} isDarkMode={isDarkMode} />,
      category: 'language'
    },
    {
      id: 'pattern',
      name: 'Pattern Recognition',
      description: 'Find patterns in sequences of images and shapes',
      icon: <FaPuzzlePiece className="text-3xl text-asu-orange" />,
      benefits: 'Builds logical thinking, pattern recognition, and problem-solving skills. Improves analytical abilities.',
      component: <PatternRecognition onComplete={handleGameComplete} isDarkMode={isDarkMode} />,
      category: 'analysis'
    },
    {
      id: 'puzzle',
      name: 'Spatial Puzzle',
      description: 'Solve puzzles to exercise your spatial reasoning skills',
      icon: <FaBrain className="text-3xl text-asu-gold" />,
      benefits: 'Develops spatial awareness, problem-solving, and mental rotation abilities. Strengthens visual processing.',
      component: <PuzzleGame onComplete={handleGameComplete} isDarkMode={isDarkMode} />,
      category: 'spatial'
    }
  ];

  // Game categories for filtering
  const categories = [
    { id: 'focus', name: 'Focus & Memory', icon: <FaGamepad className="mr-2" /> },
    { id: 'language', name: 'Language Skills', icon: <FaFont className="mr-2" /> },
    { id: 'analysis', name: 'Analytical Thinking', icon: <FaPuzzlePiece className="mr-2" /> },
    { id: 'spatial', name: 'Spatial Reasoning', icon: <FaBrain className="mr-2" /> }
  ];

  // Filter games by category if one is selected
  const filteredGames = selectedCategory 
    ? games.filter(game => game.category === selectedCategory)
    : games;

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    
    return (
      <div>
        <button 
          onClick={() => setSelectedGame(null)}
          className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
        >
          <span className="mr-2">←</span> Back to Games
        </button>
        
        <div className="mb-4">
          <h3 className="text-xl font-bold">{game?.name}</h3>
          <p className="text-gray-600 dark:text-gray-300">{game?.description}</p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Difficulty:</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setDifficulty('easy')}
              className={`px-4 py-2 rounded-lg ${
                difficulty === 'easy' 
                  ? 'bg-asu-blue text-white' 
                  : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => setDifficulty('medium')}
              className={`px-4 py-2 rounded-lg ${
                difficulty === 'medium' 
                  ? 'bg-asu-maroon text-white' 
                  : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setDifficulty('hard')}
              className={`px-4 py-2 rounded-lg ${
                difficulty === 'hard' 
                  ? 'bg-asu-orange text-white' 
                  : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            >
              Hard
            </button>
          </div>
        </div>
        
        {game?.component}
      </div>
    );
  }

  return (
    <div>
      {/* Category filter buttons */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">Filter by Skill Type</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full flex items-center ${
              selectedCategory === null
                ? 'bg-asu-maroon text-white'
                : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All Skills
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full flex items-center ${
                selectedCategory === category.id
                  ? 'bg-asu-maroon text-white'
                  : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Games grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <motion.div
            key={game.id}
            className={`p-6 rounded-xl cursor-pointer shadow-md ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-asu-cream hover:bg-opacity-80'
            }`}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedGame(game.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 rounded-lg bg-white dark:bg-gray-800">
                {game.icon}
              </div>
              <button 
                className="text-gray-500 hover:text-asu-maroon"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(showTooltip === game.id ? null : game.id);
                }}
              >
                <FaQuestionCircle />
              </button>
            </div>
            <h3 className="text-lg font-bold mb-1">{game.name}</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {game.description}
            </p>
            
            {showTooltip === game.id && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-3 p-3 rounded-lg text-sm ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'
                }`}
              >
                <h4 className="font-bold text-asu-maroon mb-1">Cognitive Benefits:</h4>
                <p>{game.benefits}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Benefits section */}
      <div className="mt-8 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
        <h3 className="text-lg font-bold text-asu-maroon mb-3 flex items-center">
          <FaLightbulb className="mr-2 text-asu-gold" /> Brain Training Benefits
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Regular brain training can improve cognitive function and help manage stress and anxiety. These games are designed to:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
          <li>Enhance focus and attention</li>
          <li>Improve memory retention</li>
          <li>Develop problem-solving skills</li>
          <li>Reduce stress through mindful engagement</li>
          <li>Build cognitive resilience</li>
        </ul>
      </div>
    </div>
  );
};

export default GameSelector; 