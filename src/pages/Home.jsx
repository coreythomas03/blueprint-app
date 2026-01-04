/**
 * Home Page Component
 * 
 * The landing page shown after user logs in or when they open the app with a persisted session.
 * Features a centered circle with the fingerprint icon that animates when clicked,
 * transitioning the user to the Navigation screen.
 * 
 * Design Features:
 * - Centered dark grey gradient circle
 * - Blueprint fingerprint icon in light blue
 * - Smooth closing animation on click
 * - Nearly black dark grey background
 * - Responsive design that works on all screen sizes
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  /**
   * Handle circle click
   * Triggers closing animation and navigates to navigation screen
   */
  const handleCircleClick = () => {
    setIsAnimating(true);
    
    // Wait for animation to complete before navigating
    setTimeout(() => {
      navigate('/navigation');
    }, 600); // Animation duration
  };

  return (
    <div className="home-container">
      <div 
        className={`home-circle ${isAnimating ? 'closing' : ''}`}
        onClick={handleCircleClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCircleClick();
          }
        }}
        aria-label="Enter Blueprint App"
      >
        {/* Fingerprint Icon */}
        <svg 
          className="fingerprint-icon" 
          width="200" 
          height="200" 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer fingerprint curves */}
          <path d="M50 80 Q100 40 150 80" stroke="var(--primary-blue)" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M45 95 Q100 50 155 95" stroke="var(--primary-blue)" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M40 110 Q100 60 160 110" stroke="var(--primary-blue)" strokeWidth="3" strokeLinecap="round" fill="none"/>
          
          {/* Middle fingerprint curves */}
          <path d="M60 100 Q100 70 140 100" stroke="var(--primary-blue)" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M55 115 Q100 80 145 115" stroke="var(--primary-blue)" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M50 130 Q100 90 150 130" stroke="var(--primary-blue)" strokeWidth="3" strokeLinecap="round" fill="none"/>
          
          {/* Inner fingerprint curves */}
          <path d="M70 120 Q100 95 130 120" stroke="var(--primary-blue)" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M65 135 Q100 105 135 135" stroke="var(--primary-blue)" strokeWidth="3" strokeLinecap="round" fill="none"/>
          
          {/* Bottom curves */}
          <path d="M60 145 Q100 115 140 145" stroke="var(--primary-blue)" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M70 155 Q100 130 130 155" stroke="var(--primary-blue)" strokeWidth="3" strokeLinecap="round" fill="none"/>
          
          {/* Center circle */}
          <circle cx="100" cy="140" r="12" fill="var(--primary-blue)"/>
        </svg>
        
        {/* Subtle hint text */}
        <p className="home-hint">Tap to begin</p>
      </div>
    </div>
  );
};

export default Home;
