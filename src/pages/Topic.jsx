/**
 * Topic Screen Component
 * 
 * Displays resources and courses for a specific topic.
 * Currently shows an empty state as content will be added in future implementation.
 * 
 * Features:
 * - Topic title at the top center
 * - Back arrow to return to navigation
 * - Blueprint logo in top left
 * - Empty state message for no resources
 * - Consistent dark theme styling
 * - Ready for future content integration
 */

import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Topic.css';

const Topic = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  /**
   * Topic information mapping
   * Maps topic IDs to display names
   */
  const topicTitles = {
    'fitness': 'Fitness & Health',
    'financial': 'Financial Success',
    'social': 'Social Mastery',
    'relationships': 'Relationships',
    'style': 'Style & Appearance',
    'fulfillment': 'Purpose & Fulfillment',
    'mindset': 'Mindset & Psychology',
    'skills': 'Skills & Learning'
  };

  const topicTitle = topicTitles[topicId] || 'Topic';

  /**
   * Handle back button click
   * Returns user to navigation screen
   */
  const handleBack = () => {
    navigate('/navigation');
  };

  return (
    <div className="topic-container">
      {/* Top Bar */}
      <div className="topic-header">
        {/* Logo */}
        <div className="topic-logo">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="var(--primary-blue)" strokeWidth="2" fill="none"/>
            <path d="M30 40 Q50 20 70 40" stroke="var(--primary-blue)" strokeWidth="2" fill="none"/>
            <path d="M30 50 Q50 30 70 50" stroke="var(--primary-blue)" strokeWidth="2" fill="none"/>
            <path d="M30 60 Q50 40 70 60" stroke="var(--primary-blue)" strokeWidth="2" fill="none"/>
            <circle cx="50" cy="70" r="8" fill="var(--primary-blue)"/>
          </svg>
        </div>

        {/* Topic Title */}
        <h1 className="topic-title">{topicTitle}</h1>

        {/* Back Button */}
        <button 
          className="back-button"
          onClick={handleBack}
          aria-label="Go back to navigation"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Resources List (Currently Empty) */}
      <div className="topic-content">
        <div className="empty-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="empty-icon">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--grey-gradient-start)" strokeWidth="2"/>
            <line x1="8" y1="8" x2="16" y2="8" stroke="var(--grey-gradient-start)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="12" x2="14" y2="12" stroke="var(--grey-gradient-start)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="16" x2="12" y2="16" stroke="var(--grey-gradient-start)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h2 className="empty-title">No Resources Available</h2>
          <p className="empty-description">
            Content for this topic is coming soon. Check back later for courses, guides, and resources to help you master {topicTitle.toLowerCase()}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Topic;
