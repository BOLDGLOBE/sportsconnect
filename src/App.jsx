import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import DiscoverMatches from './pages/Discover/DiscoverMatches';
import CreateMatch from './pages/CreateMatch/CreateMatch';
import MatchDetails from './pages/MatchDetails/MatchDetails';
import Profile from './pages/Profile/Profile';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div style={loaderStyle}>
        <div style={spinnerStyle} />
        <p>Loading SportsConnect…</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/discover"
        element={
          <ProtectedRoute>
            <DiscoverMatches />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-match"
        element={
          <ProtectedRoute>
            <CreateMatch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/match/:id"
        element={
          <ProtectedRoute>
            <MatchDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/discover" replace />} />
      <Route path="*" element={<Navigate to="/discover" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <LocationProvider>
          <AppRoutes />
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
}

const loaderStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  gap: '16px',
  color: '#667eea',
  fontFamily: 'Arial, sans-serif',
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '4px solid #e0e0f5',
  borderTop: '4px solid #667eea',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};
