// src/components/VisualizerTutorialWrapper.tsx - ENHANCED TUTORIAL CONTENT

import React, { useState } from 'react'; // No useEffect needed in content component
import Visualizer from '../pages/Visualizer'; // Import the actual Visualizer component
import { FileText, Type, ChevronRight, Wand2, Edit, Share2, Save, XCircle } from 'lucide-react'; // Import Lucide icons

// Key for localStorage specific to the Visualizer tutorial
const VISUALIZER_TUTORIAL_KEY = 'visualizerTutorialSeen';

// --- Visualizer Specific Tutorial Content Component ---
interface VisualizerTutorialContentProps {
  onStart: () => void; // Callback when user clicks 'Start Visualizing'
  onClose: () => void; // Callback when user clicks the 'X' (close/skip) button
}

const VisualizerTutorialContent: React.FC<VisualizerTutorialContentProps> = ({ onStart, onClose }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[var(--color-background-primary)] text-[var(--color-text-primary)] fade-in p-6 text-center overflow-auto">
      {/* Cross Mark (X) Button at the top right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)] transition-colors duration-200"
        aria-label="Skip tutorial"
      >
        <XCircle size={36} /> {/* Larger X icon */}
      </button>

      <div className="animate-bounce-slow text-7xl text-[var(--color-text-accent)] mb-8">
        📊
      </div>
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 gemini-star-gradient leading-tight">
        Welcome to AI Content Visualizer!
      </h2>
      <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed mb-8">
        Transform your textual data into stunning, interactive charts and diagrams using the power of AI.
        Follow these simple steps to get started:
      </p>

      {/* --- Step-by-Step Flow Description --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-12 max-w-4xl w-full">

        {/* Step 1: Input Content */}
        <div className="flex flex-col items-center bg-[var(--color-background-secondary)] p-6 rounded-lg shadow-xl border border-[var(--color-border)] animate-fade-in delay-100">
          <div className="text-5xl text-[var(--color-feature-icon-1)] mb-4">
            <FileText size={64} />
          </div>
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">1. Enter Your Content</h3>
          <p className="text-[var(--color-text-secondary)] text-sm md:text-base">
            Start by typing or pasting your text/data into the input area. This is what our AI will analyze.
          </p>
        </div>

        {/* Arrow for Flow */}
        <div className="hidden lg:flex items-center justify-center text-[var(--color-text-accent)]">
          <ChevronRight size={48} />
        </div>
        <div className="flex lg:hidden items-center justify-center text-[var(--color-text-accent)] my-4">
          <ChevronRight size={32} className="rotate-90" />
        </div>

        {/* Step 2: Choose Diagram Type */}
        <div className="flex flex-col items-center bg-[var(--color-background-secondary)] p-6 rounded-lg shadow-xl border border-[var(--color-border)] animate-fade-in delay-200">
          <div className="text-5xl text-[var(--color-feature-icon-2)] mb-4">
            <Type size={64} />
          </div>
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">2. Select Diagram Type</h3>
          <p className="text-[var(--color-text-secondary)] text-sm md:text-base">
            Choose a suitable diagram type (e.g., Bar Chart, Pie Chart, Flowchart) for your data.
          </p>
        </div>

        {/* Arrow for Flow */}
        <div className="hidden lg:flex items-center justify-center text-[var(--color-text-accent)]">
          <ChevronRight size={48} />
        </div>
        <div className="flex lg:hidden items-center justify-center text-[var(--color-text-accent)] my-4">
          <ChevronRight size={32} className="rotate-90" />
        </div>

        {/* Step 3: Generate */}
        <div className="flex flex-col items-center bg-[var(--color-background-secondary)] p-6 rounded-lg shadow-xl border border-[var(--color-border)] animate-fade-in delay-300">
          <div className="text-5xl text-[var(--color-feature-icon-3)] mb-4">
            <Wand2 size={64} />
          </div>
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">3. Generate Diagram</h3>
          <p className="text-[var(--color-text-secondary)] text-sm md:text-base">
            Click the <b>"Generate"</b> button. Our AI will analyze your input and create the diagram.
          </p>
        </div>

      </div> {/* End of Step-by-Step Grid */}

      {/* --- Advanced Capabilities Section --- */}
      <h3 className="text-3xl font-extrabold mb-6 gemini-star-gradient leading-tight mt-8">
        Unlock Full Potential
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl w-full">
        <div className="flex flex-col items-center bg-[var(--color-background-secondary)] p-4 rounded-lg shadow-md border border-[var(--color-border)] animate-fade-in delay-400">
          <Edit size={40} className="text-[var(--color-feature-icon-1)] mb-3" />
          <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">Edit & Customize</h4>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Refine your diagrams using available shapes, properties, and styling options.
          </p>
        </div>
        <div className="flex flex-col items-center bg-[var(--color-background-secondary)] p-4 rounded-lg shadow-md border border-[var(--color-border)] animate-fade-in delay-500">
          <Share2 size={40} className="text-[var(--color-feature-icon-2)] mb-3" />
          <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">Share & Collaborate</h4>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Easily share your visualizations with others or integrate them into your projects.
          </p>
        </div>
        <div className="flex flex-col items-center bg-[var(--color-background-secondary)] p-4 rounded-lg shadow-md border border-[var(--color-border)] animate-fade-in delay-600">
          <Save size={40} className="text-[var(--color-feature-icon-3)] mb-3" />
          <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">Save & Manage</h4>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Save your creations to your profile for future access and management.
          </p>
        </div>
      </div>

      <button
        onClick={onStart}
        className="bg-[var(--color-button-primary-bg)] hover:bg-[var(--color-button-primary-hover)] text-white font-semibold py-4 px-12 rounded-full text-xl
                   transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-secondary)] button-glow"
      >
        Start Visualizing Now!
      </button>
      <p className="text-sm text-[var(--color-text-secondary)] mt-4">
        You can revisit this tutorial from the Settings page anytime.
      </p>
    </div>
  );
};

// --- VisualizerTutorialWrapper Component (remains the same as before) ---
const VisualizerTutorialWrapper: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(VISUALIZER_TUTORIAL_KEY) !== 'true';
    }
    return true;
  });

  const handleTutorialStart = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(VISUALIZER_TUTORIAL_KEY, 'true');
    }
    setShowTutorial(false);
  };

  const handleTutorialClose = () => {
    // Treat 'closing' as 'starting' for the purpose of marking as seen
    // If user closes, they've acknowledged the tutorial and wish to proceed.
    handleTutorialStart();
  };

  return showTutorial ? (
    <VisualizerTutorialContent onStart={handleTutorialStart} onClose={handleTutorialClose} />
  ) : (
    <Visualizer />
  );
};

export default VisualizerTutorialWrapper;