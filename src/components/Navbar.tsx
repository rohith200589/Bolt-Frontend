import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import ProfileDropdown from './ProfileDropdown';

interface NavbarProps {
  setCurrentPage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Scroll behavior state
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos <= 10) {
        setVisible(true);
      } else {
        setVisible(prevScrollPos > currentScrollPos);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const navLinks = [

   { name: 'Home', path: '/' },
    { name: 'QuizMe', path: '/mock-test-generator' },

     { name: 'DeepDive', path: '/quiz' },
         
    { name: 'Progress', path: '/progress' },
     { name: 'Visualize', path: '/ai-content-visualizer' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`bg-[var(--color-background-secondary)] shadow-sm py-2 sticky top-0 z-40 border-b border-[var(--color-border)] 
      transition-transform duration-300 ease-in-out ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" onClick={() => setCurrentPage('home')} className="flex items-center flex-shrink-0">
          <span className="font-extrabold text-xl text-gradient-red-orange transition-colors duration-300">
            Knovia AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setCurrentPage(link.path.replace('/', '') || 'home')}
              className={`text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-3 py-2 rounded-md
                font-medium transition-colors duration-200 relative group
                ${isActive(link.path) ? 'text-[var(--color-text-primary)] font-semibold' : ''}`}
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-text-accent)] transition-transform duration-300 origin-left block"
                style={{ transform: isActive(link.path) ? 'scaleX(1)' : 'scaleX(0)' }}></span>
            </Link>
          ))}
          <ThemeToggle />
          <ProfileDropdown />
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center">
          <ThemeToggle />
          <ProfileDropdown />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-3 p-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
              hover:bg-[var(--color-hover-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)]"
            aria-expanded={isOpen ? 'true' : 'false'}
            aria-label="Toggle navigation"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-[var(--color-background-secondary)] shadow-inner pb-2 transition-all duration-300 ease-in-out`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => {
                setCurrentPage(link.path.replace('/', '') || 'home');
                setIsOpen(false);
              }}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-hover-light)]
                ${isActive(link.path) ? 'text-[var(--color-text-primary)] bg-[var(--color-hover-light)] font-semibold' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
