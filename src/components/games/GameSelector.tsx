import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGamepad, FaPuzzlePiece, FaFont, FaQuestionCircle } from 'react-icons/fa';
import MemoryGame from './MemoryGame';

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
}

const GameSelector: React.FC<GameSelectorProps> = ({ onGameComplete, isDarkMode }) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

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
      component: <MemoryGame onComplete={handleGameComplete} isDarkMode={isDarkMode} />
    },
    {
      id: 'word',
      name: 'Word Scramble',
      description: 'Unscramble words related to wellness and mental health',
      icon: <FaFont className="text-3xl text-asu-blue" />,
      benefits: 'Enhances vocabulary, language processing, and cognitive flexibility. Helps maintain verbal skills.',
      component: <div className="p-6 text-center">
        <h3 className="text-xl font-bold mb-4">Coming Soon!</h3>
        <p>This game is currently in development.</p>
      </div>
    },
    {
      id: 'pattern',
      name: 'Pattern Recognition',
      description: 'Find patterns in sequences of images and shapes',
      icon: <FaPuzzlePiece className="text-3xl text-asu-orange" />,
      benefits: 'Builds logical thinking, pattern recognition, and problem-solving skills. Improves analytical abilities.',
      component: <div className="p-6 text-center">
        <h3 className="text-xl font-bold mb-4">Coming Soon!</h3>
        <p>This game is currently in development.</p>
      </div>
    }
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game) => (
          <motion.div
            key={game.id}
            className={`p-6 rounded-xl cursor-pointer ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-asu-cream hover:bg-opacity-80'
            }`}
            whileHover={{ scale: 1.03 }}
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
    </div>
  );
};

export default GameSelector; 