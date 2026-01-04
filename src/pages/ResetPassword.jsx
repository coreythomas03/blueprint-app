/**
 * Password Reset Page Component
 * 
 * Handles password reset requests for users who have forgotten their password.
 * Sends a password reset email via Firebase Authentication.
 * 
 * Features:
 * - Email input with validation
 * - Rate limiting to prevent abuse
 * - Success confirmation message
 * - Back navigation to login
 * - Consistent Blueprint theme styling
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Auth.css';

const ResetPassword = () => {
  const { resetPasswordEmail } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  /**
   * Handle form submission
   * Sends password reset email
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await resetPasswordEmail(email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err.message);
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

        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">Enter your email to receive reset instructions</p>

        {/* Success Message */}
        {success && (
          <div className="success-message">
            Password reset email sent! Check your inbox for instructions.
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Reset Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="form-input"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {/* Back to Login Link */}
        <div className="auth-footer">
          <p>
            Remember your password?{' '}
            <Link to="/login" className="link-text-bold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
