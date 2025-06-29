import React, { useEffect, useState } from 'react';

// This declaration is for Tailwind CSS JIT mode to recognize CSS variables
// for ring colors, which are dynamically set via JS/CSS variables.
declare module 'react' {
  interface CSSProperties {
    '--tw-ring-color'?: string;
  }
}

interface MessageModalProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number; // Duration in ms after which the modal auto-closes
}

const MessageModal: React.FC<MessageModalProps> = ({
  message,
  type = 'info',
  onClose,
  duration = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true); // Animate in when component mounts

    const timer = setTimeout(() => {
      setIsVisible(false);
      // Give time for fade-out animation before calling onClose
      const closeTimer = setTimeout(onClose, 300);
      return () => clearTimeout(closeTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-[var(--color-feature-icon-2)]', // Green
    error: 'bg-[var(--color-progress-red-text)]', // Red
    info: 'bg-[var(--color-text-accent)]', // Blue
  }[type];

  const modalClasses = `
    fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold
    transition-all duration-300 ease-out z-50
    ${bgColor}
    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
  `;

  return (
    <div className={modalClasses} role="alert">
      <p>{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300); // Allow fade out
        }}
        className="absolute top-1 right-2 text-white hover:text-gray-200 text-lg leading-none"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default MessageModal;
