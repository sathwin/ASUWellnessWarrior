import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy } from 'react-icons/fa';

interface Tile {
  id: number;
  value: number;
  isBlank: boolean;
}

const PuzzleGame: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!gameComplete) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameComplete]);

  const initializeGame = () => {
    const numbers = Array.from({ length: 8 }, (_, i) => i + 1);
    numbers.push(0); // Blank tile
    const shuffled = numbers.sort(() => Math.random() - 0.5);
    
    const gameTiles = shuffled.map((num, index) => ({
      id: index,
      value: num,
      isBlank: num === 0,
    }));

    setTiles(gameTiles);
    setMoves(0);
    setGameComplete(false);
    setTime(0);
  };

  const canMove = (tile: Tile): boolean => {
    const blankTile = tiles.find(t => t.isBlank);
    if (!blankTile) return false;

    const tileIndex = tiles.findIndex(t => t.id === tile.id);
    const blankIndex = tiles.findIndex(t => t.id === blankTile.id);

    // Check if tile is adjacent to blank tile
    return (
      (Math.abs(tileIndex - blankIndex) === 1 && Math.floor(tileIndex / 3) === Math.floor(blankIndex / 3)) ||
      Math.abs(tileIndex - blankIndex) === 3
    );
  };

  const handleTileClick = (tile: Tile) => {
    if (tile.isBlank || !canMove(tile)) return;

    const newTiles = tiles.map(t => {
      if (t.id === tile.id) {
        return { ...t, isBlank: true };
      }
      if (t.isBlank) {
        return { ...t, value: tile.value, isBlank: false };
      }
      return t;
    });

    setTiles(newTiles);
    setMoves(prev => prev + 1);

    // Check if puzzle is solved
    const isSolved = newTiles.every((t, index) => {
      if (index === 8) return t.isBlank;
      return t.value === index + 1;
    });

    if (isSolved) {
      setGameComplete(true);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <FaTrophy className="text-asu-gold" />
          <span>Moves: {moves}</span>
        </div>
        <div>Time: {formatTime(time)}</div>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {tiles.map(tile => (
          <motion.div
            key={tile.id}
            className={`aspect-square cursor-pointer ${
              tile.isBlank ? 'bg-asu-gray' : 'bg-asu-maroon text-white'
            } rounded-lg flex items-center justify-center text-2xl font-bold`}
            onClick={() => handleTileClick(tile)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {!tile.isBlank && tile.value}
          </motion.div>
        ))}
      </div>

      {gameComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-asu-maroon text-white rounded-lg text-center"
        >
          <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
          <p>You solved the puzzle in {moves} moves and {formatTime(time)}!</p>
          <button
            onClick={initializeGame}
            className="mt-2 bg-asu-gold text-asu-maroon px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default PuzzleGame; 