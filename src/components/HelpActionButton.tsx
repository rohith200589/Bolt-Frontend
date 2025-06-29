// src/components/HelpActionButton.tsx
import React, { useState, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react'; // Import Sparkles and X from lucide-react

interface HelpActionButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const HelpActionButton: React.FC<HelpActionButtonProps> = ({ onClick, isOpen }) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const getThemeFromDOM = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      return (theme === 'dark' ? 'dark' : 'light');
    };
    setCurrentTheme(getThemeFromDOM());

    const observer = new MutationObserver(() => {
      setCurrentTheme(getThemeFromDOM());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Define gradients directly within the component
  const lightThemeGradient = 'linear-gradient(to right top, #00c6ff, #0072ff, #6a00ff)'; // Light blue to purple
  const darkThemeGradient = 'linear-gradient(to right top, #3f5efb, #fc466b, #ffa800)';   // Deeper blue to orange/gold

  const iconGradientStyle: React.CSSProperties = {
    backgroundImage: currentTheme === 'dark' ? darkThemeGradient : lightThemeGradient,
    WebkitBackgroundClip: 'text', // For Webkit browsers
    backgroundClip: 'text',       // Standard
    color: 'transparent',         // Make the icon's color transparent
    display: 'inline-block',      // Ensures properties apply correctly
  };

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-4 right-4 md:right-8 p-4 rounded-full transition-all duration-300 z-50
                   hover:bg-gray-100 ring-4 ring-blue-400
                  flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50`}
      aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
    >
      {isOpen ? (
        // Lucide X icon for close, with specific color
        <X size={24} style={{ color: '#333333' }} /> // Adjust size if 'lg' equivalent is needed for Lucide
      ) : (
        // Lucide Sparkles icon with gradient style
        <Sparkles size={24} style={{color: '#11EBFFFF' }} /> // Adjust size if 'lg' equivalent is needed for Lucide
      )}
    </button>
  );
};

export default HelpActionButton;