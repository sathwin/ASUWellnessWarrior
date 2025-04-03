import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaCalendarAlt, FaComments, FaUserFriends, FaBrain, FaBook, FaClock, FaMapMarkerAlt, FaTags } from 'react-icons/fa';

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
  phone?: string;
  hours?: string;
  location?: string;
  tags: string[];
  content?: string;
}

interface ResourcesHubProps {
  isDarkMode: boolean;
}

const ResourcesHub: React.FC<ResourcesHubProps> = ({ isDarkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const resources: Resource[] = [
    {
      id: 'counseling',
      title: 'ASU Counseling Services',
      description: 'Professional counseling and crisis services for ASU students',
      icon: <FaComments className="text-asu-blue" />,
      phone: '480-965-6146',
      hours: 'Monday-Friday: 8am-5pm',
      location: 'Student Services Building',
      tags: ['counseling', 'professional', 'crisis'],
      content: `ASU Counseling Services offers confidential counseling to help students with personal concerns that may interfere with their academic progress, social development, and emotional wellbeing. 

Services include:
- Brief assessment and counseling
- Crisis intervention
- Group counseling and support groups
- Referral services
- Consultation

To schedule an appointment, call 480-965-6146 or visit the Counseling Services office in the Student Services Building.`
    },
    {
      id: 'crisis',
      title: 'ASU Crisis Hotline',
      description: '24/7 crisis support for students in distress',
      icon: <FaPhone className="text-asu-maroon" />,
      phone: '480-921-1006',
      hours: '24/7, including holidays',
      tags: ['crisis', 'emergency', 'hotline'],
      content: `The ASU Crisis Line is available 24/7 including weekends and holidays. This service is available to you if you're experiencing an emotional crisis, have suicidal thoughts, or are concerned about a friend who may be in danger.

When you call, you'll speak with a mental health professional who can help you manage the immediate situation and connect you with appropriate resources.

If you are experiencing a life-threatening emergency, please call 911 or go to your nearest emergency room.`
    },
    {
      id: 'lets-talk',
      title: 'Let\'s Talk Drop-In Consultations',
      description: 'Quick, confidential consultations with counselors around campus',
      icon: <FaCalendarAlt className="text-asu-gold" />,
      hours: 'Varies by location',
      location: 'Multiple locations across campus',
      tags: ['drop-in', 'consultation', 'quick'],
      content: `Let's Talk is a service that provides easy access to informal confidential consultations with counselors from ASU Counseling Services. No appointment is necessary.

Let's Talk consultations are:
- Free for ASU students
- No paperwork to complete
- Offered first-come, first-served
- Brief (usually about 20 minutes)

These drop-in consultations are ideal for students who:
- Aren't sure about counseling and wonder what it's like to talk with a counselor
- Aren't interested in ongoing counseling but would like the perspective of a counselor
- Have a specific problem and would like someone with whom to talk it through
- Have a concern about a friend and want some guidance about how to help`
    },
    {
      id: 'devils-4-devils',
      title: 'Devils 4 Devils Peer Support',
      description: 'Peer support network for ASU students',
      icon: <FaUserFriends className="text-asu-orange" />,
      link: 'https://eoss.asu.edu/devils-4-devils',
      tags: ['peer', 'support', 'community'],
      content: `Devils 4 Devils (D4D) is a community of ASU students committed to a culture of connection, caring and support.

As a part of D4D, you can:
- Get connected with other ASU students who understand what you're going through
- Share your experiences and learn from others
- Develop skills for managing stress and improving wellbeing
- Contribute to a more supportive ASU community

Visit the D4D website to learn about upcoming events, training opportunities, and ways to get involved.`
    },
    {
      id: 'tao',
      title: 'TAO Self-Help',
      description: 'Online self-help modules for stress, anxiety, and depression',
      icon: <FaBrain className="text-asu-blue" />,
      link: 'https://thepath.taoconnect.org/local/login/home.php',
      tags: ['self-help', 'online', 'anxiety', 'depression'],
      content: `TAO (Therapy Assistance Online) Self-Help provides free access to online modules to help you understand and manage anxiety, depression, and other common concerns.

Features include:
- Interactive modules and tools based on cognitive behavioral therapy
- Mindfulness exercises and journals
- Educational videos and resources
- Progress tracking

You can access TAO Self-Help anytime from your computer, tablet, or smartphone. Register with your ASU email address to get started.`
    },
    {
      id: 'mindfulness',
      title: 'Mindfulness Center',
      description: 'Guided meditation and mindfulness practices',
      icon: <FaBrain className="text-asu-gold" />,
      hours: 'Monday-Friday: 10am-6pm',
      location: 'Center Building, Room 120',
      tags: ['mindfulness', 'meditation', 'stress-reduction'],
      content: `The ASU Mindfulness Center offers a variety of programs to help students develop mindfulness skills and reduce stress.

Services include:
- Drop-in meditation sessions
- Mindfulness workshops and classes
- Stress reduction programs
- Individual mindfulness coaching

Research shows that mindfulness practice can improve attention, reduce stress, and promote emotional wellbeing. Visit the Mindfulness Center to learn more about how these practices can benefit you.`
    },
    {
      id: 'tutoring',
      title: 'Tutoring with Stress Management',
      description: 'Academic support with integrated stress management techniques',
      icon: <FaBook className="text-asu-maroon" />,
      hours: 'Monday-Thursday: 9am-7pm, Friday: 9am-2pm',
      location: 'Student Success Center',
      tags: ['academic', 'tutoring', 'stress-management'],
      content: `This specialized tutoring program combines academic support with stress management techniques to help you succeed in your courses while maintaining your wellbeing.

Services include:
- One-on-one tutoring in various subjects
- Study skills development
- Time management strategies
- Test anxiety reduction techniques
- Integration of stress management into academic work

To schedule an appointment, visit the Student Success Center or book online through the ASU website.`
    },
    {
      id: 'time-mgmt',
      title: 'Time Management Workshops',
      description: 'Learn strategies to manage your time and reduce academic stress',
      icon: <FaClock className="text-asu-orange" />,
      link: 'https://eoss.asu.edu/workshops',
      tags: ['time-management', 'academic', 'workshop'],
      content: `These workshops help students develop effective time management strategies to balance academics, work, and personal life.

Workshop topics include:
- Creating a realistic schedule
- Setting priorities and goals
- Avoiding procrastination
- Managing digital distractions
- Maintaining work-life balance

Workshops are offered throughout the semester at various campus locations. Check the website for the current schedule and to register.`
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'counseling', name: 'Counseling' },
    { id: 'crisis', name: 'Crisis Support' },
    { id: 'self-help', name: 'Self-Help' },
    { id: 'academic', name: 'Academic Support' }
  ];

  const filterResources = () => {
    let filtered = resources;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => 
        resource.tags.includes(selectedCategory)
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(lowercasedSearch) ||
        resource.description.toLowerCase().includes(lowercasedSearch) ||
        resource.tags.some(tag => tag.toLowerCase().includes(lowercasedSearch))
      );
    }
    
    return filtered;
  };

  const filteredResources = filterResources();
  const selectedResourceData = selectedResource ? resources.find(r => r.id === selectedResource) : null;

  return (
    <div>
      {selectedResource ? (
        <div>
          <button 
            onClick={() => setSelectedResource(null)}
            className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
          >
            <span className="mr-2">←</span> Back to Resources
          </button>
          
          {selectedResourceData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-white shadow-md'}`}
            >
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">
                  {selectedResourceData.icon}
                </div>
                <h3 className="text-xl font-bold text-asu-maroon">{selectedResourceData.title}</h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">{selectedResourceData.description}</p>
              
              <div className="space-y-4 mb-6">
                {selectedResourceData.phone && (
                  <div className="flex items-center">
                    <FaPhone className="text-asu-maroon mr-3" />
                    <div>
                      <div className="font-semibold">Phone</div>
                      <a href={`tel:${selectedResourceData.phone}`} className="text-asu-blue hover:underline">
                        {selectedResourceData.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {selectedResourceData.hours && (
                  <div className="flex items-center">
                    <FaClock className="text-asu-maroon mr-3" />
                    <div>
                      <div className="font-semibold">Hours</div>
                      <div>{selectedResourceData.hours}</div>
                    </div>
                  </div>
                )}
                
                {selectedResourceData.location && (
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-asu-maroon mr-3" />
                    <div>
                      <div className="font-semibold">Location</div>
                      <div>{selectedResourceData.location}</div>
                    </div>
                  </div>
                )}
                
                {selectedResourceData.link && (
                  <div className="mt-4">
                    <a 
                      href={selectedResourceData.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-asu-maroon text-white rounded-lg hover:bg-opacity-90 inline-block"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
              
              {selectedResourceData.content && (
                <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-asu-cream'}`}>
                  <div className="whitespace-pre-line">{selectedResourceData.content}</div>
                </div>
              )}
              
              <div className="mt-6 flex flex-wrap gap-2">
                <FaTags className="text-asu-gray mr-2" />
                {selectedResourceData.tags.map(tag => (
                  <span 
                    key={tag} 
                    className={`px-2 py-1 text-xs rounded-full ${
                      isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full p-3 pr-10 rounded-lg border ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
              <span className="absolute right-3 top-3 text-gray-400">
                🔍
              </span>
            </div>
          </div>
          
          <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-asu-maroon text-white'
                    : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700 shadow-sm'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map(resource => (
                <motion.div
                  key={resource.id}
                  className={`p-4 rounded-xl cursor-pointer ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white shadow-md hover:shadow-lg'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedResource(resource.id)}
                >
                  <div className="flex items-center mb-2">
                    <div className="text-2xl mr-3">
                      {resource.icon}
                    </div>
                    <h3 className="font-bold">{resource.title}</h3>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {resource.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {resource.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag} 
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No resources match your search. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourcesHub; 