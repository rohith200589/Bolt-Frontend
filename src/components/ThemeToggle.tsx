import React from 'react';
import { useTheme } from '../contexts/ThemeContext'; // Correct relative path

// This declaration is for Tailwind CSS JIT mode to recognize CSS variables
// for ring colors, which are dynamically set via JS/CSS variables.
declare module 'react' {
  interface CSSProperties {
    '--tw-ring-color'?: string;
  }
}

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 flex items-center rounded-full p-1
                 focus:outline-none focus:ring-2 focus:ring-offset-2
                 transition-colors duration-300 ease-in-out cursor-pointer"
      style={{
        backgroundColor: 'var(--color-button-secondary-bg)', // Consistent background for the track
        '--tw-ring-color': 'var(--color-text-accent)'
      }}
      aria-label="Toggle theme"
    >
      {/* Background track (subtle gradient for better look) */}
      <span
        className={`absolute inset-0 rounded-full transition-all duration-300 ease-in-out`}
        style={{
          background: theme === 'light'
            ? 'linear-gradient(to right, var(--color-hover-light), var(--color-button-secondary-bg))'
            : 'linear-gradient(to right, var(--color-hero-gradient-start), var(--color-hero-gradient-end))'
        }}
      ></span>

      {/* Slider knob */}
      <span
        className={`relative w-6 h-6 rounded-full shadow-md
                    transform transition-transform duration-300 ease-in-out
                    flex items-center justify-center`}
        style={{
          transform: theme === 'dark' ? 'translateX(24px)' : 'translateX(0)',
          backgroundColor: theme === 'dark' ? 'var(--color-background-primary)' : 'var(--color-background-secondary)'
        }}
      >
        {theme === 'light' ? (
          // Sun icon for light mode
          <svg
            className="w-4 h-4"
            style={{ color: 'var(--color-feature-icon-4)' }} /* Orange for sun */
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.746 6.028a.75.75 0 01-.998-.601 3.5 3.5 0 00-2.858-2.858.75.75 0 01-.601-.998.75.75 0 00-.999-.601A9 9 0 001.5 12c0 2.83 1.144 5.405 3 7.292a.75.75 0 00.601-.999.75.75 0 01.998-.601 3.5 3.5 0 002.858-2.858.75.75 0 01.601-.998.75.75 0 00.999-.601A9 9 0 0012 22.5c2.83 0 5.405-1.144 7.292-3a.75.75 0 00.601.999.75.75 0 01.998.601 3.5 3.5 0 002.858 2.858.75.75 0 01.601.998.75.75 0 00.999.601A9 9 0 0022.5 12c0-2.83-1.144-5.405-3-7.292a.75.75 0 00-.601-.999.75.75 0 01-.998-.601 3.5 3.5 0 00-2.858-2.858.75.75 0 01-.601-.998A.75.75 0 0012.75 2.25V3a.75.75 0 01-.75-.75zM12 7a5 5 0 100 10 5 5 0 000-10z" />
          </svg>
        ) : (
          // Moon icon for dark mode
          <svg
            className="w-4 h-4"
            style={{ color: 'var(--color-profile-icon)' }} /* Use profile icon color for moon */
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.976.234l.288.767a4.538 4.538 0 003.504 2.47C17.062 5.592 19 7.766 19 10.5c0 2.902-2.304 5.28-5.275 5.562a.75.75 0 01-.482-.822l.473-1.424a.75.75 0 01.716-.51C15.861 13.916 17 12.38 17 10.5c0-1.418-1.077-2.735-2.676-3.056a.75.75 0 01-.58-.871l.275-.926a.75.75 0 01.998-.584l.872.275a.75.75 0 01.581.999l-.275.926a6.002 6.002 0 004.303 6.643.75.75 0 01-.729 1.054l-.453-.113a9.002 9.002 0 01-1.398 1.096 7.502 7.502 0 00-5.881 3.492.75.75 0 01-.98.175l-.54-.27a.75.75 0 01-.175-.98l.27-.54a7.502 7.502 0 003.492-5.88.75.75 0 011.096-1.398l-.113-.453a6.002 6.002 0 006.643 4.303.75.75 0 01.926-.275l.926.275a.75.75 0 01.999-.581l-.275-.926a.75.75 0 00-.58-.871z" clipRule="evenodd" />
          </svg>
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
