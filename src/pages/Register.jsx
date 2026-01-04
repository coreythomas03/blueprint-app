/**
 * Register Page Component
 * 
 * Handles new user registration with comprehensive validation.
 * Collects first name, last name, username, email, and password.
 * 
 * Features:
 * - Real-time input validation with helpful error messages
 * - Username uniqueness checking
 * - Password confirmation matching
 * - Rate limiting to prevent abuse
 * - Privacy notice for full name
 * - Character limit indicators
 * - Responsive design with Blueprint theme
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, setError } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Handle input field changes
   * Clears field-specific errors when user starts typing
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setError(null);
  };

  /**
   * Handle form submission
   * Validates all inputs and attempts registration
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setError(null);
    setLoading(true);

    try {
      await register(formData);
      // Navigation handled by App.js based on auth state
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-large">
        {/* Logo */}
        <div className="auth-logo">
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="var(--primary-blue)" strokeWidth="2" fill="none"/>
            <path d="M30 40 Q50 20 70 40" stroke="var(--primary-blue)" strokeWidth="2" fill="none"/>
            <path d="M30 50 Q50 30 70 50" stroke="var(--primary-blue)" strokeWidth="2" fill="none"/>
            <path d="M30 60 Q50 40 70 60" stroke="var(--primary-blue)" strokeWidth="2" fill="none"/>
            <circle cx="50" cy="70" r="8" fill="var(--primary-blue)"/>
          </svg>
        </div>

        <h1 className="auth-title">Create Your Blueprint</h1>
        <p className="auth-subtitle">Start your journey to greatness</p>

        {/* General Error Display */}
        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name Fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">
                First Name
                <span className="char-count">
                  {formData.firstName.length}/20
                </span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                maxLength={20}
                placeholder="John"
                className={`form-input ${errors.firstName ? 'input-error' : ''}`}
                autoComplete="given-name"
              />
              {errors.firstName && <span className="field-error">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                Last Name
                <span className="char-count">
                  {formData.lastName.length}/20
                </span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                maxLength={20}
                placeholder="Doe"
                className={`form-input ${errors.lastName ? 'input-error' : ''}`}
                autoComplete="family-name"
              />
              {errors.lastName && <span className="field-error">{errors.lastName}</span>}
            </div>
          </div>

          <p className="privacy-notice">
            Your full name will not be shown publicly
          </p>

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">
              Username
              <span className="char-count">
                {formData.username.length}/20
              </span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              maxLength={20}
              placeholder="john_doe"
              className={`form-input ${errors.username ? 'input-error' : ''}`}
              autoComplete="username"
            />
            <small className="input-hint">Only letters and underscores allowed</small>
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              Password
              <span className="char-count">
                {formData.password.length}/20
              </span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                maxLength={20}
                placeholder="Create a strong password"
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <small className="input-hint">8-20 characters, letters, numbers, or special characters</small>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter your password"
              className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="link-text-bold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
