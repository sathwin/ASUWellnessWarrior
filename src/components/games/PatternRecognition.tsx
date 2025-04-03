import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaCheck, FaTimes } from 'react-icons/fa';

interface PatternRecognitionProps {
  onComplete: (score: number) => void;
  isDarkMode: boolean;
}

const patterns = [
  {
    sequence: ['🔴', '🔵', '🟡', '🔴', '🔵', '🟡'],
    options: ['🔴', '🔵', '🟡', '🟢'],
    answer: '🔴'
  },
  {
    sequence: ['⭐', '🌟', '⭐', '🌟', '⭐', '🌟'],
    options: ['⭐', '🌟', '🌙', '☀️'],
    answer: '⭐'
  },
  {
    sequence: ['❤️', '💙', '💛', '❤️', '💙', '💛'],
    options: ['❤️', '💙', '💛', '💚'],
    answer: '❤️'
  },
  {
    sequence: ['🎮', '🎲', '🎯', '🎮', '🎲', '🎯'],
    options: ['🎮', '🎲', '🎯', '🎨'],
    answer: '🎮'
  },
  {
    sequence: ['🌱', '🌿', '🌳', '🌱', '🌿', '🌳'],
    options: ['🌱', '🌿', '🌳', '🌺'],
    answer: '🌱'
  }
];

const PatternRecognition: React.FC<PatternRecognitionProps> = ({ onComplete, isDarkMode }) => {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  const handleAnswer = (answer: string) => {
    if (answer === patterns[currentPattern].answer) {
      setFeedback('correct');
      setScore(prev => prev + 10);
      setTimeout(() => {
        if (currentPattern < patterns.length - 1) {
          setCurrentPattern(prev => prev + 1);
          setFeedback(null);
        } else {
          setGameComplete(true);
          onComplete(score + 10);
        }
      }, 1000);
    } else {
      setFeedback('incorrect');
    }
  };

  if (gameComplete) {
    return (
      <div className={`text-center p-8 rounded-xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className="text-2xl font-bold mb-4">Game Over!</h3>
        <p className="text-xl mb-4">Final Score: {score}</p>
        <button
          onClick={() => {
            setCurrentPattern(0);
            setScore(0);
            setFeedback(null);
            setGameComplete(false);
          }}
          className="px-6 py-2 bg-asu-maroon text-white rounded-lg hover:bg-asu-gold transition-colors"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className={`p-8 rounded-xl ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <FaBrain className="text-asu-gold text-2xl" />
          <span className="text-xl font-semibold">Score: {score}</span>
        </div>
        <div className="text-xl font-semibold">Pattern {currentPattern + 1}/{patterns.length}</div>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-4">Pattern Recognition</h3>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Find the next emoji in the sequence
        </p>
      </div>

      <div className="flex justify-center space-x-4 mb-8">
        {patterns[currentPattern].sequence.map((emoji, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl"
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {patterns[currentPattern].options.map((emoji) => (
          <motion.button
            key={emoji}
            onClick={() => handleAnswer(emoji)}
            className={`p-4 rounded-lg text-4xl ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {emoji}
          </motion.button>
        ))}
      </div>

      <div className="mt-6 text-center">
        {feedback && (
          <div className="flex items-center justify-center space-x-2 text-red-500">
            <FaTimes className="text-2xl" />
            <span className="text-xl">Try again!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatternRecognition; 