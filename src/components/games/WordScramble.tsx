import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLightbulb, FaCheck, FaTimes } from 'react-icons/fa';

interface WordScrambleProps {
  onComplete: (score: number) => void;
  isDarkMode: boolean;
}

const words = [
  { word: 'HAPPINESS', hint: 'A state of being happy' },
  { word: 'MINDFULNESS', hint: 'Being present in the moment' },
  { word: 'GRATITUDE', hint: 'Being thankful' },
  { word: 'RESILIENCE', hint: 'Ability to bounce back' },
  { word: 'WELLNESS', hint: 'State of being healthy' },
];

const WordScramble: React.FC<WordScrambleProps> = ({ onComplete, isDarkMode }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < words.length) {
      const word = words[currentIndex].word;
      setCurrentWord(word);
      setScrambledWord(scrambleWord(word));
      setUserInput('');
      setShowHint(false);
      setFeedback(null);
    } else {
      setGameComplete(true);
      onComplete(score);
    }
  }, [currentIndex]);

  const scrambleWord = (word: string): string => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toUpperCase() === currentWord) {
      setFeedback('correct');
      setScore(prev => prev + 10);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 1000);
    } else {
      setFeedback('incorrect');
    }
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
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
            setCurrentIndex(0);
            setScore(0);
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
          <FaLightbulb className="text-asu-gold text-2xl" />
          <span className="text-xl font-semibold">Score: {score}</span>
        </div>
        <div className="text-xl font-semibold">Word {currentIndex + 1}/{words.length}</div>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-4">Word Scramble</h3>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Unscramble the word
        </p>
      </div>

      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-4xl font-mono mb-4"
        >
          {scrambledWord}
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex space-x-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.toUpperCase())}
            className={`flex-1 p-3 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
            placeholder="Enter your answer..."
          />
          <button
            type="submit"
            className="px-6 py-3 bg-asu-maroon text-white rounded-lg hover:bg-asu-gold transition-colors"
          >
            Submit
          </button>
        </div>
      </form>

      <div className="flex justify-between items-center mt-8">
        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="text-asu-maroon hover:text-opacity-80 transition-colors flex items-center space-x-2"
        >
          <FaLightbulb className="text-xl" />
          <span>Show Hint</span>
        </button>
      </div>

      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-asu-light-gray p-4 rounded-xl mt-4"
        >
          <p className="text-lg text-asu-gray">
            <span className="font-semibold">Hint:</span> {words[currentIndex].hint}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default WordScramble; 