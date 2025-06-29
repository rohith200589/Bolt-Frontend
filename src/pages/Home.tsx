// Home.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import MessageModal from '../components/MessageModal';

interface HomeProps {
  // setCurrentPage prop is no longer needed when using React Router
}

const Home: React.FC<HomeProps> = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };
const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    setSubscribed(true);
    // Optionally hide it again after a few seconds
    setTimeout(() => setSubscribed(false), 3000);
  };
  const testimonials = [
    {
      id: 1,
      quote: "Knovia AI transformed my study habits. The interactive quizzes and personalized explanations are unmatched!",
      name: "Jane Doe",
      title: "University Student",
      avatarBg: "var(--color-feature-icon-1)",
      initials: "JD"
    },
    {
      id: 2,
      quote: "The progress tracker gives me clear insights. I've never been more motivated to learn and improve.",
      name: "Alex Smith",
      title: "High School Teacher",
      avatarBg: "var(--color-feature-icon-2)",
      initials: "AS"
    },
    {
      id: 3,
      quote: "As an educator, the Creator Studio empowers me to build and share engaging content effortlessly. A must-have!",
      name: "Emily Martin",
      title: "Online Course Creator",
      avatarBg: "var(--color-feature-icon-4)",
      initials: "EM"
    },
    {
      id: 4,
      quote: "I used to struggle with complex concepts, but Knovia AI's video explanations make everything clear and easy to grasp.",
      name: "Michael Chen",
      title: "High School Student",
      avatarBg: "var(--color-feature-icon-3)",
      initials: "MC"
    },
    {
      id: 5,
      quote: "The adaptive mock tests are incredible! They pinpoint exactly where I need to focus my efforts.",
      name: "Sarah Kim",
      title: "Graduate Student",
      avatarBg: "var(--color-button-primary-bg)",
      initials: "SK"
    },
    {
      id: 6,
      quote: "The community features are fantastic. It's great to connect with other learners and share resources.",
      name: "David Lee",
      title: "Lifelong Learner",
      avatarBg: "var(--color-button-secondary-text)",
      initials: "DL"
    },
  ];

  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="fade-in min-h-[calc(100vh-160px)] flex flex-col items-center">
      {showAlert && <MessageModal message={alertMessage} type={alertType} onClose={closeAlert} />}

      {/* Hero Section - Clean, High and Focused */}
      <section className="relative w-full overflow-hidden text-[var(--color-hero-text)] pt-20 pb-40 md:pt-32 md:pb-56 lg:pt-20 lg:pb-36 text-center transform-gpu transition-all duration-700 ease-in-out">
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center max-w-6xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-6 animate-slide-in-up drop-shadow-lg">
            Master Any Subject with <span className="block mt-4 text-gradient-red-orange">Knovia AI</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl opacity-95 mb-16 max-w-4xl mx-auto font-light animate-slide-in-up delay-200">
            Intelligent learning, personalized paths. Your future, amplified.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-in-up delay-400">
            <button
              onClick={() => navigate('/quiz')}
              className="bg-gradient-to-r from-cyan-400 to-[var(--color-button-primary-hover)] text-white font-semibold py-4 px-12 rounded-full text-xl md:text-2xl transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[var(--color-text-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-primary)] transform hover:scale-105 button-glow"
            >
              Start Your Free Journey
            </button>
            <button
              onClick={() => navigate('/about')}
              className="bg-gradient-to-r from-orange-400 to-red-600 text-white font-semibold py-4 px-12 rounded-full text-xl md:text-2xl transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[var(--color-text-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-primary)] transform hover:scale-105"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* --- Intuitive & Powerful Section --- */}
      <section className="py-20 md:py-32 w-full bg-[var(--color-background-primary)] -mt-16 relative z-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-extrabold text-center mb-16 text-gradient-blue-green animate-slide-in-up">
            An Intuitive Platform, Powering Your Growth
          </h2>
          {/* Modified: Added flex and overflow-x-auto for horizontal scroll with hidden scrollbar */}
          <div className="flex overflow-x-auto pb-6 space-x-8 lg:space-x-10 scrollbar-hide">
            {/* Feature Card 1: AI-Powered Learning */}
            <div
              className="min-w-[350px]  bg-[var(--color-background-secondary)] rounded-3xl p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 ease-in-out cursor-pointer flex flex-col items-center text-center border border-[var(--color-border)] animate-slide-in-up delay-100"
              onClick={() => navigate('/quiz')}
            >
              <div className="p-6 rounded-full bg-gradient-to-br from-[var(--color-feature-icon-1)] to-blue-400 text-white mb-8 shadow-xl transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gradient-red-orange">AI-Powered Explanations</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Unlock complex topics with dynamic video explanations and deep dives, tailored by AI.
              </p>
            </div>
            {/* Adaptive Mock Tests (first instance) */}
            <div
              className="min-w-[350px] bg-[var(--color-background-secondary)] rounded-3xl p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 ease-in-out cursor-pointer flex flex-col items-center text-center border border-[var(--color-border)] animate-slide-in-up delay-300"
              onClick={() => navigate('/mock-test-generator')}
            >
              <div className="p-6 rounded-full bg-gradient-to-br from-[var(--color-feature-icon-3)] to-purple-400 text-white mb-8 shadow-xl transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gradient-gold">Adaptive Mock Tests</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Simulate exam conditions with intelligently generated mock tests, focusing on your weakest areas.
              </p>
            </div>
            {/* Feature Card 2: Strategic Progress Tracking */}
           

            {/* Adaptive Mock Tests (second instance, if desired to keep a duplicate for scrolling effect) */}
          <div
  className="min-w-[350px] flex-wrap-0 bg-[var(--color-background-secondary)] rounded-3xl p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 ease-in-out cursor-pointer flex flex-col items-center text-center border border-[var(--color-border)] animate-slide-in-up delay-300"
  onClick={() => navigate('/ai-content-visualizer')}
