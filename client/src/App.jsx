import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ToastProvider from './components/ToastProvider';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';

// Simple authentication check using token in localStorage
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    const handleAuthChange = () => setToken(localStorage.getItem('token'));
    window.addEventListener('authChanged', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('authChanged', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  return (
    <>
      <Router>
        <AnimatePresence mode="wait">
          {token ? (
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
              {/* Mobile overlay */}
              {mobileOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileOpen(false)}
                  className="fixed inset-0 z-30 md:hidden bg-black/40 backdrop-blur-sm"
                />
              )}

              {/* Sidebar */}
              <motion.div
                initial={false}
                animate={{ x: mobileOpen ? 0 : -256 }}
                transition={{ duration: 0.3 }}
                className="md:static fixed inset-y-0 left-0 w-64 md:w-64"
              >
                <Sidebar onCloseMobile={() => setMobileOpen(false)} />
              </motion.div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar onOpenMobile={() => setMobileOpen(true)} />

                <main className="flex-1 overflow-auto">
                  <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <PrivateRoute>
                            <Dashboard />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/tasks"
                        element={
                          <PrivateRoute>
                            <Tasks />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/analytics"
                        element={
                          <PrivateRoute>
                            <Analytics />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/calendar"
                        element={
                          <PrivateRoute>
                            <Calendar />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <PrivateRoute>
                            <Settings />
                          </PrivateRoute>
                        }
                      />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
        </AnimatePresence>
      </Router>
      <ToastProvider />
    </>
  );
};

export default App;
