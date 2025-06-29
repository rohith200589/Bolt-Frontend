// App.tsx (Updated)
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './hooks/useAuth';

// Components
import Layout from './components/Layout';
import { AuthForm } from './components/AuthForm';
import VisualizerTutorialWrapper from './pages/PageLoaderWithTutorial';
// import Visualizer from './pages/Visualizer.jsx'; // No longer directly used in routes, but may be by wrapper

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ProgressTracker from './pages/ProgressTracker';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import MockTestGenerator from './pages/MockTestGenerator';
import CreatorStudio from './pages/CreatorStudio';
import Quiz from './pages/convoAI.js';
import TutorialPage from './pages/TutorialPage.js';


const AppContent: React.FC = () => {
  const getPageNameFromPath = (pathname: string) => {
    if (pathname === '/') return 'Home';
    const pathSegment = pathname.split('/')[1];
    return pathSegment || 'Home';
  };

  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<string>(getPageNameFromPath(location.pathname));
  const { user, loading } = useAuth();

  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    setCurrentPage(getPageNameFromPath(location.pathname));
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-text-accent)]"></div>
        <p className="ml-4 mt-4 text-xl">Loading application...</p>
      </div>
    );
  }

  return (
    <>
      {isLoginPage ? (
        <Routes>
          <Route path="/login" element={!user ? <AuthForm /> : <Navigate to="/" replace />} />
          {user && <Route path="/login" element={<Navigate to="/" replace />} />}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
          <Routes>
            {/* Public Routes (accessible to everyone, but within the layout) */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* NEW: Dedicated Tutorial Page Route */}
            <Route path="/tutorial" element={<TutorialPage />} /> {/* <--- NEW ROUTE */}

            {/* Protected Routes (require authentication) */}
            {user ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/progress" element={<ProgressTracker />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/mock-test-generator" element={<MockTestGenerator />} />
                <Route path="/creator-studio" element={<CreatorStudio />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/ai-content-visualizer" element={<VisualizerTutorialWrapper />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </Layout>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;