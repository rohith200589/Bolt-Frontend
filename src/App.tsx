// App.tsx (No Auth)
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Layout from './components/Layout';
import VisualizerTutorialWrapper from './pages/PageLoaderWithTutorial';

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

  useEffect(() => {
    setCurrentPage(getPageNameFromPath(location.pathname));
  }, [location.pathname]);

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <Routes>
        {/* Public Routes (now everything is public) */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route path="/progress" element={<ProgressTracker />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/mock-test-generator" element={<MockTestGenerator />} />
        <Route path="/creator-studio" element={<CreatorStudio />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/ai-content-visualizer" element={<VisualizerTutorialWrapper />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
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
