import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGamepad, FaPuzzlePiece, FaBrain, FaFont } from 'react-icons/fa';
import MemoryGame from './MemoryGame';
import WordScramble from './WordScramble';
import PatternRecognition from './PatternRecognition';

interface Game {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

interface GamesContainerProps {
  onGameComplete: (score: number) => void;
  isDarkMode: boolean;
}

const GamesContainer: React.FC<GamesContainerProps> = ({ onGameComplete, isDarkMode }) => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState(0);

  const games: Game[] = [
    {
      id: 'memory-game',
      name: 'Memory Match',
      description: 'Match pairs of cards to test your memory',
      icon: <FaGamepad className="text-4xl" />,
      component: <MemoryGame onComplete={(score) => handleGameComplete(score)} isDarkMode={isDarkMode} />
    },
    {
      id: 'pattern-recognition',
      name: 'Pattern Recognition',
      description: 'Identify patterns in sequences',
      icon: <FaPuzzlePiece className="text-4xl" />,
      component: <PatternRecognition onComplete={(score) => handleGameComplete(score)} isDarkMode={isDarkMode} />
    },
    {
      id: 'word-scramble',
      name: 'Word Scramble',
      description: 'Unscramble words to test your vocabulary',
      icon: <FaFont className="text-4xl" />,
      component: <WordScramble onComplete={(score) => handleGameComplete(score)} isDarkMode={isDarkMode} />
    }
  ];

  const handleGameComplete = (score: number) => {
    setTotalScore(prev => prev + score);
    onGameComplete(score);
    setTimeout(() => {
      setSelectedGame(null);
    }, 2000);
  };

  return (
    <div className="p-6">
      {!selectedGame ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-asu-maroon mb-4">Brain Games</h2>
            <p className="text-xl text-asu-gray">Choose a game to challenge your mind!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {games.map((game) => (
              <motion.button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className={`bg-white rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-asu-maroon mb-4">{game.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-asu-gray'}`}>
                  {game.description}
                </p>
              </motion.button>
            ))}
          </div>

          {totalScore > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-asu-maroon text-white rounded-2xl text-center"
            >
              <h3 className="text-2xl font-bold mb-2">Total Score: {totalScore}</h3>
              <p className="text-lg">Keep playing to improve your score!</p>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGame}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {games.find(game => game.id === selectedGame)?.component}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default GamesContainer; 