import React, { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Define the shape for a stored score, matching what MockTestGenerator saves
interface StoredScore {
    id: string; // Unique ID for the score entry
    title: string;
    score: number;
    totalQuestions: number;
    date: string; // Date of the test
}

// Dummy data interfaces for new sections (in a real app, these would come from a backend)
interface VideoGenerated {
    id: string;
    title: string;
    date: string;
    duration: string;
}

interface SeminarAttended {
    id: string;
    name: string;
    date: string;
    status: 'attended' | 'missed';
}

interface RequestSent {
    id: string;
    type: string; // e.g., 'feature', 'bug', 'feedback'
    date: string;
    status: 'pending' | 'resolved';
}

interface LearningPathStep {
    id: string;
    title: string;
    status: 'completed' | 'in-progress' | 'not-started';
    progress?: number; // 0-100
}

interface DailyActivityDay {
    day: number;
    isActive: boolean;
    quizCount: number;
}

interface LeaderboardUser {
    id: string;
    name: string;
    totalScore: number;
    levelName: string;
    badgeComponent: React.ReactNode;
}


// --- SVG Badge Components (with new names and shapes) ---
const LearnerInitiateBadge: React.FC = () => (
    <svg width="40" height="40" viewBox="0 0 100 100" className="inline-block mr-2 flex-shrink-0">
        <circle cx="50" cy="50" r="40" fill="#CD7F32"/> {/* Bronze */}
        <text x="50" y="60" textAnchor="middle" fontSize="35" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">LI</text>
    </svg>
);

const KnowledgeSeekerBadge: React.FC = () => (
    <svg width="40" height="40" viewBox="0 0 100 100" className="inline-block mr-2 flex-shrink-0">
        <rect x="10" y="10" width="80" height="80" rx="15" ry="15" fill="#C0C0C0"/> {/* Silver - Rounded Square */}
        <text x="50" y="60" textAnchor="middle" fontSize="35" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">KS</text>
    </svg>
);

const MasterExplainerBadge: React.FC = () => (
    <svg width="40" height="40" viewBox="0 0 100 100" className="inline-block mr-2 flex-shrink-0">
        <polygon points="50,5 61,39 99,39 69,61 80,95 50,75 20,95 31,61 1,39 39,39" fill="#FFD700"/> {/* Gold - Star */}
        <text x="50" y="60" textAnchor="middle" fontSize="30" fontWeight="bold" fill="#333" fontFamily="Arial, sans-serif">ME</text>
    </svg>
);

const InsightArchitectBadge: React.FC = () => (
    <svg width="40" height="40" viewBox="0 0 100 100" className="inline-block mr-2 flex-shrink-0">
        <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="#E5E4E2"/> {/* Platinum - Hexagon */}
        <text x="50" y="60" textAnchor="middle" fontSize="35" fontWeight="bold" fill="#333" fontFamily="Arial, sans-serif">IA</text>
    </svg>
);

const WisdomZenithBadge: React.FC = () => (
    <svg width="40" height="40" viewBox="0 0 100 100" className="inline-block mr-2 flex-shrink-0">
        <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="#4ECDC4" stroke="#2C3E50" strokeWidth="5"/> {/* Diamond */}
        <text x="50" y="60" textAnchor="middle" fontSize="35" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">WZ</text>
    </svg>
);

// --- Leveling System Configuration with new badges ---
const LEVEL_THRESHOLDS = [
    { name: 'Learner Initiate', points: 0, badge: <LearnerInitiateBadge /> },
    { name: 'Knowledge Seeker', points: 200, badge: <KnowledgeSeekerBadge /> },
    { name: 'Master Explainer', points: 500, badge: <MasterExplainerBadge /> },
    { name: 'Insight Architect', points: 1000, badge: <InsightArchitectBadge /> },
    { name: 'Wisdom Zenith', points: 2000, badge: <WisdomZenithBadge /> },
];

const calculateUserLevel = (totalScore: number) => {
    let currentLevel = LEVEL_THRESHOLDS[0];
    let nextLevel = null;

    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
        if (totalScore >= LEVEL_THRESHOLDS[i].points) {
            currentLevel = LEVEL_THRESHOLDS[i];
        }
        if (totalScore < LEVEL_THRESHOLDS[i].points && nextLevel === null) {
            if (i + 1 < LEVEL_THRESHOLDS.length) {
                nextLevel = LEVEL_THRESHOLDS[i + 1];
            }
        }
    }

    const pointsToNextLevel = nextLevel ? nextLevel.points - totalScore : 0;
    const progressDenominator = nextLevel ? (nextLevel.points - currentLevel.points) : 1; // Avoid division by zero
    const progressToNextLevel = nextLevel ? ((totalScore - currentLevel.points) / progressDenominator) * 100 : 100;

    return { currentLevel, nextLevel, pointsToNextLevel, progressToNextLevel: Math.max(0, Math.min(100, progressToNextLevel)) }; // Clamp progress between 0 and 100
};

