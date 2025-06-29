// Layout.tsx
import React, { ReactNode, useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

import HelpActionButton from './HelpActionButton';
import UserQueryForm from './UserQueryForm';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage }) => {
  // State to manage the visibility of the help query form
  const [isHelpFormOpen, setIsHelpFormOpen] = useState(false);

  // Effect to scroll to the top of the page whenever currentPage changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: for smooth scrolling
    });
  }, [currentPage]); // Re-run this effect when currentPage changes

  // Function to toggle the help form visibility
  const toggleHelpForm = () => {
    setIsHelpFormOpen(prevState => !prevState);
  };

  // Determine if the current page is the AI Content Visualizer
  const isAiContentVisualizer = currentPage === "ai-content-visualizer";

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background-primary)] transition-colors duration-300">
      {/* Conditionally render Navbar: ONLY show if NOT ai-content-visualizer */}
      {!isAiContentVisualizer && <Navbar setCurrentPage={setCurrentPage} />}
      
      {/* Main content area: Adjust classes based on whether it's the visualizer page */}
      <main className={`flex-grow transition-colors duration-300 ${isAiContentVisualizer ? '' : 'container mx-auto px-4 sm:px-6 lg:px-2 py-2 md:py-2 max-w-screen-2xl'}`}>
        {children}
      </main>
      
      {/* Conditionally render Footer: ONLY show if NOT ai-content-visualizer AND if it's a designated homepage */}
      {!isAiContentVisualizer && (currentPage === "Home" || currentPage === "home" || currentPage === "/") && <Footer />}

      {/* Conditionally render Help Action Button: ONLY show if NOT ai-content-visualizer */}
      {!isAiContentVisualizer && <HelpActionButton onClick={toggleHelpForm} isOpen={isHelpFormOpen} />}

      {/* Conditionally render User Query Form: ONLY show if NOT ai-content-visualizer AND if form is open */}
      {!isAiContentVisualizer && isHelpFormOpen && <UserQueryForm onClose={toggleHelpForm} />}
    </div>
  );
};

export default Layout;