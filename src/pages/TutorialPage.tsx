// src/pages/TutorialPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, FileText, Type, ChevronRight, Wand2, Edit, Share2, Save } from 'lucide-react'; // Import Lucide icons

// We'll reuse the tutorial content directly here.
// Note: We're making a simplified version of the content component's props for this standalone page.
// The "Start Visualizing Now!" button will navigate to the visualizer.
const TutorialPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartVisualizing = () => {
    // Optionally, mark tutorial as seen here too if navigating from this page
    if (typeof window !== 'undefined') {
      localStorage.setItem('visualizerTutorialSeen', 'true');
    }
    navigate('/ai-content-visualizer'); // Navigate to the visualizer page
  };

  const handleCloseTutorial = () => {
    // Just navigate back or to home if user closes it from the dedicated tutorial page
    navigate('/'); // Or navigate('/ai-content-visualizer'); if they were coming from there
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[var(--color-background-primary)] text-[var(--color-text-primary)] fade-in p-6 text-center overflow-auto relative">
      {/* Cross Mark (X) Button at the top right */}
      <button
        onClick={handleCloseTutorial}
        className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-accent)] transition-colors duration-200"
        aria-label="Close tutorial"
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
            Click the **"Generate"** button. Our AI will analyze your input and create the diagram.
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
        onClick={handleStartVisualizing}
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

export default TutorialPage;