/**
 * Profile Screen Component
 * 
 * Displays user information and account management options.
 * Shows full name, username, and provides password reset functionality.
 * 
 * Features:
 * - Display of full name (not shown publicly)
 * - Display of username
 * - Reset password option
 * - Subscription status placeholder for future implementation
 * - Back navigation to previous page
 * - Logout functionality
 * - Consistent Blueprint theme styling
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUserPassword } = useAuth();
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Handle back navigation
   * Returns to the previous page
   */
  const handleBack = () => {
    navigate(-1);
  };

  /**
   * Handle logout
   * Signs out the user and returns to login page
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  /**
   * Handle password reset submission
   * Validates and updates user password when logged in
   */
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await updateUserPassword(newPassword);
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      
      // Close modal after success
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      {/* Top Bar */}
      <div className="profile-header">
        <button 
          className="back-button"
          onClick={handleBack}
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="profile-title">Profile</h1>
        <div style={{ width: '24px' }}></div> {/* Spacer for alignment */}
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {/* User Information Card */}
        <div className="profile-card">
          <div className="profile-avatar">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="5" stroke="var(--primary-blue)" strokeWidth="2"/>
              <path d="M3 20C3 16.134 7.029 13 12 13C16.971 13 21 16.134 21 20" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          <div className="profile-info">
            <div className="info-row">
              <label>Full Name</label>
              <p className="info-value">
                {user?.firstName} {user?.lastName}
              </p>
              <small className="info-hint">Not shown publicly</small>
            </div>

            <div className="info-row">
              <label>Username</label>
              <p className="info-value">@{user?.username}</p>
            </div>

            <div className="info-row">
              <label>Email</label>
              <p className="info-value">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          <button 
            className="btn-secondary"
            onClick={() => setShowPasswordModal(true)}
          >
            Reset Password
          </button>

          <button 
            className="btn-secondary btn-subscription"
            disabled
          >
            Subscription Status: {user?.subscriptionStatus || 'Free'}
            <small>Coming Soon</small>
          </button>

          <button 
            className="btn-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reset Password</h2>
              <button 
                className="modal-close"
                onClick={() => setShowPasswordModal(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {passwordSuccess && (
              <div className="success-message">
                Password updated successfully!
              </div>
            )}

            {passwordError && (
              <div className="error-message">
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="password-form">
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  maxLength={20}
                  placeholder="Enter new password"
                  className="form-input"
                />
                <small className="input-hint">8-20 characters</small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