>
  <div className="p-6 rounded-full bg-gradient-to-br from-[var(--color-feature-icon-4)] to-blue-400 text-white mb-8 shadow-xl transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
    {/* SVG icon representing data visualization or a screen with a graph */}
    <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H4V5h16v14zM6 10h2v7H6zm3 0h2v7H9zm3 0h2v7h-2zm3 0h2v7h-2z"/>
    </svg>
  </div>
  <h3 className="text-2xl font-bold mb-4 text-gradient-gold">AI Content Visualizer</h3>
  <p className="text-[var(--color-text-secondary)] leading-relaxed">
    Transform your notes and concepts into dynamic visual representations with AI, making complex information easier to understand and retain.
  </p>
</div>

 <div
              className="min-w-[350px]  bg-[var(--color-background-secondary)] rounded-3xl p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 ease-in-out cursor-pointer flex flex-col items-center text-center border border-[var(--color-border)] animate-slide-in-up delay-200"
              onClick={() => navigate('/progress')}
            >
              <div className="p-6 rounded-full bg-gradient-to-br from-[var(--color-feature-icon-2)] to-green-400 text-white mb-8 shadow-xl transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 11V3H8v8H2v10h20V11h-6zM10 5h4v6h-4V5zm-4 14v-6h2v6H6zm12 0h-2v-6h2v6z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gradient-purple-pink">Strategic Progress Tracking</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Visualize your learning path with detailed analytics and personalized insights for continuous improvement.
              </p>
            </div>
            {/* Feature Card 4: Community Creation */}
            <div
              className="min-w-[350px] bg-[var(--color-background-secondary)] rounded-3xl p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 ease-in-out cursor-pointer flex flex-col items-center text-center border border-[var(--color-border)] animate-slide-in-up delay-400"
              onClick={() => navigate('/creator-studio')}
            >
              <div className="p-6 rounded-full bg-gradient-to-br from-[var(--color-feature-icon-4)] to-orange-400 text-white mb-8 shadow-xl transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gradient-blue-green">Community Creation</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Contribute, collaborate, and share your expertise by creating engaging learning modules for others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- How Knovia AI Works Section (New) --- */}
      <section className="py-20 md:py-32 w-full bg-[var(--color-background-secondary)] border-t border-[var(--color-border)]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-16 text-gradient-red-orange animate-slide-in-up">
            How Knovia AI Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center animate-slide-in-up delay-100">
              <div className="p-6 rounded-full bg-[var(--color-feature-icon-1)] text-white mb-8 shadow-xl">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-2h2v2zm0-4H9v-6h2v6z"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gradient-blue-green">1. Input Your Topic</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Simply type in any subject, question, or even paste a video link. Our AI is ready to understand.
              </p>
            </div>
            <div className="flex flex-col items-center animate-slide-in-up delay-200">
              <div className="p-6 rounded-full bg-[var(--color-feature-icon-2)] text-white mb-8 shadow-xl">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3v8H9V8h2zm3 0v8h-2V8h2zm3 0v8h-2V8h2z"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gradient-purple-pink">2. Get AI Explanations</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Receive personalized video explanations, comprehensive summaries, or interactive diagrams generated on-the-fly.
              </p>
            </div>
            <div className="flex flex-col items-center animate-slide-in-up delay-300">
              <div className="p-6 rounded-full bg-[var(--color-feature-icon-3)] text-white mb-8 shadow-xl">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gradient-gold">3. Master with Quizzes</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Reinforce your knowledge with adaptive quizzes, track your progress, and identify areas for mastery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Testimonials / Success Stories Section --- */}
      <section className="py-20 md:py-32 w-full bg-[var(--color-background-primary)] border-t border-[var(--color-border)] overflow-hidden">
        <div className="container mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-extrabold text-center text-gradient-purple-pink animate-slide-in-up">
            Hear From Our Thriving Scholars
          </h2>
        </div>
        <div className="marquee-container">
          <div className="marquee-content">
            {duplicatedTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="marquee-item bg-[var(--color-background-secondary)] rounded-3xl p-8 shadow-xl border border-[var(--color-border)] transform-gpu transition-all duration-300 ease-in-out hover:shadow-2xl"
              >
                <p className="text-[var(--color-text-primary)] text-lg italic mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4 shadow-md" style={{ backgroundColor: testimonial.avatarBg }}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)] text-xl">{testimonial.name}</p>
                    <p className="text-[var(--color-text-secondary)] text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Our Commitment to Your Success Section (New) --- */}
      <section className="py-20 md:py-32 w-full bg-[var(--color-hover-light)] border-t border-[var(--color-border)]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-16 text-gradient-gold animate-slide-in-up">
            Our Commitment to Your Success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center animate-slide-in-up delay-100">
              <div className="p-6 rounded-full bg-[var(--color-feature-icon-4)] text-white mb-8 shadow-xl">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-2h2v2zm0-4H9v-6h2v6z"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gradient-red-orange">Cutting-Edge AI</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                We harness the latest advancements in AI to provide dynamic, personalized, and efficient learning experiences.
              </p>
            </div>
            <div className="flex flex-col items-center text-center animate-slide-in-up delay-200">
              <div className="p-6 rounded-full bg-[var(--color-feature-icon-2)] text-white mb-8 shadow-xl">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gradient-blue-green">Continuous Improvement</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Knovia AI is constantly evolving. We integrate user feedback and research to deliver the best learning tools.
              </p>
            </div>
            <div className="flex flex-col items-center text-center animate-slide-in-up delay-300">
              <div className="p-6 rounded-full bg-[var(--color-feature-icon-1)] text-white mb-8 shadow-xl">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.38 0 2.5 1.12 2.5 2.5S13.38 11 12 11s-2.5-1.12-2.5-2.5S10.62 6 12 6zm0 14c-2.03 0-4.45-.72-6-2.68C6.01 15.15 8.94 14 12 14s5.99 1.15 6 3.32c-1.55 1.96-3.97 2.68-6 2.68z"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gradient-purple-pink">User-Centric Design</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Your learning experience is our priority. We design for clarity, engagement, and accessibility.
              </p>
            </div>
            <div className="flex flex-col items-center text-center animate-slide-in-up delay-400">
              <div className="p-6 rounded-full bg-[var(--color-feature-icon-3)] text-white mb-8 shadow-xl">
                <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gradient-gold">Rich Multimedia</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Learning comes alive with dynamic video content, interactive elements, and engaging visuals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- More About Knovia AI Section --- */}
      <section className="py-20 md:py-32 w-full bg-[var(--color-background-secondary)] border-t border-[var(--color-border)]">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-in-up">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gradient-blue-green">
              Your Journey to Academic Excellence Starts Here
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed mb-6">
              At Knovia AI, we believe in empowering every learner with the tools they need to succeed. Our platform is built on the principles of **personalized learning, adaptive challenges, and community collaboration**. We're constantly innovating to bring you the most effective and engaging study experience possible.
            </p>
            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed mb-8">
              Whether you're preparing for a crucial exam, looking to deepen your understanding of a complex topic, or aiming to share your knowledge with others, Knovia AI provides a seamless and intuitive environment to **achieve your academic goals**. Dive into a world where learning is not just about memorization, but about true comprehension and growth.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-[var(--color-button-primary-bg)] text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[var(--color-text-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-secondary)] transform hover:scale-105 button-glow"
            >
              Join Our Community
            </button>
          </div>
          <div className="animate-slide-in-up delay-200">
            <img
              src="https://placehold.co/800x600/0a0a0a/e0e0e0?text=Knovia+AI+Learning"
              alt="Students learning with Knovia AI"
              className="rounded-3xl shadow-2xl w-full h-auto object-cover border border-[var(--color-border)] transform-gpu transition-all duration-500 ease-in-out hover:scale-[1.01]"
            />
          </div>
        </div>
      </section>

      {/* --- Final Call to Action Section (with rounded corners) --- */}
      <section className="w-full bg-gradient-to-r from-[var(--color-text-accent)] to-[var(--color-button-primary-hover)] py-20 md:py-32 text-white text-center shadow-inner rounded-tl-[80px] rounded-br-[80px] mt-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 animate-slide-in-up">
            Ready to Elevate Your Learning?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-12 max-w-3xl mx-auto animate-slide-in-up delay-200">
            Join the Knovia AI community today and experience the future of personalized education. It's free to start!
          </p>
           <div className="relative">
      <button
        onClick={handleSubscribe}
        className="bg-white text-[var(--color-text-accent)] font-bold py-4 px-12 rounded-full text-xl md:text-2xl transition-all duration-300 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75 transform hover:scale-105 button-glow"
      >
        Subscribe to our newsletter
      </button>

      {/* Popup */}
      {subscribed && (
        <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-opacity duration-300">
          Subscribed successfully!
        </div>
      )}
    </div>
        </div>
      </section>
    </div>
  );
};

export default Home;