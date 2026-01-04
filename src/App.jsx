/**
 * Main App Component
 * 
 * Root component that handles routing and authentication state management.
 * Implements protected routes and automatic navigation based on auth status.
 * 
 * Features:
 * - React Router for navigation
 * - Protected route wrapper for authenticated pages
 * - Automatic redirect based on authentication state
 * - Loading states during authentication checks
 * - Global authentication context provider
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Navigation from './pages/Navigation';
import Topic from './pages/Topic';
import Profile from './pages/Profile';
import './styles/global.css';

/**
 * Protected Route Component
 * Wraps routes that require authentication
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--dark-bg)',
        color: 'var(--light-blue)',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

/**
 * Public Route Component
 * Wraps routes accessible only when not authenticated
 * Redirects to home if user is already logged in
 */
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--dark-bg)',
        color: 'var(--light-blue)',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return user ? <Navigate to="/home" /> : children;
};

/**
 * App Routes Component
 * Defines all application routes and their access controls
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Accessible only when not logged in */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      <Route path="/reset-password" element={
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      } />

      {/* Protected Routes - Require authentication */}
      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/navigation" element={
        <ProtectedRoute>
          <Navigation />
        </ProtectedRoute>
      } />
      <Route path="/topic/:topicId" element={
        <ProtectedRoute>
          <Topic />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      {/* Root redirect - sends to login if not authenticated, home if authenticated */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Catch-all route - redirects to login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

/**
 * Main App Component
 * Wraps the application with necessary providers
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
