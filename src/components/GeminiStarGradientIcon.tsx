// src/components/LucideSparklesGradientStrokeIcon.tsx
import React from 'react';

interface LucideSparklesGradientStrokeIconProps {
  theme: 'light' | 'dark';
  size?: number; // Optional size prop
  strokeWidth?: number; // Optional stroke width prop
}

const LucideSparklesGradientStrokeIcon: React.FC<LucideSparklesGradientStrokeIconProps> = ({
  theme,
  size = 24,
  strokeWidth = 2, // Default stroke width for Lucide icons
}) => {
  // Define gradient stops directly for light theme (for stroke)
  const lightGradientStops = [
    { offset: '0%', color: '#00c6ff' },   // Light blue
    { offset: '50%', color: '#0072ff' },   // Royal blue
    { offset: '100%', color: '#6a00ff' }  // Purple
  ];

  // Define gradient stops directly for dark theme (for stroke)
  const darkGradientStops = [
    { offset: '0%', color: '#3f5efb' }, // Deeper blue
    { offset: '50%', color: '#fc466b' }, // Reddish pink
    { offset: '100%', color: '#ffa800' } // Orange/gold
  ];

  const currentGradientStops = theme === 'dark' ? darkGradientStops : lightGradientStops;
  const gradientId = `lucide-sparkles-stroke-gradient-${theme}`; // Unique ID for each theme's gradient

  // Lucide Sparkles icon's path data (extracted from lucide.dev)
  const sparklesPathData = "M10 4c-.544 1.189-1.298 2.227-2.268 3.064L6.1 9H2l-.304-.54C1.042 7.643.5 6.096.5 4.5 2.146 3.655 3.328 2.368 4.298 1.136L5.9 0h3.9l.2 1.3c.091.564.125.864.25 1.3L10 4zM16 13l-1.39-1.92L12 10.6l1.39-1.92L16 7.4l1.39 1.92L20 10.6l-1.39 1.92L16 13zM15 15l-1 1h-2l-1-1h-2l-1 1v2l1 1h2l1-1h2l1 1v-2l-1-1zM20 5l-1-1h-2l-1 1h-2l-1 1v2l1 1h2l1-1h2l1 1v-2l-1-1zM10 20c-.544 1.189-1.298 2.227-2.268 3.064L6.1 24H2l-.304-.54C1.042 22.643.5 21.096.5 19.5c1.646-.845 2.828-2.132 3.798-3.364L5.9 15h3.9l.2 1.3c.091.564.125.864.25 1.3L10 20z";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24" // Lucide uses a 24x24 viewBox
      fill="none" // Important: No fill, we only want a stroke
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Sparkles icon with gradient border"
    >
      {/* Define the gradient inside the SVG's definitions */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          {currentGradientStops.map((stop, index) => (
            <stop key={index} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
      </defs>
      {/* Apply the gradient as the stroke to the sparkles path */}
      <path
        d={sparklesPathData}
        stroke={`url(#${gradientId})`} // Apply gradient to stroke
        strokeWidth={strokeWidth}
        strokeLinecap="round" // Standard Lucide stroke properties
        strokeLinejoin="round" // Standard Lucide stroke properties
      />
    </svg>
  );
};

export default LucideSparklesGradientStrokeIcon;