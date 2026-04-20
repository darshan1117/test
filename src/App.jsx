import { lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Lazy loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreateEntry = lazy(() => import('./pages/CreateEntry'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const PageLoader = () => (
  <div className="loading-screen">
    <div className="spinner" />
    <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Loading...</p>
  </div>
);

import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/layout/ToastContainer';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ToastContainer />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />

              {/* Protected */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-entry"
                element={
                  <ProtectedRoute>
                    <CreateEntry />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-entry/:id"
                element={
                  <ProtectedRoute>
                    <CreateEntry />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
