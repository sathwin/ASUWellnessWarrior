import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onComplete: (score: number) => void;
  isDarkMode: boolean;
}

const emojis = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎟️', '🎠'];

const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete, isDarkMode }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const gameCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setScore(0);
    setGameComplete(false);
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isMatched || cards[id].isFlipped) return;

    const newCards = cards.map(card =>
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);

    if (flippedCards.length === 1) {
      const firstCard = cards[flippedCards[0]];
      const secondCard = cards[id];
      setMoves(prev => prev + 1);

      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          const matchedCards = newCards.map(card =>
            card.emoji === firstCard.emoji ? { ...card, isMatched: true } : card
          );
          setCards(matchedCards);
          setFlippedCards([]);
          setScore(prev => prev + 10);

          // Check if game is complete
          if (matchedCards.every(card => card.isMatched)) {
            setGameComplete(true);
            onComplete(score + 10);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = newCards.map(card =>
            card.id === flippedCards[0] || card.id === id
              ? { ...card, isFlipped: false }
              : card
          );
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <FaStar className="text-asu-gold text-2xl" />
          <span className="text-xl font-semibold">Score: {score}</span>
        </div>
        <div className="text-xl font-semibold">Moves: {moves}</div>
      </div>

      <div className="grid grid-cols-4 gap-6 max-w-4xl mx-auto">
        {cards.map(card => (
          <motion.div
            key={card.id}
            className={`aspect-square cursor-pointer ${
              card.isFlipped || card.isMatched 
                ? 'bg-asu-maroon shadow-lg' 
                : isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-asu-gray hover:bg-opacity-80'
            } rounded-xl flex items-center justify-center text-6xl transform transition-all duration-300`}
            onClick={() => handleCardClick(card.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <AnimatePresence>
              {(card.isFlipped || card.isMatched) && (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    duration: 0.4
                  }}
                >
                  {card.emoji}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {gameComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 bg-asu-maroon text-white rounded-xl text-center max-w-2xl mx-auto"
        >
          <h3 className="text-3xl font-bold mb-4">Congratulations!</h3>
          <p className="text-xl mb-4">You completed the game in {moves} moves!</p>
          <button
            onClick={initializeGame}
            className="mt-4 bg-asu-gold text-asu-maroon px-8 py-3 rounded-xl hover:bg-opacity-90 transition-colors text-lg font-semibold"
          >
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default MemoryGame; 