// --- Circular Progress Indicator Component ---
interface CircularProgressProps {
    percentage: number;
    radius?: number;
    strokeWidth?: number;
    color?: string;
    bgColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
    percentage,
    radius = 70,
    strokeWidth = 10,
    color = 'var(--color-text-accent)',
    bgColor = '#4B5563'
}) => {
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const offset = circumference - (percentage / 100) * circumference;

    const size = radius * 2;

    return (
        <svg
            width="50%"
            height="50%"
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90"
        >
            <circle
                stroke={bgColor}
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <circle
                stroke={color}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                style={{ transition: 'stroke-dashoffset 0.35s' }}
            />
            <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="font-bold text-lg"
                fill="var(--color-text-primary)"
                transform={`rotate(90 ${radius} ${radius})`}
            >
                {`${percentage.toFixed(0)}%`}
            </text>
        </svg>
    );
};

const ProgressTracker: React.FC = () => {
    const [quizResults, setQuizResults] = useState<StoredScore[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'leaderboard'>('dashboard'); // New state for tabs

    // Dummy data states for other sections
    const [videosGenerated, setVideosGenerated] = useState<VideoGenerated[]>([]);
    const [seminarsAttended, setSeminarsAttended] = useState<SeminarAttended[]>([]);
    const [requestsSent, setRequestsSent] = useState<RequestSent[]>([]);
    const [learningPath, setLearningPath] = useState<LearningPathStep[]>([]);
    const [dailyActivity, setDailyActivity] = useState<DailyActivityDay[]>([]); // Array for daily activity (e.g., 30 days)

    // Dummy Global Leaderboard Data
    const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardUser[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch actual quiz results from localStorage
                const storedScores = localStorage.getItem('quizScores');
                if (storedScores) {
                    const parsedScores: StoredScore[] = JSON.parse(storedScores);
                    // Sort by date descending (most recent first)
                    const sortedScores = parsedScores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setQuizResults(sortedScores);
                } else {
                    setQuizResults([]);
                }

                // Generate dummy data for other sections
                setVideosGenerated([
                    { id: 'v1', title: 'Physics Basics Explained', date: '2023-01-15', duration: '12:30' },
                    { id: 'v2', title: 'Math for Beginners', date: '2023-02-01', duration: '08:45' },
                    { id: 'v3', title: 'Chemistry Concepts', date: '2023-03-10', duration: '15:00' },
                    { id: 'v4', title: 'Algebra Review', date: '2023-03-20', duration: '05:00' },
                    { id: 'v5', title: 'Introduction to AI', date: '2023-04-01', duration: '10:00' },
                    { id: 'v6', title: 'Data Structures Deep Dive', date: '2023-04-15', duration: '18:20' },
                ]);
                setSeminarsAttended([
                    { id: 's1', name: 'AI in Healthcare: Future Trends and Applications', date: '2023-01-20', status: 'attended' },
                    { id: 's2', name: 'Future of Quantum Computing', date: '2023-02-15', status: 'attended' },
                    { id: 's3', name: 'Ethical AI Development and Governance', date: '2023-03-05', status: 'missed' },
                    { id: 's4', name: 'Deep Learning Architectures', date: '2023-03-25', status: 'attended' },
                    { id: 's5', name: 'Cybersecurity Essentials', date: '2023-04-10', status: 'attended' },
                ]);
                setRequestsSent([
                    { id: 'r1', type: 'Feature Request: Dark Mode', date: '2023-01-25', status: 'pending' },
                    { id: 'r2', type: 'Bug Report: Chart Glitch', date: '2023-02-10', status: 'resolved' },
                    { id: 'r3', type: 'Feedback: New Quiz Type Idea', date: '2023-03-01', status: 'pending' },
                    { id: 'r4', type: 'Support: Account Issue', date: '2023-04-05', status: 'resolved' },
                ]);
                setLearningPath([
                    { id: 'lp1', title: 'Introduction to AI', status: 'completed', progress: 100 },
                    { id: 'lp2', title: 'Machine Learning Fundamentals', status: 'in-progress', progress: 60 },
                    { id: 'lp3', title: 'Deep Learning Advanced', status: 'not-started', progress: 0 },
                    { id: 'lp4', title: 'Natural Language Processing', status: 'not-started', progress: 0 },
                    { id: 'lp5', title: 'Computer Vision Basics', status: 'not-started', progress: 0 },
                ]);

                // Simulate daily activity for the last 30 days
                const activityData: DailyActivityDay[] = Array.from({ length: 30 }, (_, i) => {
                    const isActive = Math.random() > 0.3; // ~70% active days
                    const quizCount = isActive ? Math.floor(Math.random() * 3) + 1 : 0; // 1-3 quizzes if active
                    return { day: i + 1, isActive, quizCount };
                });
                setDailyActivity(activityData);

                // Simulate global leaderboard data
                const dummyNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy'];
                const generatedLeaderboard: LeaderboardUser[] = dummyNames.map((name, index) => {
                    const score = (dummyNames.length - index) * 150 + Math.floor(Math.random() * 50); // Higher scores for higher ranks
                    const { currentLevel } = calculateUserLevel(score);
                    return {
                        id: `user-${index}`,
                        name: name,
                        totalScore: score,
                        levelName: currentLevel.name,
                        badgeComponent: currentLevel.badge,
                    };
                }).sort((a, b) => b.totalScore - a.totalScore); // Sort by total score descending

                setGlobalLeaderboard(generatedLeaderboard);

            } catch (error) {
                console.error("Error fetching data:", error);
                // Set to empty or handle gracefully
                setQuizResults([]);
                setVideosGenerated([]);
                setSeminarsAttended([]);
                setRequestsSent([]);
                setLearningPath([]);
                setDailyActivity([]);
                setGlobalLeaderboard([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateOverallScore = () => {
        return quizResults.reduce((sum, result) => sum + result.score, 0);
    };

    const calculateOverallProgress = () => {
        if (quizResults.length === 0) return 0;
        const totalScoreAchieved = quizResults.reduce((sum, result) => sum + result.score, 0);
        const totalPossibleScore = quizResults.reduce((sum, result) => sum + result.totalQuestions, 0);
        return totalPossibleScore > 0 ? parseFloat(((totalScoreAchieved / totalPossibleScore) * 100).toFixed(1)) : 0;
    };

    const calculatePassRate = () => {
        if (quizResults.length === 0) return 0;
        const passedQuizzes = quizResults.filter(r => (r.score / r.totalQuestions) * 100 >= 70).length; // Assuming 70% to pass
        return parseFloat(((passedQuizzes / quizResults.length) * 100).toFixed(0));
    };

    const getStatus = (score: number, totalQuestions: number) => {
        return (score / totalQuestions) * 100 >= 70 ? 'Passed' : 'Failed';
    };

    const { currentLevel, nextLevel, pointsToNextLevel, progressToNextLevel } = calculateUserLevel(calculateOverallScore());

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[var(--color-background-primary)] text-[var(--color-text-secondary)]">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-text-accent)]"></div>
                <p className="ml-4 text-xl">Loading your progress data...</p>
            </div>
        );
    }

    // Prepare data for the Score Trend chart
    // Aggregate scores by date (if multiple quizzes on same day) or take latest score
    const scoreTrendData = quizResults.map(result => ({
        date: result.date,
        score: (result.score / result.totalQuestions) * 100 // Convert to percentage
    })).reverse(); // Show chronological order

    // Get top 5 quiz results for personal bests
    const personalBests = [...quizResults].sort((a, b) => (b.score / b.totalQuestions) - (a.score / a.totalQuestions)).slice(0, 5);

    return (
        <div className="min-h-screen bg-[var(--color-background-primary)] text-[var(--color-text-primary)] p-2 sm:p-8 md:p-2 lg:p-2 w-full mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-[var(--color-text-primary)] gemini-star-gradient">Your Comprehensive Learning Dashboard</h1>

            {/* Level & Scoreboard Section */}
            <div className="bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--color-border)] mb-8 flex flex-col md:flex-row items-center justify-between animate-fade-in">
                <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                    {currentLevel.badge}
                    <div>
                        <h2 className="text-2xl font-bold">{currentLevel.name} Level</h2>
                        <p className="text-lg text-[var(--color-text-secondary)]">Total Score: <span className="font-semibold text-[var(--color-text-accent)]">{calculateOverallScore()} Points</span></p>
                    </div>
                </div>
                <div className="w-full md:flex-1">
                    {nextLevel ? (
                        <>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-[var(--color-text-secondary)]">Next Level: {nextLevel.name} ({nextLevel.points} points)</span>
                                <span className="text-sm font-semibold">{pointsToNextLevel} points to go!</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div className="bg-gradient-to-r from-teal-400 to-cyan-500 h-2.5 rounded-full" style={{ width: `${progressToNextLevel}%` }}></div>
                            </div>
                        </>
                    ) : (
                        <p className="text-md font-semibold text-[var(--color-text-accent)] text-center md:text-right">You have reached the highest level!</p>
                    )}
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8 gap-4 animate-fade-in delay-200">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-md
                        ${activeTab === 'dashboard' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white button-glow' : 'bg-[var(--color-button-secondary-bg)] text-[var(--color-button-secondary-text)] hover:bg-[var(--color-button-secondary-hover)]'}`}
                >
                    Dashboard
                </button>
                <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-md
                        ${activeTab === 'leaderboard' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white button-glow' : 'bg-[var(--color-button-secondary-bg)] text-[var(--color-button-secondary-text)] hover:bg-[var(--color-button-secondary-hover)]'}`}
                >
                    Badges & Leaderboard
                </button>
            </div>

            {activeTab === 'dashboard' && (
                <>
                    {/* Key Metrics Cards with Graphs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Overall Progress Card with Circular Progress */}
                        <div className="bg-[var(--color-background-secondary)] p-6 rounded-2xl shadow-md border border-[var(--color-border)] text-center animate-slide-in-up delay-100 flex flex-col items-center justify-between aspect-square">
                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] ">Overall Quiz Progress</h3>
                            <div className="flex-grow flex items-center justify-center w-full ">
  <CircularProgress
    percentage={calculateOverallProgress()}
    radius={50} // increase radius
    strokeWidth={10} // adjust stroke if needed
  />
</div>

                            <p className="text-[var(--color-text-secondary)] mt-2">Average score across all quizzes.</p>
                        </div>

                        {/* Quizzes Completed Card with Area Chart */}
                        <div className="bg-[var(--color-background-secondary)] p-6 rounded-xl shadow-md border border-[var(--color-border)] text-center animate-slide-in-up delay-200 flex flex-col items-center justify-between aspect-square">
                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Quizzes Completed</h3>
                            <p className="text-5xl font-extrabold text-[var(--color-progress-green-text)] mb-4">
                                {quizResults.length}
                            </p>
                            <div className="w-full h-32 flex-grow"> {/* Make chart responsive within card */}
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={scoreTrendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--color-progress-green-text)" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="var(--color-progress-green-text)" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="score" stroke="var(--color-progress-green-text)" fillOpacity={1} fill="url(#colorQuizzes)" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--color-background-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                                            labelStyle={{ color: 'var(--color-text-primary)' }}
                                            itemStyle={{ color: 'var(--color-progress-green-text)' }}
                                            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-[var(--color-text-secondary)] mt-2">Total mock tests taken.</p>
                        </div>

                        {/* Pass Rate Card with Area Chart */}
                        <div className="bg-[var(--color-background-secondary)] p-6 rounded-xl shadow-md border border-[var(--color-border)] text-center animate-slide-in-up delay-300 flex flex-col items-center justify-between aspect-square">
                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Pass Rate</h3>
                            <p className="text-5xl font-extrabold text-[var(--color-progress-purple-text)] mb-4">
                                {calculatePassRate()}%
                            </p>
                            <div className="w-full h-32 flex-grow"> {/* Make chart responsive within card */}
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={[{ name: 'Pass Rate', rate: calculatePassRate() }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorPassRate" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--color-progress-purple-text)" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="var(--color-progress-purple-text)" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="rate" stroke="var(--color-progress-purple-text)" fillOpacity={1} fill="url(#colorPassRate)" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--color-background-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                                            labelStyle={{ color: 'var(--color-text-primary)' }}
                                            itemStyle={{ color: 'var(--color-progress-purple-text)' }}
                                            formatter={(value: number) => [`${value.toFixed(0)}%`, 'Pass Rate']}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-[var(--color-text-secondary)] mt-2">Percentage of passed quizzes (&ge;70%).</p>
                        </div>
                    </div>

                    {/* Daily Activity Calendar */}
                    <div className="bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--color-border)] mb-10 animate-fade-in delay-400">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[var(--color-text-primary)] text-center">Daily Activity Streak</h2>
                        <p className="text-center text-lg text-[var(--color-text-secondary)] mb-6">{currentMonth} {currentYear}</p>
                        <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-20 xl:grid-cols-30 gap-2 justify-center items-center p-2 overflow-x-auto custom-scrollbar">
                            {dailyActivity.map((dayData, index) => (
                                <div
                                    key={index}
                                    className={`w-10 h-10 rounded-md transition-all duration-300 flex items-center justify-center text-sm font-semibold flex-shrink-0
                                        ${dayData.isActive ? 'bg-gradient-to-br from-green-400 to-teal-500 text-white shadow-lg scale-105' : 'bg-gray-700 text-gray-400 opacity-60'}`}
                                    title={dayData.isActive ? `Day ${dayData.day}: Active (${dayData.quizCount} quizzes)` : `Day ${dayData.day}: No activity`}
                                >
                                    {dayData.day}
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-sm text-[var(--color-text-secondary)] mt-4">Past 30 days. Green indicates activity.</p>
                    </div>

                    {/* Quiz History Table with Area Chart */}
                    <div className="bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--color-border)] mb-10 animate-fade-in delay-400">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--color-text-primary)] text-center">Quiz History & Score Trend</h2>
                        {quizResults.length === 0 ? (
                            <p className="text-center text-lg text-[var(--color-text-secondary)] py-10">
                                No quiz results available yet. Start a quiz to see your progress!
                            </p>
                        ) : (
                            <>
                                <div className="h-64 mb-6"> {/* Chart container */}
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={scoreTrendData}
                                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                                        >
                                            <defs>
                                                <linearGradient id="colorScoreTrend" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--color-text-accent)" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="var(--color-text-accent)" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                            <XAxis dataKey="date" stroke="var(--color-text-secondary)" />
                                            <YAxis stroke="var(--color-text-secondary)" domain={[0, 100]} label={{ value: 'Score (%)', angle: -90, position: 'insideLeft', fill: 'var(--color-text-secondary)' }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'var(--color-background-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                                                labelStyle={{ color: 'var(--color-text-primary)' }}
                                                itemStyle={{ color: 'var(--color-text-accent)' }}
                                                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
                                            />
                                            <Legend wrapperStyle={{ color: 'var(--color-text-primary)' }} />
                                            <Area type="monotone" dataKey="score" stroke="var(--color-text-accent)" fillOpacity={1} fill="url(#colorScoreTrend)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="overflow-x-auto rounded-xl shadow-md border border-[var(--color-border)]">
                                    <table className="min-w-full divide-y divide-[var(--color-border)]">
                                        <thead className="bg-[var(--color-progress-table-header-bg)]">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                    Test Title
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                    Score
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-[var(--color-background-primary)] divide-y divide-[var(--color-border)]">
                                            {quizResults.map((result) => (
                                                <tr key={result.id} className="hover:bg-[var(--color-progress-table-row-hover)] transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">
                                                        {result.date}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                        {result.title}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                        <span className="font-semibold text-[var(--color-text-accent)]">{result.score}</span> / {result.totalQuestions}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                            ${getStatus(result.score, result.totalQuestions) === 'Passed'
                                                                ? 'bg-[var(--color-progress-green-bg)] text-[var(--color-progress-green-text)]'
                                                                : 'bg-[var(--color-progress-red-bg)] text-[var(--color-progress-red-text)]'
                                                            }`}
                                                        >
                                                            {getStatus(result.score, result.totalQuestions)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Other Learning Activities Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                        {/* Learning Path */}
                        <div className="bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--color-border)] animate-fade-in delay-500">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--color-text-primary)] text-center">Your Learning Path</h2>
                            {learningPath.length === 0 ? (
                                <p className="text-center text-[var(--color-text-secondary)]">No learning path defined yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {learningPath.map(step => (
                                        <div key={step.id} className="flex items-center bg-[var(--color-background-primary)] p-3 rounded-lg shadow-sm border border-[var(--color-border)]">
                                            <div className={`w-4 h-4 rounded-full mr-3 flex-shrink-0
                                                ${step.status === 'completed' ? 'bg-green-500' :
                                                step.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                                            <div className="flex-grow">
                                                <p className="font-semibold text-[var(--color-text-primary)]">{step.title}</p>
                                                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                                                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-1.5 rounded-full" style={{ width: `${step.progress || 0}%` }}></div>
                                                </div>
                                            </div>
                                            <span className={`ml-3 text-sm font-medium flex-shrink-0
                                                ${step.status === 'completed' ? 'text-green-400' :
                                                step.status === 'in-progress' ? 'text-yellow-400' : 'text-gray-400'}`}>
                                                {step.status.replace('-', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Videos Generated */}
                        <div className="bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--color-border)] animate-fade-in delay-600">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--color-text-primary)] text-center">Videos Generated</h2>
                            {videosGenerated.length === 0 ? (
                                <p className="text-center text-[var(--color-text-secondary)]">No videos generated yet.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {videosGenerated.map(video => (
                                        <li key={video.id} className="bg-[var(--color-background-primary)] p-3 rounded-lg shadow-sm border border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap">
                                            <p className="font-semibold text-[var(--color-text-primary)] mb-1 sm:mb-0 mr-2 break-words">{video.title}</p>
                                            <span className="text-sm text-[var(--color-text-secondary)] flex-shrink-0">{video.date} ({video.duration})</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Seminars Attended */}
                        <div className="bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--color-border)] animate-fade-in delay-700">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--color-text-primary)] text-center">Seminars Attended</h2>
                            {seminarsAttended.length === 0 ? (
                                <p className="text-center text-[var(--color-text-secondary)]">No seminars attended yet.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {seminarsAttended.map(seminar => (
                                        <li key={seminar.id} className="bg-[var(--color-background-primary)] p-3 rounded-lg shadow-sm border border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap">
                                            <p className="font-semibold text-[var(--color-text-primary)] mb-1 sm:mb-0 mr-2 break-words">{seminar.name}</p>
                                            <span className={`text-sm font-medium flex-shrink-0 ${seminar.status === 'attended' ? 'text-green-500' : 'text-red-500'}`}>
                                                {seminar.date} - {seminar.status.toUpperCase()}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Requests Sent */}
                        <div className="bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--color-border)] animate-fade-in delay-800">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--color-text-primary)] text-center">Requests Sent</h2>
                            {requestsSent.length === 0 ? (
                                <p className="text-center text-[var(--color-text-secondary)]">No requests sent yet.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {requestsSent.map(request => (
                                        <li key={request.id} className="bg-[var(--color-background-primary)] p-3 rounded-lg shadow-sm border border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap">
                                            <p className="font-semibold text-[var(--color-text-primary)] mb-1 sm:mb-0 mr-2 break-words">{request.type.toUpperCase()}</p>
                                            <span className={`text-sm font-medium flex-shrink-0 ${request.status === 'resolved' ? 'text-green-500' : 'text-yellow-500'}`}>
                                                {request.date} - {request.status.toUpperCase()}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* AI Insights & Suggestions */}
                        <div className="bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--color-border)] animate-fade-in delay-900">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--color-text-primary)] text-center">AI Insights & Suggestions</h2>
                            <ul className="space-y-3 text-[var(--color-text-secondary)]">
                                <li className="flex items-start">
                                    <span className="text-xl mr-3 flex-shrink-0">✨</span>
                                    <span>Your recent scores show a strong grasp of foundational physics. Consider diving into advanced topics like quantum mechanics.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-xl mr-3 flex-shrink-0">📈</span>
                                    <span>The area chart indicates consistent improvement. Keep up the daily activity to maintain momentum!</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-xl mr-3 flex-shrink-0">💡</span>
                                    <span>You're close to the 'Knowledge Seeker' badge. Focus on completing more quizzes to earn those points!</span>
                                </li>
                            </ul>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--color-border)] animate-fade-in delay-1000">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--color-text-primary)] text-center">Recommended Learning Resources</h2>
                            <ul className="space-y-3 text-[var(--color-text-secondary)]">
                                <li className="flex items-start">
                                    <span className="text-xl mr-3 flex-shrink-0">📚</span>
                                    <span>**Book:** "Clean Code" by Robert C. Martin - Essential for software development.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-xl mr-3 flex-shrink-0">🌐</span>
                                    <span>**Course:** Coursera's "Deep Learning Specialization" by Andrew Ng - Highly recommended for ML.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-xl mr-3 flex-shrink-0">▶️</span>
                                    <span>**YouTube Channel:** "3Blue1Brown" for intuitive explanations of math concepts.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Sponsorship (Placeholder) */}
                        <div className="bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--color-border)] animate-fade-in delay-1100">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--color-text-primary)] text-center">Sponsorship Opportunities</h2>
                            <p className="text-center text-[var(--color-text-secondary)]">
                                We are actively seeking partnerships to enhance our platform and provide more resources. If you're interested in sponsoring educational content or features, please contact us! Your support helps us grow.
                            </p>
                            <div className="text-center mt-4">
                                <button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-2 px-6 rounded-full text-md shadow-lg transition-all duration-300">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'leaderboard' && (
                <div className="animate-fade-in">
                    {/* Available Badges Section */}
                    <div className="bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--color-border)] mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--color-text-primary)] text-center">Available Badges & Milestones</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 justify-items-center">
                            {LEVEL_THRESHOLDS.map(level => (
                                <div key={level.name} className="flex flex-col items-center p-4 bg-[var(--color-background-primary)] rounded-lg shadow-sm border border-[var(--color-border)] w-full max-w-[200px] text-center">
                                    {level.badge}
                                    <p className="font-semibold text-lg text-[var(--color-text-primary)] mt-2">{level.name}</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">{level.points} Points</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Global Leaderboard */}
                    <div className="bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--color-border)] mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--color-text-primary)] text-center">Global Top Learners</h2>
                        {globalLeaderboard.length === 0 ? (
                            <p className="text-center text-lg text-[var(--color-text-secondary)] py-10">
                                No global leaderboard data available yet.
                            </p>
                        ) : (
                            <div className="overflow-x-auto rounded-xl shadow-md border border-[var(--color-border)]">
                                <table className="min-w-full divide-y divide-[var(--color-border)]">
                                    <thead className="bg-[var(--color-progress-table-header-bg)]">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                Rank
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                User
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                Level
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                Total Points
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-[var(--color-background-primary)] divide-y divide-[var(--color-border)]">
                                        {globalLeaderboard.map((user, index) => (
                                            <tr key={user.id} className="hover:bg-[var(--color-progress-table-row-hover)] transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)] flex items-center">
                                                    {user.badgeComponent}
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                    {user.levelName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-accent)] font-semibold">
                                                    {user.totalScore}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Personal Bests Leaderboard */}
                    <div className="bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--color-border)] mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--color-text-primary)] text-center">Your Personal Best Quizzes</h2>
                        {personalBests.length === 0 ? (
                            <p className="text-center text-lg text-[var(--color-text-secondary)] py-10">
                                No personal bests yet. Complete some quizzes to see your top performances!
                            </p>
                        ) : (
                            <div className="overflow-x-auto rounded-xl shadow-md border border-[var(--color-border)]">
                                <table className="min-w-full divide-y divide-[var(--color-border)]">
                                    <thead className="bg-[var(--color-progress-table-header-bg)]">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                Rank
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                Test Title
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                Score (%)
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-[var(--color-background-primary)] divide-y divide-[var(--color-border)]">
                                        {personalBests.map((result, index) => (
                                            <tr key={result.id} className="hover:bg-[var(--color-progress-table-row-hover)] transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                    {result.title}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                    <span className="font-semibold text-[var(--color-text-accent)]">{(result.score / result.totalQuestions * 100).toFixed(1)}%</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                    {result.date}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgressTracker;
