import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaUserMd, FaUsers, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

interface Resource {
  id: string;
  name: string;
  description: string;
  type: 'counseling' | 'group' | 'emergency' | 'workshop';
  location: string;
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  availability: string;
  tags: string[];
}

interface ResourceMatchmakerProps {
  isDarkMode: boolean;
}

const ResourceMatchmaker: React.FC<ResourceMatchmakerProps> = ({ isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const resources: Resource[] = [
    {
      id: '1',
      name: 'ASU Counseling Services',
      description: 'Professional counseling for ASU students',
      type: 'counseling',
      location: 'Student Services Building',
      contact: {
        phone: '(480) 965-6146',
        email: 'counseling@asu.edu',
        website: 'https://counseling.asu.edu'
      },
      availability: 'Mon-Fri, 8am-5pm',
      tags: ['individual', 'counseling', 'mental health']
    },
    {
      id: '2',
      name: 'Sun Devil Support Network',
      description: 'Peer support groups for various topics',
      type: 'group',
      location: 'Student Pavilion',
      contact: {
        phone: '(480) 965-8900',
        email: 'support@asu.edu'
      },
      availability: 'Various times throughout the week',
      tags: ['peer support', 'group therapy', 'community']
    },
    {
      id: '3',
      name: '24/7 Crisis Support',
      description: 'Emergency mental health support',
      type: 'emergency',
      location: 'Available 24/7',
      contact: {
        phone: '(480) 965-6146',
        website: 'https://crisis.asu.edu'
      },
      availability: '24/7',
      tags: ['emergency', 'crisis', 'immediate help']
    },
    {
      id: '4',
      name: 'Wellness Workshops',
      description: 'Educational workshops on mental health topics',
      type: 'workshop',
      location: 'Various campus locations',
      contact: {
        email: 'wellness@asu.edu'
      },
      availability: 'Weekly sessions',
      tags: ['education', 'workshop', 'learning']
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-asu-maroon mb-4">ASU Mental Health Resources</h2>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
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
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All Resources</option>
          <option value="counseling">Counseling</option>
          <option value="group">Support Groups</option>
          <option value="emergency">Emergency</option>
          <option value="workshop">Workshops</option>
        </select>
      </div>

      {/* Resource Cards */}
      <div className="grid gap-4">
        {filteredResources.map((resource) => (
          <motion.div
            key={resource.id}
            className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-full ${
                resource.type === 'counseling' ? 'bg-blue-500' :
                resource.type === 'group' ? 'bg-green-500' :
                resource.type === 'emergency' ? 'bg-red-500' :
                'bg-yellow-500'
              } text-white`}>
                {resource.type === 'counseling' ? <FaUserMd className="text-2xl" /> :
                 resource.type === 'group' ? <FaUsers className="text-2xl" /> :
                 resource.type === 'emergency' ? <FaPhone className="text-2xl" /> :
                 <FaEnvelope className="text-2xl" />}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{resource.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {resource.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <FaMapMarkerAlt />
                    <span>{resource.location}</span>
                  </div>
                  {resource.contact.phone && (
                    <div className="flex items-center space-x-1">
                      <FaPhone />
                      <span>{resource.contact.phone}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-1 rounded-full text-xs ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResourceMatchmaker; 