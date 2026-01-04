/**
 * Authentication Context Hook
 * 
 * This custom hook provides authentication state and methods throughout the app.
 * It manages user session, login/logout operations, and persistence.
 * 
 * Security Implementation:
 * - Integrates with rate limiter for brute force protection
 * - Validates all inputs before Firebase operations
 * - Sanitizes user data before storage
 * - Implements secure session management
 * - Checks username uniqueness before registration
 * 
 * Usage:
 * const { user, loading, login, register, logout, resetPassword } = useAuth();
 */

import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword
} from 'firebase/auth';
import { doc, setDoc, getDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { validateRegistrationForm, validateEmail, validatePassword, sanitizeInput } from '../utils/validation';
import rateLimiter from '../utils/rateLimiter';

const AuthContext = createContext();

/**
 * Custom hook to access authentication context
 * @returns {Object} Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication Provider Component
 * Wraps the app to provide authentication state and methods
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Monitor authentication state changes
   * Automatically updates user state when Firebase auth state changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userDoc.data()
            });
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email
            });
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * Check if a username is already taken
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} - True if username exists, false otherwise
   */
  const checkUsernameExists = async (username) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username.toLowerCase()));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (err) {
      console.error('Error checking username:', err);
      throw new Error('Unable to verify username availability');
    }
  };

  /**
   * Register a new user
   * @param {Object} formData - Registration form data
   * @returns {Promise<Object>} - User object
   * 
   * Security: Validates inputs, checks rate limits, ensures username uniqueness
   */
  const register = async (formData) => {
    setError(null);

    // Validate all form inputs
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError);
    }

    // Check rate limit
    const limitCheck = rateLimiter.checkLimit('register', formData.email);
    if (!limitCheck.allowed) {
      throw new Error(limitCheck.message);
    }

    // Check if username already exists
    const usernameExists = await checkUsernameExists(formData.username);
    if (usernameExists) {
      throw new Error('Username is already taken');
    }

    try {
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Sanitize user data before storing
      const userData = {
        firstName: sanitizeInput(formData.firstName),
        lastName: sanitizeInput(formData.lastName),
        username: sanitizeInput(formData.username.toLowerCase()),
        email: formData.email,
        createdAt: new Date().toISOString(),
        subscriptionStatus: 'free' // Placeholder for future implementation
      };

      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);

      // Reset rate limit on successful registration
      rateLimiter.reset('register', formData.email);

      return {
        uid: userCredential.user.uid,
        ...userData
      };
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle specific Firebase errors
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('Email address is already registered');
      } else if (err.code === 'auth/weak-password') {
        throw new Error('Password is too weak');
      } else if (err.message) {
        throw err;
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  };

  /**
   * Log in an existing user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User object
   * 
   * Security: Validates inputs, checks rate limits
   */
  const login = async (email, password) => {
    setError(null);

    // Validate inputs
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.error);
    }

    // Check rate limit
    const limitCheck = rateLimiter.checkLimit('login', email);
    if (!limitCheck.allowed) {
      throw new Error(limitCheck.message);
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Reset rate limit on successful login
      rateLimiter.reset('login', email);
      
      return userCredential.user;
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle specific Firebase errors
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password');
      } else if (err.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later.');
      } else if (err.message) {
        throw err;
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  };

  /**
   * Log out the current user
   */
  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
      throw new Error('Logout failed. Please try again.');
    }
  };

  /**
   * Send password reset email
   * @param {string} email - User email
   * 
   * Security: Validates email, checks rate limits
   */
  const resetPasswordEmail = async (email) => {
    setError(null);

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error);
    }

    // Check rate limit
    const limitCheck = rateLimiter.checkLimit('passwordReset', email);
    if (!limitCheck.allowed) {
      throw new Error(limitCheck.message);
    }

    try {
      await sendPasswordResetEmail(auth, email);
      rateLimiter.reset('passwordReset', email);
    } catch (err) {
      console.error('Password reset error:', err);
      
      if (err.code === 'auth/user-not-found') {
        // Don't reveal if user exists (security best practice)
        // Still show success message
        return;
      }
      throw new Error('Failed to send password reset email. Please try again.');
    }
  };

  /**
   * Update user password (when logged in)
   * @param {string} newPassword - New password
   * 
   * Security: Validates password strength
   */
  const updateUserPassword = async (newPassword) => {
    setError(null);

    // Validate password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.error);
    }

    if (!auth.currentUser) {
      throw new Error('No user logged in');
    }

    try {
      await updatePassword(auth.currentUser, newPassword);
    } catch (err) {
      console.error('Password update error:', err);
      
      if (err.code === 'auth/requires-recent-login') {
        throw new Error('Please log out and log back in before changing your password');
      }
      throw new Error('Failed to update password. Please try again.');
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    resetPasswordEmail,
    updateUserPassword,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
