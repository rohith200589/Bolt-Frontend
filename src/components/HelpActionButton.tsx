// src/components/HelpActionButton.tsx
import React, { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react'; // Import X and chat icon from lucide-react

interface HelpActionButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const HelpActionButton: React.FC<HelpActionButtonProps> = ({ onClick, isOpen }) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const getThemeFromDOM = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      return theme === 'dark' ? 'dark' : 'light';
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
  const darkThemeGradient = 'linear-gradient(to right top, #3f5efb, #fc466b, #ffa800)'; // Deeper blue to orange/gold

  const iconGradientStyle: React.CSSProperties = {
    backgroundImage: currentTheme === 'dark' ? darkThemeGradient : lightThemeGradient,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    display: 'inline-block',
  };

  const handleClick = () => {
    window.location.href = 'https://bolt.new/';
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-4 right-4 md:right-8 rounded-full transition-all duration-300 z-50
                  hover:bg-gray-100 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50
                  overflow-hidden w-20 h-20`} // Adjusted size to look cleaner
      aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
    >
      {isOpen ? (
        <X size={32} style={{ color: '#333333' }} />
      ) : (
        <MessageCircle size={40} style={iconGradientStyle} /> // Gradient chat icon
      )}
    </button>
  );
};

export default HelpActionButton;
