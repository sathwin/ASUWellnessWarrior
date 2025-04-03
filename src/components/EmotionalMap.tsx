import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaSmile, FaFrown, FaMeh, FaHeart, FaLightbulb } from 'react-icons/fa';

interface Location {
  id: string;
  name: string;
  coordinates: { x: number; y: number };
  emotions: Emotion[];
  description: string;
}

interface Emotion {
  type: 'happy' | 'sad' | 'neutral' | 'love' | 'stress';
  count: number;
  description: string;
}

const ASU_LOCATIONS: Location[] = [
  {
    id: 'hayden',
    name: 'Hayden Library',
    coordinates: { x: 30, y: 40 },
    emotions: [
      { type: 'stress', count: 15, description: 'Study pressure' },
      { type: 'neutral', count: 8, description: 'Quiet study environment' }
    ],
    description: 'Main library on campus'
  },
  {
    id: 'palm-walk',
    name: 'Palm Walk',
    coordinates: { x: 50, y: 30 },
    emotions: [
      { type: 'happy', count: 20, description: 'Beautiful scenery' },
      { type: 'love', count: 12, description: 'Peaceful atmosphere' }
    ],
    description: 'Iconic palm-lined walkway'
  },
  {
    id: 'student-pavilion',
    name: 'Student Pavilion',
    coordinates: { x: 70, y: 60 },
    emotions: [
      { type: 'happy', count: 25, description: 'Social hub' },
      { type: 'neutral', count: 10, description: 'Busy area' }
    ],
    description: 'Student activity center'
  }
];

const EmotionalMap: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showAddEmotion, setShowAddEmotion] = useState(false);
  const [newEmotion, setNewEmotion] = useState<Omit<Emotion, 'count'>>({
    type: 'happy',
    description: ''
  });

  const handleAddEmotion = () => {
    if (selectedLocation) {
      const updatedLocation = {
        ...selectedLocation,
        emotions: [
          ...selectedLocation.emotions,
          { ...newEmotion, count: 1 }
        ]
      };
      setSelectedLocation(updatedLocation);
      setShowAddEmotion(false);
      setNewEmotion({ type: 'happy', description: '' });
    }
  };

  const getEmotionIcon = (type: Emotion['type']) => {
    switch (type) {
      case 'happy':
        return <FaSmile className="text-yellow-400" />;
      case 'sad':
        return <FaFrown className="text-blue-400" />;
      case 'neutral':
        return <FaMeh className="text-gray-400" />;
      case 'love':
        return <FaHeart className="text-red-400" />;
      case 'stress':
        return <FaLightbulb className="text-orange-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-asu-maroon mb-4">ASU Emotional Journey Map</h2>
        <p className="text-xl text-asu-gray">Share your emotional experiences across campus</p>
      </div>

      <div className="relative bg-white rounded-2xl shadow-xl p-8">
        {/* Map Container */}
        <div className="relative h-[600px] bg-asu-light-gray rounded-xl overflow-hidden">
          {/* Background Map Image would go here */}
          <div className="absolute inset-0 bg-gradient-to-br from-asu-maroon/10 to-asu-gold/10" />

          {/* Location Markers */}
          {ASU_LOCATIONS.map((location) => (
            <motion.button
              key={location.id}
              className="absolute"
              style={{
                left: `${location.coordinates.x}%`,
                top: `${location.coordinates.y}%`,
              }}
              onClick={() => setSelectedLocation(location)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaMapMarkerAlt className="text-3xl text-asu-maroon" />
            </motion.button>
          ))}
        </div>

        {/* Location Details */}
        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 p-6 bg-white rounded-xl shadow-lg"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-asu-maroon mb-2">
                    {selectedLocation.name}
                  </h3>
                  <p className="text-asu-gray">{selectedLocation.description}</p>
                </div>
                <button
                  onClick={() => setShowAddEmotion(true)}
                  className="bg-asu-maroon text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Add Emotion
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedLocation.emotions.map((emotion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-asu-light-gray p-4 rounded-lg"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {getEmotionIcon(emotion.type)}
                      <span className="font-semibold capitalize">{emotion.type}</span>
                    </div>
                    <p className="text-sm text-asu-gray">{emotion.description}</p>
                    <div className="mt-2 text-sm text-asu-maroon">
                      {emotion.count} {emotion.count === 1 ? 'person' : 'people'} felt this
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Emotion Modal */}
        <AnimatePresence>
          {showAddEmotion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full"
              >
                <h3 className="text-2xl font-bold text-asu-maroon mb-6">Share Your Emotion</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-asu-gray mb-2">
                      How are you feeling?
                    </label>
                    <select
                      value={newEmotion.type}
                      onChange={(e) => setNewEmotion({ ...newEmotion, type: e.target.value as Emotion['type'] })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:border-asu-maroon"
                    >
                      <option value="happy">Happy</option>
                      <option value="sad">Sad</option>
                      <option value="neutral">Neutral</option>
                      <option value="love">Love</option>
                      <option value="stress">Stress</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-asu-gray mb-2">
                      Tell us more
                    </label>
                    <textarea
                      value={newEmotion.description}
                      onChange={(e) => setNewEmotion({ ...newEmotion, description: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:border-asu-maroon"
                      rows={3}
                      placeholder="What makes you feel this way?"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setShowAddEmotion(false)}
                      className="px-4 py-2 text-asu-gray hover:text-asu-maroon transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddEmotion}
                      className="bg-asu-maroon text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmotionalMap; 