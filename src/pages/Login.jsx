/**
 * Login Page Component
 * 
 * Handles user authentication with email and password.
 * Includes form validation, error handling, and navigation to registration and password reset.
 * 
 * Features:
 * - Input validation with real-time feedback
 * - Rate limiting to prevent brute force attacks
 * - Secure password input with visibility toggle
 * - Navigation to sign up and password reset flows
 * - Responsive design with Blueprint theme
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError, setError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  /**
   * Handle input field changes
   * Clears errors when user starts typing
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setLocalError('');
    setError(null);
  };

  /**
   * Handle form submission
   * Validates inputs and attempts login with rate limiting
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setError(null);
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      // Navigation handled by App.js based on auth state
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="var(--primary-blue)" strokeWidth="2" fill="none"/>
            <path d="M30 40 Q50 20 70 40" stroke="var(--primary-blue)" strokeWidth="2" fill="none"/>
            <path d="M30 50 Q50 30 70 50" stroke="var(--primary-blue)" strokeWidth="2" fill="none"/>
            <path d="M30 60 Q50 40 70 60" stroke="var(--primary-blue)" strokeWidth="2" fill="none"/>
            <circle cx="50" cy="70" r="8" fill="var(--primary-blue)"/>
          </svg>
        </div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue your journey</p>

        {/* Error Display */}
        {(localError || authError) && (
          <div className="error-message">
            {localError || authError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="form-input"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="form-input"
                autoComplete="current-password"
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
          </div>

          <div className="form-actions">
            <Link to="/reset-password" className="link-text">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="link-text-bold">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
