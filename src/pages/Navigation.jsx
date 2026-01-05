/**
 * Navigation Screen Component
 * 
 * The main navigation hub where users access different topic resources.
 * Displays a list of topic containers that route to individual topic screens.
 * 
 * Features:
 * - Top bar with Blueprint logo and title
 * - Profile navigation with username display
 * - List of topic containers with custom icons
 * - Click tracking to reorder topics (future implementation)
 * - Responsive grid layout
 * - Consistent dark theme with light blue accents
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Navigation.css';

// Import topic icons
import fitnessIcon from '/fitness.png';
import financialIcon from '/finacials.png';
import socialIcon from '/social.png';
import relationshipsIcon from '/relationships.png';
import imageIcon from '/image.png';
import fulfillmentIcon from '/fufillment.png';
import mindsetIcon from '/mindset.png';
import skillsIcon from '/skillset.png';

const Navigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  /**
   * List of available topics with custom icons
   * In future, this will be fetched from a database and reordered based on user interaction
   */
  const topics = [
    {
      id: 'fitness',
      title: 'Fitness & Health',
      description: 'Build your dream physique and optimize your health',
      icon: fitnessIcon
    },
    {
      id: 'financial',
      title: 'Financial Success',
      description: 'Master money management and wealth building',
      icon: financialIcon
    },
    {
      id: 'social',
      title: 'Social Mastery',
      description: 'Develop charisma and expand your network',
      icon: socialIcon
    },
    {
      id: 'relationships',
      title: 'Relationships',
      description: 'Build meaningful connections and partnerships',
      icon: relationshipsIcon
    },
    {
      id: 'image',
      title: 'Image',
      description: 'Elevate your look and personal presentation',
      icon: imageIcon
    },
    {
      id: 'fulfillment',
      title: 'Purpose & Fulfillment',
      description: 'Discover meaning and live with intention',
      icon: fulfillmentIcon
    },
    {
      id: 'mindset',
      title: 'Mindset & Psychology',
      description: 'Master your thoughts and mental strength',
      icon: mindsetIcon
    },
    {
      id: 'skills',
      title: 'Skills & Learning',
      description: 'Acquire valuable abilities and knowledge',
      icon: skillsIcon
    }
  ];

  /**
   * Handle topic click
   * Navigates to the specific topic screen
   */
  const handleTopicClick = (topicId) => {
    navigate(`/topic/${topicId}`);
  };

  /**
   * Navigate to profile page
   */
  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="navigation-container">
      {/* Top Navigation Bar */}
      <div className="navigation-header">
        <div className="navigation-brand">
          <img src="/logo.png" alt="Blueprint Logo" className="navigation-logo" />
          <h1 className="navigation-title">Blueprint</h1>
        </div>
        
        <div className="profile-section" onClick={handleProfileClick}>
          {/* Profile Icon */}
          <svg 
            className="profile-icon" 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="8" r="4" stroke="var(--primary-blue)" strokeWidth="2"/>
            <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="username">{user?.username || 'User'}</span>
        </div>
      </div>

      {/* Topics List */}
      <div className="topics-container">
        <div className="topics-grid">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="topic-card"
              onClick={() => handleTopicClick(topic.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleTopicClick(topic.id);
                }
              }}
            >
              <div className="topic-icon-wrapper">
                <img src={topic.icon} alt={topic.title} className="topic-icon-image" />
              </div>
              <div className="topic-content">
                <h3 className="topic-title">{topic.title}</h3>
                <p className="topic-description">{topic.description}</p>
              </div>
              <svg 
                className="topic-arrow" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none"
              >
                <path d="M9 18L15 12L9 6" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
