import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for React Router

interface AboutProps {
  // No setCurrentPage prop needed with React Router
}

const About: React.FC<AboutProps> = () => {
  const navigate = useNavigate(); // Initialize the navigate hook

  const tutorials = [
    {
      id: 1,
      title: "Unlock Topics with AI Explanations",
      description: "Learn how Knovia AI generates personalized video explanations, summaries, and diagrams from any input or video link.",
      icon: (
        <svg className="h-12 w-12 text-blue-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      ),
      path: "/quiz" // Path to the Quiz/AI explanation tool
    },
    {
      id: 2,
      title: "Master with Adaptive Mock Tests",
      description: "Discover how our adaptive mock tests pinpoint your weak areas, creating personalized exams for effective study.",
      icon: (
        <svg className="h-12 w-12 text-purple-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
      path: "/mock-test-generator" // Path to the Mock Test Generator
    },
    {
      id: 3,
      title: "Track Your Journey with Progress Analytics",
      description: "Explore your learning patterns with detailed insights and a visual progress tracker, guiding your path to mastery.",
      icon: (
        <svg className="h-12 w-12 text-green-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 11V3H8v8H2v10h20V11h-6zM10 5h4v6h-4V5zm-4 14v-6h2v6H6zm12 0h-2v-6h2v6z"/>
        </svg>
      ),
      path: "/progress" // Path to the Progress Tracker
    },
    {
      id: 4,
      title: "Create & Share in the Creator Studio",
      description: "Learn how to build and share your own engaging learning modules with the Knovia AI community.",
      icon: (
        <svg className="h-12 w-12 text-orange-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
      ),
      path: "/creator-studio" // Path to the Creator Studio
    }
  ];

  return (
    <div className="bg-[var(--color-background-secondary)] p-8 rounded-2xl shadow-lg fade-in min-h-[calc(100vh-160px)]">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-8 text-gradient-red-orange text-center animate-slide-in-up">
          About Knovia AI
        </h1>
        <p className="text-xl md:text-2xl leading-relaxed mb-8 text-[var(--color-text-secondary)] text-center max-w-3xl mx-auto animate-slide-in-up delay-100">
          Your ultimate intelligent learning companion. We're here to transform how you learn, understand, and excel.
        </p>

    

        {/* What You'll Learn Section */}
        <section className="py-16">
          <h2 className="text-4xl font-bold mb-10 text-gradient-blue-green text-center animate-slide-in-up delay-200">
            How Knovia AI Empowers Your Success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
            {/* Benefit Card 1 */}
            <div className="bg-[var(--color-background-primary)] rounded-xl p-6 shadow-md border border-[var(--color-border)] animate-slide-in-up delay-300">
              <h3 className="text-2xl font-semibold mb-3 text-[var(--color-text-primary)] flex items-center">
                <span className="p-2 rounded-full bg-[var(--color-feature-icon-1)] text-white mr-3">💡</span> Personalized Learning Paths
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Knovia AI adapts to your unique learning style and pace. Get content and quizzes tailored to your strengths and weaknesses, ensuring efficient and effective study sessions.
              </p>
            </div>
            {/* Benefit Card 2 */}
            <div className="bg-[var(--color-background-primary)] rounded-xl p-6 shadow-md border border-[var(--color-border)] animate-slide-in-up delay-400">
              <h3 className="text-2xl font-semibold mb-3 text-[var(--color-text-primary)] flex items-center">
                <span className="p-2 rounded-full bg-[var(--color-feature-icon-2)] text-white mr-3">⚡</span> Deep Comprehension, Not Just Memorization
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Our AI-powered explanations, dynamic videos, and interactive elements help you grasp complex concepts thoroughly, moving beyond surface-level recall.
              </p>
            </div>
            {/* Benefit Card 3 */}
            <div className="bg-[var(--color-background-primary)] rounded-xl p-6 shadow-md border border-[var(--color-border)] animate-slide-in-up delay-500">
              <h3 className="text-2xl font-semibold mb-3 text-[var(--color-text-primary)] flex items-center">
                <span className="p-2 rounded-full bg-[var(--color-feature-icon-3)] text-white mr-3">📈</span> Continuous Growth & Improvement
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                With real-time progress tracking and adaptive mock tests, you'll always know where you stand and what to focus on next to achieve mastery.
              </p>
            </div>
            {/* Benefit Card 4 */}
            <div className="bg-[var(--color-background-primary)] rounded-xl p-6 shadow-md border border-[var(--color-border)] animate-slide-in-up delay-600">
              <h3 className="text-2xl font-semibold mb-3 text-[var(--color-text-primary)] flex items-center">
                <span className="p-2 rounded-full bg-[var(--color-feature-icon-4)] text-white mr-3">🤝</span> Vibrant Learning Community
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Connect with peers, share resources, and even create your own learning content using the Creator Studio. Learning is better together!
              </p>
            </div>
          </div>
        </section>

    

        {/* Get Started / How to Use Section */}
        <section className="py-16">
          <h2 className="text-4xl font-bold mb-10 text-gradient-purple-pink text-center animate-slide-in-up delay-700">
            Dive Into Knovia AI: Your Tutorial Hub
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                className="bg-[var(--color-background-primary)] rounded-xl p-6 shadow-lg border border-[var(--color-border)] transform hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center animate-slide-in-up"
                onClick={() => navigate(tutorial.path)} // Navigate to tool-specific page
              >
                <div className="mb-4">{tutorial.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-[var(--color-text-primary)]">{tutorial.title}</h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{tutorial.description}</p>
                <button className="mt-4 text-sm text-[var(--color-text-accent)] hover:underline">
                  Go to Tool &rarr;
                </button>
              </div>
            ))}
          </div>
        </section>

        

        {/* Latest Updates Section (Optional - keep concise or remove if not actively updating this page) */}
        <section className="py-16 border-t border-[var(--color-border)] mt-12">
          <h2 className="text-4xl font-bold mb-10 text-gradient-gold text-center animate-slide-in-up">
            What's New in Knovia AI
          </h2>
          <div className="max-w-3xl mx-auto text-[var(--color-text-secondary)] space-y-6">
            <p className="leading-relaxed">
              We're constantly enhancing Knovia AI to bring you the best learning experience. Here are some of our latest improvements and features:
            </p>
            <ul className="list-disc list-inside text-left space-y-2">
              <li>**Enhanced AI Explanation Models:** More accurate and comprehensive explanations for even the most niche topics.</li>
              <li>**Interactive Diagram Generation:** Our AI can now generate customizable diagrams to visualize complex concepts.</li>
              <li>**Community Content Moderation Tools:** New features for creators to manage their shared content more effectively.</li>
              <li>**Performance Optimizations:** Faster loading times and smoother interactions across the platform.</li>
            </ul>
            <p className="leading-relaxed">
              Stay tuned for more exciting updates as we continue to evolve Knovia AI!
            </p>
          </div>
        </section>

        

        {/* Call to Action */}
        <section className="mt-16 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gradient-red-orange animate-slide-in-up">
            Ready to Experience the Future of Learning?
          </h2>
          <button
            onClick={() => navigate('/login')} // Navigate to login/signup
            className="bg-gradient-to-r from-[var(--color-button-primary-bg)] to-[var(--color-button-primary-hover)] text-white font-semibold py-4 px-12 rounded-full text-xl md:text-2xl transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[var(--color-text-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-secondary)] transform hover:scale-105 button-glow"
          >
            Start Your Free Journey Now!
          </button>
        </section>
      </div>
    </div>
  );
};

export default About;