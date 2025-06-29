import React, { useState, useEffect, useMemo } from 'react';
import MessageModal from '../components/MessageModal'; // Ensure this path is correct

// Define a type for content items for better type safety
interface ContentItem {
  id: string;
  title: string;
  type: 'quiz' | 'lecture' | 'video' | 'mock-test';
  description: string;
  createdAt: string;
  views: number;
  comments: number;
  status: 'draft' | 'published';
}

const CreatorStudio: React.FC = () => {
  // --- State Management for Content Creation Form ---
  const [contentTitle, setContentTitle] = useState<string>('');
  const [contentType, setContentType] = useState<ContentItem['type']>('quiz');
  const [contentDescription, setContentDescription] = useState<string>('');

  // --- State Management for Alerts/Modals ---
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

  // --- State for Tab Navigation (renamed for clarity, still functions as tabs) ---
  const [activeSection, setActiveSection] = useState<'overview' | 'create' | 'manage' | 'analytics'>('overview');

  // --- State to hold all created content ---
  const [myContent, setMyContent] = useState<ContentItem[]>([]);

  // --- Simulate fetching content on component mount ---
  useEffect(() => {
    // In a real application, this would be an API call to a backend.
    const dummyContent: ContentItem[] = [
      {
        id: '1',
        title: 'Introduction to React Hooks',
        type: 'lecture',
        description: 'Comprehensive notes on useState, useEffect, and custom hooks, including best practices and common pitfalls. This lecture provides a solid foundation for building efficient and scalable React applications.',
        createdAt: '2024-05-20',
        views: 1200,
        comments: 35,
        status: 'published',
      },
      {
        id: '2',
        title: 'Algebra Basics Quiz',
        type: 'quiz',
        description: 'A 10-question quiz covering fundamental algebra concepts, including linear equations, inequalities, and basic polynomials. Test your understanding before moving on to advanced topics.',
        createdAt: '2024-06-01',
        views: 850,
        comments: 12,
        status: 'published',
      },
      {
        id: '3',
        title: 'Machine Learning Concepts (Draft)',
        type: 'video',
        description: 'An introductory video explaining core machine learning algorithms like linear regression, decision trees, and clustering. Ideal for beginners looking to understand the basics of AI.',
        createdAt: '2024-06-15',
        views: 500, // Still has views even as draft if it was previously published or viewed internally
        comments: 8,
        status: 'draft',
      },
      {
        id: '4',
        title: 'Advanced Data Structures Mock Test',
        type: 'mock-test',
        description: 'A comprehensive mock test designed to assess your knowledge of advanced data structures such as AVL trees, B-trees, and hash tables. Includes challenging problems to prepare for competitive programming.',
        createdAt: '2024-06-25',
        views: 200,
        comments: 3,
        status: 'draft',
      },
      {
        id: '5',
        title: 'Quantum Physics Explained',
        type: 'lecture',
        description: 'Deep dive into the fascinating world of quantum mechanics, covering wave-particle duality, superposition, and entanglement.',
        createdAt: '2024-06-10',
        views: 1500,
        comments: 42,
        status: 'published',
      },
      {
        id: '6',
        title: 'Introduction to Cybersecurity',
        type: 'video',
        description: 'A video series introducing fundamental concepts of cybersecurity, including network security, cryptography, and common attack vectors.',
        createdAt: '2024-07-01',
        views: 700,
        comments: 18,
        status: 'published',
      },
      {
        id: '7',
        title: 'European History: Renaissance',
        type: 'lecture',
        description: 'An overview of the Renaissance period in Europe, focusing on key figures, art, science, and political changes.',
        createdAt: '2024-07-05',
        views: 300,
        comments: 5,
        status: 'draft',
      },
    ];
    setMyContent(dummyContent);
  }, []);

  // --- Handler for creating new content ---
  const handleCreateContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentTitle.trim() || !contentDescription.trim()) {
      setAlertMessage('Please fill in both title and description!');
      setAlertType('error');
      setShowAlert(true);
      return;
    }

    const newContent: ContentItem = {
      id: String(Date.now()), // Simple unique ID for demonstration
      title: contentTitle.trim(),
      type: contentType,
      description: contentDescription.trim(),
      createdAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      views: 0,
      comments: 0,
      status: 'draft', // New content always starts as a draft
    };

    setMyContent((prevContent) => [...prevContent, newContent]); // Add new content to state
    setAlertMessage(`Content "${newContent.title}" created successfully as a draft!`);
    setAlertType('success');
    setShowAlert(true);

    console.log('New Content Created:', newContent);
    setContentTitle('');
    setContentDescription('');
    setActiveSection('manage'); // Auto-switch to "My Content"
  };

  // --- Handler to close the alert modal ---
  const closeAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  // --- Handlers for Content Management Actions (Edit, Delete, Publish) ---
  const handleEditContent = (id: string) => {
    setAlertMessage(`Initiating edit for content ID: ${id}. (Feature to be implemented)`);
    setAlertType('info');
    setShowAlert(true);
    console.log('Edit content ID:', id);
  };

  const handleDeleteContent = (id: string) => {
    setMyContent((prevContent) => prevContent.filter((item) => item.id !== id));
    setAlertMessage('Content deleted successfully!');
    setAlertType('success');
    setShowAlert(true);
    console.log('Delete content ID:', id);
  };

  const handlePublishContent = (id: string) => {
    setMyContent((prevContent) =>
      prevContent.map((item) =>
        item.id === id ? { ...item, status: 'published', createdAt: new Date().toISOString().split('T')[0] } : item
      )
    );
    setAlertMessage('Content published successfully!');
    setAlertType('success');
    setShowAlert(true);
    console.log('Publish content ID:', id);
  };

  // --- Analytics Calculations (using useMemo for performance) ---
  const totalViews = useMemo(() => {
    return myContent.reduce((sum, item) => sum + item.views, 0);
  }, [myContent]);

  const totalComments = useMemo(() => {
    return myContent.reduce((sum, item) => sum + item.comments, 0);
  }, [myContent]);

  const publishedContentCount = useMemo(() => {
    return myContent.filter((item) => item.status === 'published').length;
  }, [myContent]);

  const draftContentCount = useMemo(() => {
    return myContent.filter((item) => item.status === 'draft').length;
  }, [myContent]);

  const mostViewedContent = useMemo(() => {
    if (myContent.length === 0) return null;
    return myContent.reduce((prev, current) =>
      prev.views > current.views ? prev : current
    );
  }, [myContent]);

  const recentContent = useMemo(() => {
    return [...myContent]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5); // Get top 5 most recent
  }, [myContent]);

  const publishedContent = useMemo(() => {
    return myContent.filter(item => item.status === 'published');
  }, [myContent]);

  const draftContent = useMemo(() => {
    return myContent.filter(item => item.status === 'draft');
  }, [myContent]);

  // --- Dummy data for charts and feedback ---
  const viewsByContentType = useMemo(() => {
    const data = myContent.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + item.views;
      return acc;
    }, {} as Record<ContentItem['type'], number>);

    // Convert to an array for easier rendering
    return Object.entries(data).map(([type, views]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      views: views,
      percentage: ((views / totalViews) * 100).toFixed(1) + '%',
    })).sort((a, b) => b.views - a.views);
  }, [myContent, totalViews]);

  const publicationTrend = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const data: Record<string, number> = {};
    for (let i = 0; i < 6; i++) { // Last 6 months
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        data[monthYear] = 0; // Initialize with 0
    }

    myContent.forEach(item => {
        const itemDate = new Date(item.createdAt);
        if (itemDate.getFullYear() === currentYear && (currentYear - itemDate.getFullYear()) * 12 + (new Date().getMonth() - itemDate.getMonth()) < 6) {
            const monthYear = `${itemDate.toLocaleString('default', { month: 'short' })} ${itemDate.getFullYear()}`;
            if (data[monthYear] !== undefined) {
                data[monthYear]++;
            }
        }
    });

    return Object.entries(data).sort(([aMonthYear], [bMonthYear]) => {
        const [aMonth, aYear] = aMonthYear.split(' ');
        const [bMonth, bYear] = bMonthYear.split(' ');
        const dateA = new Date(`${aMonth} 1, ${aYear}`);
        const dateB = new Date(`${bMonth} 1, ${bYear}`);
        return dateA.getTime() - dateB.getTime();
    });
}, [myContent]);


  const dummyFeedback = [
    { id: 1, content: "This lecture on React Hooks was incredibly clear and helpful!", author: "Student A", type: "Positive" },
    { id: 2, content: "The Algebra Quiz was challenging but fair, loved it!", author: "Student B", type: "Positive" },
    { id: 3, content: "Could you add more examples to the ML video?", author: "Student C", type: "Suggestion" },
    { id: 4, content: "Found a small typo in the Data Structures mock test, question 7.", author: "Student D", type: "Bug Report" },
    { id: 5, content: "Excellent explanation of Quantum Physics, truly demystified complex topics.", author: "Student E", type: "Positive" },
  ];


  return (
    <div className="bg-[var(--color-background-primary)] min-h-screen p-4 md:p-10 lg:p-4 fade-in flex flex-col items-center w-full">
      {showAlert && (
        <MessageModal message={alertMessage} type={alertType} onClose={closeAlert} />
      )}

      <div className="w-full max-w-screen-xl mx-auto"> {/* Main container for full width */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 lg:mb-12">
          <h1 className="text-5xl font-extrabold text-[var(--color-text-primary)] leading-tight mb-4 md:mb-0 gemini-star-gradient">
            Knovia AI Creator Studio
          </h1>
          <button
            onClick={() => setActiveSection('create')}
            className="bg-[var(--color-button-primary-bg)] hover:bg-[var(--color-button-primary-hover)] text-white font-semibold py-3 px-8 rounded-full text-lg
                       transition-all duration-300 shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-primary)] button-glow flex items-center justify-center"
          >
            <svg className="w-6 h-6 mr-3 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
            Create New Content
          </button>
        </div>

        {/* Dynamic Section Navigation (Inspired by Supabase sidebar/top tabs) */}
        <div className="bg-[var(--color-background-secondary)] rounded-2xl shadow-xl p-4 mb-10 border border-[var(--color-border)]">
          <nav className="flex flex-wrap gap-2 justify-center">
            <button
              className={`flex-1 min-w-[120px] text-center px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300
                ${activeSection === 'overview'
                  ? 'bg-[var(--color-text-accent)] text-white shadow-lg'
                  : 'bg-[var(--color-hover-light)] text-[var(--color-text-primary)] hover:bg-[var(--color-button-secondary-hover)]'
                }`}
              onClick={() => setActiveSection('overview')}
            >
              Overview
            </button>
            <button
              className={`flex-1 min-w-[120px] text-center px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300
                ${activeSection === 'create'
                  ? 'bg-[var(--color-text-accent)] text-white shadow-lg'
                  : 'bg-[var(--color-hover-light)] text-[var(--color-text-primary)] hover:bg-[var(--color-button-secondary-hover)]'
                }`}
              onClick={() => setActiveSection('create')}
            >
              Content Builder
            </button>
            <button
              className={`flex-1 min-w-[120px] text-center px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300
                ${activeSection === 'manage'
                  ? 'bg-[var(--color-text-accent)] text-white shadow-lg'
                  : 'bg-[var(--color-hover-light)] text-[var(--color-text-primary)] hover:bg-[var(--color-button-secondary-hover)]'
                }`}
              onClick={() => setActiveSection('manage')}
            >
              My Content
            </button>
            <button
              className={`flex-1 min-w-[120px] text-center px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300
                ${activeSection === 'analytics'
                  ? 'bg-[var(--color-text-accent)] text-white shadow-lg'
                  : 'bg-[var(--color-hover-light)] text-[var(--color-text-primary)] hover:bg-[var(--color-button-secondary-hover)]'
                }`}
              onClick={() => setActiveSection('analytics')}
            >
              Insights & Analytics
            </button>
          </nav>
        </div>

        {/* --- Section Content Renders Here --- */}

        {/* Overview Dashboard (Inspired by Power BI/Google Analytics dashboard widgets) */}
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in-up">
            {/* Quick Stats Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-[var(--color-background-secondary)] p-6 rounded-2xl shadow-lg border border-[var(--color-border)] flex flex-col justify-between animate-scale-in delay-100">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Total Views</h3>
                <p className="text-5xl font-bold text-gradient-blue-green leading-none">{totalViews.toLocaleString()}</p>
                <p className="text-[var(--color-text-secondary)] text-sm mt-3">All content, all time.</p>
              </div>
              <div className="bg-[var(--color-background-secondary)] p-6 rounded-2xl shadow-lg border border-[var(--color-border)] flex flex-col justify-between animate-scale-in delay-200">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Total Comments</h3>
                <p className="text-5xl font-bold text-gradient-purple-pink leading-none">{totalComments.toLocaleString()}</p>
                <p className="text-[var(--color-text-secondary)] text-sm mt-3">Student interactions.</p>
              </div>
              <div className="bg-[var(--color-background-secondary)] p-6 rounded-2xl shadow-lg border border-[var(--color-border)] flex flex-col justify-between animate-scale-in delay-300">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Published Content</h3>
                <p className="text-5xl font-bold text-gradient-gold leading-none">{publishedContentCount}</p>
                <p className="text-[var(--color-text-secondary)] text-sm mt-3">Live for students.</p>
              </div>
              <div className="bg-[var(--color-background-secondary)] p-6 rounded-2xl shadow-lg border border-[var(--color-border)] flex flex-col justify-between animate-scale-in delay-400">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Content Drafts</h3>
                <p className="text-5xl font-bold text-gradient-red-orange leading-none">{draftContentCount}</p>
                <p className="text-[var(--color-text-secondary)] text-sm mt-3">Work in progress.</p>
              </div>
            </div>

            {/* Most Popular Content Card */}
            {mostViewedContent && (
              <div className="lg:col-span-1 bg-[var(--color-background-secondary)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)] animate-slide-in-up delay-500">
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
                  <svg className="w-8 h-8 mr-3 text-[var(--color-feature-icon-1)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Top Performer
                </h3>
                <p className="text-3xl font-extrabold text-[var(--color-text-accent)] mb-2">{mostViewedContent.title}</p>
                <p className="text-xl text-[var(--color-text-secondary)] mb-2">Type: <span className="font-semibold text-[var(--color-text-primary)]">{mostViewedContent.type.charAt(0).toUpperCase() + mostViewedContent.type.slice(1)}</span></p>
                <p className="text-xl text-[var(--color-text-secondary)] mb-4">Views: <span className="font-semibold text-[var(--color-text-primary)]">{mostViewedContent.views.toLocaleString()}</span></p>
                <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                  {mostViewedContent.description.substring(0, 180)}{mostViewedContent.description.length > 180 ? '...' : ''}
                </p>
              </div>
            )}

            {/* Recent Activity / Content Feed */}
            <div className="lg:col-span-2 bg-[var(--color-background-secondary)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)] animate-slide-in-up delay-600">
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-5 flex items-center">
                <svg className="w-8 h-8 mr-3 text-[var(--color-feature-icon-2)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M9 20v-2m3 2v-2m3 2v-2M9 13h2m3 0h2M1 10h19a2 2 0 012 2v8a2 2 0 01-2 2H1a2 2 0 01-2-2v-8a2 2 0 012-2z"></path></svg>
                Recent Content Activity
              </h3>
              {recentContent.length === 0 ? (
                <p className="text-[var(--color-text-secondary)]">No recent activity.</p>
              ) : (
                <ul className="space-y-4">
                  {recentContent.map((item) => (
                    <li key={item.id} className="flex items-center justify-between bg-[var(--color-hover-light)] p-4 rounded-lg border border-[var(--color-input-border)] animate-scale-in" style={{animationDelay: `${0.1 + (recentContent.indexOf(item) * 0.05)}s`}}>
                      <div>
                        <p className="font-semibold text-[var(--color-text-primary)] text-lg">{item.title}</p>
                        <p className="text-[var(--color-text-secondary)] text-sm">
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.status.charAt(0).toUpperCase() + item.status.slice(1)} • Created: {item.createdAt}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-[var(--color-text-accent)] font-bold flex items-center">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                          {item.views.toLocaleString()}
                        </span>
                        <span className="text-[var(--color-feature-icon-2)] font-bold flex items-center">
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                          {item.comments}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Call to Action for new content */}
            <div className="lg:col-span-1 bg-[var(--color-background-secondary)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)] flex flex-col justify-center items-center text-center animate-slide-in-up delay-700">
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Ready to Create Something New?</h3>
              <p className="text-[var(--color-text-secondary)] mb-6">
                Unleash your expertise. Your next great content idea is just a click away!
              </p>
              <button
                onClick={() => setActiveSection('create')}
                className="bg-[var(--color-feature-icon-3)] hover:bg-opacity-90 text-white font-semibold py-3 px-8 rounded-full text-lg
                           transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-secondary)]"
              >
                Start Creating Now
              </button>
            </div>
          </div>
        )}

        {/* --- Content Builder Form --- */}
        {activeSection === 'create' && (
          <div className="bg-[var(--color-background-secondary)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)] animate-slide-in-up">
            <h2 className="text-3xl font-bold mb-8 text-[var(--color-text-primary)] text-center">
              Build New Educational Content
            </h2>
            <form onSubmit={handleCreateContent} className="space-y-6">
              <div>
                <label
                  htmlFor="contentTitle"
                  className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
                >
                  Content Title
                </label>
                <input
                  type="text"
                  id="contentTitle"
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-input-border)]
                             bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)]
                             transition-colors duration-200 shadow-sm"
                  placeholder="e.g., Mastering JavaScript Arrays, World War II Key Events"
                />
              </div>

              <div>
                <label
                  htmlFor="contentType"
                  className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
                >
                  Content Type
                </label>
                <select
                  id="contentType"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as ContentItem['type'])}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-input-border)]
                             bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)]
                             transition-colors duration-200 shadow-sm appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="quiz">Quiz</option>
                  <option value="lecture">Lecture Notes</option>
                  <option value="video">Video Explanation</option>
                  <option value="mock-test">Mock Test</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contentDescription"
                  className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
                >
                  Content Description / Details
                  <span className="text-[var(--color-text-secondary)] text-sm ml-2">(Supports basic Markdown for formatting)</span>
                </label>
                {/* Placeholder for a future Rich Text Editor */}
                <textarea
                  id="contentDescription"
                  rows={10} // More rows for detailed content
                  value={contentDescription}
                  onChange={(e) => setContentDescription(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[var(--color-input-border)]
                             bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
                             focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)]
                             transition-colors duration-200 shadow-sm resize-y custom-scrollbar"
                  placeholder="Provide a detailed description of your content. For quizzes, list questions and options. For lectures, outline key topics and explanations. Use markdown for headings, lists, bold text, etc."
                ></textarea>
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="bg-[var(--color-button-primary-bg)] hover:bg-[var(--color-button-primary-hover)] text-white font-semibold py-3 px-10 rounded-full text-lg
                             transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-secondary)] button-glow"
                >
                  Publish Draft & Continue
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- My Content Management --- */}
        {activeSection === 'manage' && (
          <div className="bg-[var(--color-background-secondary)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)] animate-slide-in-up">
            <h2 className="text-3xl font-bold mb-6 text-[var(--color-text-primary)] text-center">
              My Created Content
            </h2>
            {myContent.length === 0 ? (
              <p className="text-center text-lg text-[var(--color-text-secondary)] py-10">
                You haven't created any content yet. <span className="text-[var(--color-text-accent)] cursor-pointer hover:underline" onClick={() => setActiveSection('create')}>Start by building your first piece!</span>
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Published Content Section */}
                <div className="bg-[var(--color-hover-light)] p-6 rounded-xl border border-[var(--color-input-border)] shadow-md">
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
                    <svg className="w-7 h-7 mr-2 text-[var(--color-progress-green-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Published ({publishedContentCount})
                  </h3>
                  {publishedContent.length === 0 ? (
                    <p className="text-[var(--color-text-secondary)]">No published content yet.</p>
                  ) : (
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      <ul className="space-y-4 pr-2"> {/* Added pr-2 for scrollbar spacing */}
                        {publishedContent.map((item) => (
                          <li key={item.id} className="bg-[var(--color-background-primary)] p-4 rounded-lg shadow-sm border border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="mb-2 sm:mb-0 sm:mr-4">
                              <p className="font-semibold text-[var(--color-text-primary)] text-lg">{item.title}</p>
                              <p className="text-[var(--color-text-secondary)] text-sm">
                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • Views: {item.views.toLocaleString()} • Comments: {item.comments}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditContent(item.id)}
                                className="text-[var(--color-text-accent)] hover:text-[var(--color-button-primary-hover)] transition-colors duration-200 p-2 rounded-full hover:bg-[var(--color-feature-bg-hover)]"
                                title="Edit Content"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                              </button>
                              <button
                                onClick={() => handleDeleteContent(item.id)}
                                className="text-[var(--color-progress-red-text)] hover:text-red-700 transition-colors duration-200 p-2 rounded-full hover:bg-[var(--color-feature-bg-hover)]"
                                title="Delete Content"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Draft Content Section */}
                <div className="bg-[var(--color-hover-light)] p-6 rounded-xl border border-[var(--color-input-border)] shadow-md">
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center">
                    <svg className="w-7 h-7 mr-2 text-[var(--color-progress-blue-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    Drafts ({draftContentCount})
                  </h3>
                  {draftContent.length === 0 ? (
                    <p className="text-[var(--color-text-secondary)]">No content in drafts.</p>
                  ) : (
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      <ul className="space-y-4 pr-2">
                        {draftContent.map((item) => (
                          <li key={item.id} className="bg-[var(--color-background-primary)] p-4 rounded-lg shadow-sm border border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="mb-2 sm:mb-0 sm:mr-4">
                              <p className="font-semibold text-[var(--color-text-primary)] text-lg">{item.title}</p>
                              <p className="text-[var(--color-text-secondary)] text-sm">
                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • Created: {item.createdAt}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditContent(item.id)}
                                className="text-[var(--color-text-accent)] hover:text-[var(--color-button-primary-hover)] transition-colors duration-200 p-2 rounded-full hover:bg-[var(--color-feature-bg-hover)]"
                                title="Edit Content"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                              </button>
                              <button
                                onClick={() => handlePublishContent(item.id)}
                                className="text-[var(--color-feature-icon-2)] hover:text-[var(--color-progress-green-text)] transition-colors duration-200 p-2 rounded-full hover:bg-[var(--color-feature-bg-hover)]"
                                title="Publish Content"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                              </button>
                              <button
                                onClick={() => handleDeleteContent(item.id)}
                                className="text-[var(--color-progress-red-text)] hover:text-red-700 transition-colors duration-200 p-2 rounded-full hover:bg-[var(--color-feature-bg-hover)]"
                                title="Delete Content"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- Analytics & Insights Dashboard --- */}
        {activeSection === 'analytics' && (
          <div className="bg-[var(--color-background-secondary)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)] animate-slide-in-up">
            <h2 className="text-3xl font-bold mb-8 text-[var(--color-text-primary)] text-center">
              Content Performance & Audience Insights
            </h2>

            {myContent.length === 0 ? (
              <p className="text-center text-lg text-[var(--color-text-secondary)] py-10">
                No content created yet to display detailed analytics. Start creating to see your impact!
              </p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Overall Stats Cards - Re-using the overview cards for consistency */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="bg-[var(--color-background-primary)] p-6 rounded-2xl shadow-md border border-[var(--color-border)]">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Total Views</h3>
                    <p className="text-5xl font-bold text-gradient-blue-green leading-none">{totalViews.toLocaleString()}</p>
                    <p className="text-[var(--color-text-secondary)] text-sm mt-3">Overall engagement.</p>
                  </div>
                  <div className="bg-[var(--color-background-primary)] p-6 rounded-2xl shadow-md border border-[var(--color-border)]">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Total Comments</h3>
                    <p className="text-5xl font-bold text-gradient-purple-pink leading-none">{totalComments.toLocaleString()}</p>
                    <p className="text-[var(--color-text-secondary)] text-sm mt-3">Direct feedback.</p>
                  </div>
                  <div className="bg-[var(--color-background-primary)] p-6 rounded-2xl shadow-md border border-[var(--color-border)]">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Published Content</h3>
                    <p className="text-5xl font-bold text-gradient-gold leading-none">{publishedContentCount}</p>
                    <p className="text-[var(--color-text-secondary)] text-sm mt-3">Accessible to learners.</p>
                  </div>
                  <div className="bg-[var(--color-background-primary)] p-6 rounded-2xl shadow-md border border-[var(--color-border)]">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Content Types</h3>
                    <p className="text-5xl font-bold text-gradient-red-orange leading-none">{myContent.length}</p>
                    <p className="text-[var(--color-text-secondary)] text-sm mt-3">Total distinct pieces.</p>
                  </div>
                </div>

                {/* Mock Chart: Views by Content Type - Now with dummy data visualization */}
                <div className="lg:col-span-2 bg-[var(--color-background-primary)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)]">
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Views by Content Type</h3>
                  <div className="h-64 relative flex flex-col justify-end p-4 bg-[var(--color-hover-light)] rounded-lg text-[var(--color-text-secondary)] border border-[var(--color-input-border)]">
                    {/* Simulated Bars */}
                    <div className="flex justify-around items-end h-full">
                      {viewsByContentType.map((data, index) => (
                        <div key={data.type} className="flex flex-col items-center mx-2" style={{ height: '100%', minWidth: '60px' }}>
                          <span className="text-xs font-semibold mb-1 text-[var(--color-text-primary)]">{data.views.toLocaleString()}</span>
                          <div
                            className="w-12 rounded-t-lg transition-all duration-500 ease-out"
                            style={{
                              height: `${(data.views / mostViewedContent!.views) * 100}%`,
                              backgroundColor: `hsl(${180 + index * 40}, 70%, 50%)`, // Different color per bar
                            }}
                          ></div>
                          <span className="text-xs text-[var(--color-text-secondary)] mt-1 text-center">{data.type} ({data.percentage})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-sm mt-4">
                    This visualization shows the distribution of total views across different content formats.
                    It helps identify which types resonate most with your audience.
                  </p>
                </div>

                {/* Top 3 Performing Content List */}
                <div className="lg:col-span-1 bg-[var(--color-background-primary)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)]">
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Top 3 Content Pieces</h3>
                  {myContent.length === 0 ? (
                    <p className="text-[var(--color-text-secondary)]">No content to rank yet.</p>
                  ) : (
                    <ul className="space-y-4">
                      {myContent.sort((a, b) => b.views - a.views).slice(0, 3).map((item, index) => (
                        <li key={item.id} className="bg-[var(--color-hover-light)] p-4 rounded-lg border border-[var(--color-input-border)] flex items-center animate-scale-in" style={{animationDelay: `${0.1 + (index * 0.05)}s`}}>
                          <span className="text-3xl font-bold mr-4 text-[var(--color-text-accent)]">{index + 1}.</span>
                          <div>
                            <p className="font-semibold text-[var(--color-text-primary)]">{item.title}</p>
                            <p className="text-[var(--color-text-secondary)] text-sm">Views: {item.views.toLocaleString()}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="text-[var(--color-text-secondary)] text-sm mt-4">Quick insights into your most impactful content.</p>
                </div>

                {/* Mock Chart: Content Publication Trend - Now with dummy data visualization */}
                <div className="lg:col-span-1 bg-[var(--color-background-primary)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)]">
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Publication Trend (Last 6 Months)</h3>
                  <div className="h-64 relative p-4 bg-[var(--color-hover-light)] rounded-lg text-[var(--color-text-secondary)] border border-[var(--color-input-border)] flex flex-col justify-end">
                    {/* Simulated Line Chart */}
                    <div className="flex justify-between items-end h-full">
                        {publicationTrend.map(([monthYear, count], index) => (
                            <div key={monthYear} className="flex flex-col items-center mx-2">
                                <span className="text-xs font-semibold mb-1 text-[var(--color-text-primary)]">{count}</span>
                                <div
                                    className="w-12 rounded-t-lg bg-[var(--color-feature-icon-2)] transition-all duration-500 ease-out"
                                    style={{ height: `${count * 10}%` }} // Scale based on count (max 10 content pieces/month for visual effect)
                                ></div>
                                <span className="text-xs text-[var(--color-text-secondary)] mt-1">{monthYear.split(' ')[0]}</span>
                            </div>
                        ))}
                    </div>
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-sm mt-4">
                    This trend visualizes your content creation frequency over the past six months,
                    helping you monitor consistency.
                  </p>
                </div>

                {/* Mock Card: Student Feedback Snapshot - Now with dummy data */}
                <div className="lg:col-span-2 bg-[var(--color-background-primary)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)]">
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Student Feedback Snapshot</h3>
                  <div className="max-h-64 overflow-y-auto custom-scrollbar pr-2">
                    {dummyFeedback.length === 0 ? (
                      <p className="text-[var(--color-text-secondary)]">No recent feedback.</p>
                    ) : (
                      <ul className="space-y-4">
                        {dummyFeedback.map((feedback) => (
                          <li key={feedback.id} className="bg-[var(--color-hover-light)] p-4 rounded-lg border border-[var(--color-input-border)]">
                            <p className="font-semibold text-[var(--color-text-primary)] mb-1">"{feedback.content}"</p>
                            <p className="text-[var(--color-text-secondary)] text-sm flex justify-between items-center">
                              <span>— {feedback.author}</span>
                              <span className={`py-0.5 px-2 rounded-full text-xs font-medium ${
                                feedback.type === 'Positive' ? 'bg-[var(--color-progress-green-bg)] text-[var(--color-progress-green-text)]' :
                                feedback.type === 'Suggestion' ? 'bg-[var(--color-progress-blue-bg)] text-[var(--color-progress-blue-text)]' :
                                'bg-[var(--color-progress-red-bg)] text-[var(--color-progress-red-text)]'
                              }`}>
                                {feedback.type}
                              </span>
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-sm mt-4">
                    Get a quick glance at recent comments and classify feedback types.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Text */}
        <div className="mt-16 pt-8 border-t border-[var(--color-border)] text-center">
          <h2 className="text-3xl font-bold mb-4 text-[var(--color-text-primary)] gemini-star-gradient">
            Empowering Education, Together.
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] mb-4 max-w-2xl mx-auto leading-relaxed">
            Knovia AI's Creator Studio is built to amplify your impact. Every quiz, lecture, and video you share enriches our community and helps millions of learners achieve their academic goals.
          </p>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Thank you for being a pioneer in knowledge sharing. Your contributions shape the future of learning!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatorStudio;