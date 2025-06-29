import React, { useState, useEffect, useRef, useCallback } from 'react';

// Define the shape of a quiz question
interface Question {
    id: number;
    question: string;
    options?: string[]; // Made optional for fill-in-the-blanks
    correctAnswer: string;
    explanation?: string; // Optional explanation for the correct answer
}

// Define the shape of the generated quiz data
interface QuizData {
    title: string;
    description: string;
    questions: Question[];
    timeLimitMinutes?: number; // New: Optional time limit for the quiz
}

// Define the shape for a stored score
interface StoredScore {
    id: string; // Unique ID for the score entry
    title: string;
    score: number;
    totalQuestions: number;
    date: string; // Date of the test
}

// Basic MessageModal component embedded directly to ensure compilation
interface MessageModalProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ message, type, onClose }) => {
    let bgColor = '';
    let textColor = '';
    let icon = '';

    switch (type) {
        case 'success':
            bgColor = 'bg-green-100 border-green-500';
            textColor = 'text-green-800';
            icon = '✅';
            break;
        case 'error':
            bgColor = 'bg-red-100 border-red-500';
            textColor = 'text-red-800';
            icon = '❌';
            break;
        case 'info':
            bgColor = 'bg-blue-100 border-blue-500';
            textColor = 'text-blue-800';
            icon = 'ℹ️';
            break;
        default:
            bgColor = 'bg-gray-100 border-gray-500';
            textColor = 'text-gray-800';
            icon = '💬';
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`relative ${bgColor} border-l-4 rounded-lg p-6 shadow-xl max-w-sm w-full animate-scale-in`}>
                <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{icon}</span>
                    <p className={`font-semibold ${textColor} text-lg`}>{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    aria-label="Close message"
                >
                    ×
                </button>
            </div>
        </div>
    );
};


// Custom hook for message modal functionality
const useMessageModal = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');

    const showAlertMessage = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
    };

    const closeAlert = () => {
        setShowAlert(false);
        setAlertMessage('');
    };

    return { showAlert: showAlertMessage, MessageModalComponent: showAlert ? <MessageModal message={alertMessage} type={alertType} onClose={closeAlert} /> : null };
};

const MockTestGenerator: React.FC = () => {
    const { showAlert, MessageModalComponent } = useMessageModal();

    // State to control which main content panel is active
    type ActivePanel = 'howItWorks' | 'topicInput' | 'fileInput' | 'textInput' | 'youtubeInput' | 'quizSettings' | 'scoreHistory';
    const [activePanel, setActivePanel] = useState<ActivePanel>('howItWorks');

    // State for content input values
    const [topic, setTopic] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [pastedText, setPastedText] = useState<string>('');
    const [youtubeUrl, setYoutubeUrl] = useState<string>('');
    const [showYoutubePreview, setShowYoutubePreview] = useState<boolean>(false); // New: for YouTube preview

    // State for test generation parameters
    const [difficulty, setDifficulty] = useState<string>('medium');
    const [numQuestions, setNumQuestions] = useState<number>(10);
    const [questionType, setQuestionType] = useState<'mcq' | 'trueFalse' | 'fillInTheBlanks'>('mcq');
    const [includeExplanations, setIncludeExplanations] = useState<boolean>(true);
    const [timeLimit, setTimeLimit] = useState<number>(30);

    // State for mock test display
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
    const [showResults, setShowResults] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [scoreHistory, setScoreHistory] = useState<StoredScore[]>([]); // New: for storing past scores

    // Loading state
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Timer state
    const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Reference for file input to clear it
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load score history from local storage on component mount
    useEffect(() => {
        const storedScores = localStorage.getItem('quizScores');
        if (storedScores) {
            setScoreHistory(JSON.parse(storedScores));
        }
    }, []);

    // Helper functions for fullscreen
    const handleFullScreenRequest = () => {
        const element = document.documentElement as HTMLElement & {
            webkitRequestFullscreen?: () => Promise<void>;
            mozRequestFullScreen?: () => Promise<void>;
            msRequestFullscreen?: () => Promise<void>;
        };

        if (element.requestFullscreen) {
            return element.requestFullscreen(); // Return the Promise
        } else if (element.webkitRequestFullscreen) {
            return element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            return element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            return element.msRequestFullscreen();
        }
        return Promise.reject(new Error("Fullscreen API not supported or available.")); // Handle unsupported browsers
    };

    const handleFullScreenExit = () => {
        const doc = document as Document & {
            webkitExitFullscreen?: () => Promise<void>;
            mozCancelFullScreen?: () => Promise<void>;
            msExitFullscreen?: () => Promise<void>;
        };

        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
            doc.msExitFullscreen();
        }
    };

    // Function to calculate score
    const calculateScore = useCallback(() => {
        if (!quizData) return 0;
        let newScore = 0;
        quizData.questions.forEach(q => {
            // For fill-in-the-blanks, case-insensitive comparison
            if (q.options && userAnswers[q.id] === q.correctAnswer) { // MCQ/TrueFalse
                newScore++;
            } else if (!q.options && userAnswers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) { // Fill-in-the-blanks
                newScore++;
            }
        });
        return newScore;
    }, [quizData, userAnswers]);

    // Function to handle quiz submission
    const handleSubmitQuiz = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        const finalScore = calculateScore();
        setScore(finalScore);
        setShowResults(true);

        // Save score to local storage
        if (quizData) {
            const newScoreEntry: StoredScore = {
                id: Date.now().toString(), // Simple unique ID
                title: quizData.title,
                score: finalScore,
                totalQuestions: quizData.questions.length,
                date: new Date().toLocaleDateString(),
            };
            setScoreHistory(prevScores => {
                const updatedScores = [...prevScores, newScoreEntry];
                localStorage.setItem('quizScores', JSON.stringify(updatedScores));
                return updatedScores;
            });
        }

        showAlert(`Quiz completed! You scored ${finalScore} out of ${quizData?.questions.length}.`, 'success');
        handleFullScreenExit();
    }, [calculateScore, quizData, showAlert, handleFullScreenExit]);

    // Function to restart quiz (resets all states)
    const handleRestartQuiz = useCallback(() => {
        setQuizData(null);
        setShowResults(false);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setScore(0);
        setTopic('');
        setFile(null);
        setPastedText('');
        setYoutubeUrl('');
        setShowYoutubePreview(false); // Reset YouTube preview state
        setSecondsLeft(null);
        setIsLoading(false); // Ensure loading is off
        setActivePanel('howItWorks'); // Go back to how it works page
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        handleFullScreenExit();
    }, [handleFullScreenExit]);


    // Effect to handle fullscreen changes and timer cleanup
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && quizData && !showResults) {
                showAlert('Fullscreen exited. Test terminated.', 'info');
                handleRestartQuiz();
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [quizData, showResults, showAlert, handleRestartQuiz]);

    // Timer countdown logic
    useEffect(() => {
        if (secondsLeft !== null && secondsLeft > 0 && quizData && !showResults) {
            timerRef.current = setInterval(() => {
                setSecondsLeft(prevSeconds => {
                    if (prevSeconds !== null && prevSeconds <= 1) {
                        clearInterval(timerRef.current!);
                        handleSubmitQuiz();
                        return 0;
                    }
                    return prevSeconds !== null ? prevSeconds - 1 : 0;
                });
            }, 1000);
        } else if (secondsLeft === 0 && quizData && !showResults) {
            handleSubmitQuiz();
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [secondsLeft, quizData, showResults, handleSubmitQuiz]);

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const colorClass = totalSeconds <= 60 ? 'text-red-500 animate-pulse' : 'text-[var(--color-text-accent)]';
        return <span className={colorClass}>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>;
    };


    const getYouTubeVideoId = (url: string) => {
        // Updated regex to be more robust
        const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/;
        const match = url.match(regExp);
        return (match && match[1].length === 11) ? match[1] : null;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === 'application/pdf' ||
                selectedFile.type === 'text/plain' ||
                selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                selectedFile.type === 'application/msword') {
                setFile(selectedFile);
                showAlert(`File "${selectedFile.name}" selected.`, 'info');
            } else {
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                showAlert('Please upload a PDF, DOCX, DOC, or TXT file.', 'error');
            }
        }
    };

    // This function now makes the actual API call to your backend
    const generateQuestions = async (payload: { type: string, content: string | File | null, difficulty: string, numQuestions: number, includeExplanations: boolean, questionType: string, timeLimit: number }) => {
        const formData = new FormData();
        formData.append('type', payload.type);
        formData.append('difficulty', payload.difficulty);
        formData.append('numQuestions', payload.numQuestions.toString());
        formData.append('includeExplanations', payload.includeExplanations.toString());
        formData.append('questionType', payload.questionType);
        formData.append('timeLimit', payload.timeLimit.toString());

        if (payload.type === 'file' && payload.content instanceof File) {
            formData.append('file', payload.content);
        } else if (payload.content) {
            // For non-file content types, append the content as a string
            formData.append('content', payload.content.toString());
        }

        try {
            // Determine headers based on content type
            const headers: HeadersInit = payload.type === 'file' ? {} : { 'Content-Type': 'application/json' };
            const body = payload.type === 'file' ? formData : JSON.stringify(Object.fromEntries(formData.entries()));

            const response = await fetch('http://localhost:5000/generate_test', { // Your backend API endpoint
                method: 'POST',
                body: body,
                headers: headers,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate test due to a server error.');
            }

            const data: QuizData = await response.json();
            return data;
        } catch (error: any) {
            console.error('Error generating mock test:', error);
            throw new Error(error.message || 'An unexpected error occurred during test generation.');
        }
    };


    const handleGenerateTest = async (e: React.FormEvent) => {
        e.preventDefault();

        let contentInput: string | File | null = null;
        let contentTypeUsed: 'topic' | 'file' | 'text' | 'youtube' | null = null;

        // Determine content type based on current activePanel
        if (activePanel === 'topicInput') {
            if (!topic.trim()) {
                showAlert('Please enter a topic for the mock test!', 'error');
                return;
            }
            contentInput = topic.trim();
            contentTypeUsed = 'topic';
        } else if (activePanel === 'fileInput') {
            if (!file) {
                showAlert('Please select a file to upload!', 'error');
                return;
            }
            contentInput = file;
            contentTypeUsed = 'file';
        } else if (activePanel === 'textInput') {
            if (!pastedText.trim()) {
                showAlert('Please paste some text for the mock test!', 'error');
                return;
            }
            contentInput = pastedText.trim();
            contentTypeUsed = 'text';
        } else if (activePanel === 'youtubeInput') {
            if (!youtubeUrl.trim()) {
                showAlert('Please enter a YouTube video URL!', 'error');
                return;
            }
            const videoId = getYouTubeVideoId(youtubeUrl);
            if (!videoId) {
                showAlert('Invalid YouTube URL. Please enter a valid link.', 'error');
                return;
            }
            contentInput = youtubeUrl.trim();
            contentTypeUsed = 'youtube';
        }
        else {
            showAlert('Please select a content input method from the sidebar before generating.', 'error');
            return;
        }

        setIsLoading(true);
        showAlert(`Generating a ${numQuestions}-question ${difficulty} mock test from your ${contentTypeUsed} input...`, 'info');

        try {
            // Attempt fullscreen request first, directly within the user gesture.
            // If it fails, the catch block will handle it.
            await handleFullScreenRequest(); // Moved this line up

            const generatedData = await generateQuestions({
                type: contentTypeUsed,
                content: contentInput,
                difficulty,
                numQuestions,
                includeExplanations,
                questionType,
                timeLimit
            });

            setQuizData(generatedData);
            setSecondsLeft(timeLimit * 60);
            showAlert('Mock test generated successfully! You are now in fullscreen mode.', 'success'); //
        } catch (error: any) {
            console.error('Error generating mock test or entering fullscreen:', error);
            // Provide a more specific message if fullscreen failed
            if (error.name === "NotAllowedError" || error.name === "AbortError") { // Common errors for fullscreen permission issues
                showAlert('Failed to enter fullscreen mode. Please ensure your browser allows fullscreen, or try again with a direct user interaction.', 'error'); //
            } else {
                showAlert(error.message || 'Failed to generate mock test. Please try again.', 'error');
            }
            handleFullScreenExit(); // Ensure fullscreen is exited if it was partially engaged or failed
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswerSelect = (questionId: number, selectedOption: string) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }));
    };

    const currentQuestion = quizData?.questions[currentQuestionIndex];

    const sidebarOptions = [
        { id: 'howItWorks', label: 'How It Works', icon: '💡' },
        { id: 'topicInput', label: 'Generate from Topic', icon: '📝' },
        { id: 'fileInput', label: 'Generate from File', icon: '📂' },
        { id: 'textInput', label: 'Generate from Text', icon: '📄' },
        { id: 'youtubeInput', label: 'Generate from YouTube', icon: '▶️' },
        { id: 'quizSettings', label: 'Quiz Settings', icon: '⚙️' },
        { id: 'scoreHistory', label: 'Score History', icon: '🏆' }, // New sidebar option
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[var(--color-background-primary)]">
            {MessageModalComponent}



            {/* Main Content Area: Sidebar + Dynamic Main Section */}
            <div className="flex flex-1 flex-col lg:flex-row w-full">

                {/* Sidebar - Navigation */}
                {!quizData && ( // Hide sidebar when quiz is active
                    <aside className="w-full lg:w-1/4 xl:w-1/5 bg-[var(--color-background-secondary)] p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-[var(--color-border)] shadow-lg lg:shadow-xl lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto custom-scrollbar animate-slide-in-up delay-100 z-20">
                        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-center lg:text-left">
                            Options
                        </h2>
                        <nav className="space-y-3">
                            {sidebarOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setActivePanel(option.id as ActivePanel)}
                                    className={`w-full text-left py-3 px-4 rounded-lg font-semibold text-base transition-all duration-200 flex items-center
                                        ${activePanel === option.id ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-white shadow-md transform scale-105' : 'bg-[var(--color-button-secondary-bg)] text-[var(--color-button-secondary-text)] hover:bg-[var(--color-button-secondary-hover)]'}`}
                                >
                                    <span className="text-xl mr-3">{option.icon}</span> {option.label}
                                </button>
                            ))}
                        </nav>
                        {/* Generate Test Button always available from sidebar */}
                        <div className="text-center pt-8">
                            <button type="submit" onClick={handleGenerateTest} disabled={isLoading}
                                className={`w-full py-3 px-8 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg button-glow
                                    ${isLoading ? 'bg-[var(--color-button-secondary-hover)] cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'}`}>
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </div>
                                ) : 'Generate Test'}
                            </button>
                        </div>
                    </aside>
                )}


                {/* Main Content Display Area */}
                {/* Adjusted min-h to correctly offset the header height on larger screens */}
                <main className={`flex-1 p-6 sm:p-8 lg:p-10 flex flex-col items-center overflow-y-auto ${quizData ? 'min-h-[calc(100vh-80px)]' : 'min-h-[calc(100vh-100px)] lg:min-h-[calc(100vh-120px)]'}`}>

                    {/* How It Works / Initial Info */}
                    {activePanel === 'howItWorks' && !quizData && !isLoading && (
                        <div className="w-full max-w-4xl animate-fade-in">
                            <h2 className="text-3xl font-bold mb-6 text-[var(--color-text-primary)] text-center">
                                Welcome! How It Works
                            </h2>
                            <p className="text-lg leading-relaxed text-[var(--color-text-secondary)] text-center mb-10">
                                Use the sidebar on the left to select your content source and configure your mock test, then let our AI do the rest!
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-center flex-col sm:flex-row bg-[var(--color-background-secondary)] p-4 rounded-lg shadow-md border border-[var(--color-border)] animate-slide-in-up delay-200">
                                    <div className="text-[var(--color-feature-icon-1)] text-4xl flex-shrink-0 mb-2 sm:mb-0 sm:mr-4">📝</div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="font-semibold text-xl text-[var(--color-text-primary)] mb-1">1. Input Content</h3>
                                        <p className="text-[var(--color-text-secondary)] text-md">
                                            Select a content type (Topic, File, Text, YouTube) from the sidebar and provide your source material.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center flex-col sm:flex-row bg-[var(--color-background-secondary)] p-4 rounded-lg shadow-md border border-[var(--color-border)] animate-slide-in-up delay-300">
                                    <div className="text-[var(--color-feature-icon-3)] text-4xl flex-shrink-0 mb-2 sm:mb-0 sm:mr-4">🧠</div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="font-semibold text-xl text-[var(--color-text-primary)] mb-1">2. Configure Test</h3>
                                        <p className="text-[var(--color-text-secondary)] text-md">
                                            Adjust general quiz settings like number of questions, time limit, and difficulty.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center flex-col sm:flex-row bg-[var(--color-background-secondary)] p-4 rounded-lg shadow-md border border-[var(--color-border)] animate-slide-in-up delay-400">
                                    <div className="text-[var(--color-feature-icon-2)] text-4xl flex-shrink-0 mb-2 sm:mb-0 sm:mr-4">✅</div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="font-semibold text-xl text-[var(--color-text-primary)] mb-1">3. Generate & Learn</h3>
                                        <p className="text-[var(--color-text-secondary)] text-md">
                                            Generate your test, take it in fullscreen, and review results with explanations.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Input Forms (conditionally rendered) */}
                    {activePanel === 'topicInput' && !quizData && !isLoading && (
                        <div className="w-full max-w-2xl animate-fade-in bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-xl shadow-lg border border-[var(--color-border)]">
                            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-center">Generate from Topic</h2>
                            <form onSubmit={handleGenerateTest} className="space-y-5">
                                <div>
                                    <label htmlFor="topic" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Topic/Subject</label>
                                    <input type="text" id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} required
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
                                        focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)] focus:border-transparent
                                        transition-all duration-300 shadow-sm
                                        placeholder:text-[var(--color-text-secondary)] placeholder:opacity-70
                                        hover:border-[var(--color-hover-accent)] hover:shadow-md"
                                        placeholder="e.g., Quantum Physics, Renaissance Art, Python Programming" />
                                </div>
                            </form>
                        </div>
                    )}

                    {activePanel === 'fileInput' && !quizData && !isLoading && (
                        <div className="w-full max-w-2xl animate-fade-in bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-xl shadow-lg border border-[var(--color-border)]">
                            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-center">Generate from File</h2>
                            <form onSubmit={handleGenerateTest} className="space-y-5">
                                <div>
                                    <label htmlFor="file-upload" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Upload your document (PDF, DOCX, TXT)</label>
                                    <input type="file" id="file-upload" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" required
                                        className="w-full text-[var(--color-text-primary)] text-sm
                                        file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white
                                        hover:file:from-blue-600 hover:file:to-purple-700
                                        focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)] focus:border-transparent
                                        transition-all duration-300 cursor-pointer" />
                                </div>
                            </form>
                        </div>
                    )}

                    {activePanel === 'textInput' && !quizData && !isLoading && (
                        <div className="w-full max-w-2xl animate-fade-in bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-xl shadow-lg border border-[var(--color-border)]">
                            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-center">Generate from Pasted Text</h2>
                            <form onSubmit={handleGenerateTest} className="space-y-5">
                                <div>
                                    <label htmlFor="pasted-text" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Paste your text here</label>
                                    <textarea id="pasted-text" value={pastedText} onChange={(e) => setPastedText(e.target.value)} rows={10} required
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
                                        focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)] focus:border-transparent
                                        transition-all duration-300 shadow-sm resize-y
                                        placeholder:text-[var(--color-text-secondary)] placeholder:opacity-70
                                        hover:border-[var(--color-hover-accent)] hover:shadow-md"
                                        placeholder="Paste an article, lecture notes, or any text for the AI to analyze and generate questions from..."></textarea>
                                </div>
                            </form>
                        </div>
                    )}

                    {activePanel === 'youtubeInput' && !quizData && !isLoading && (
                        <div className="w-full max-w-2xl animate-fade-in bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-xl shadow-lg border border-[var(--color-border)]">
                            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-center">Generate from YouTube Video</h2>
                            <form onSubmit={handleGenerateTest} className="space-y-5">
                                <div>
                                    <label htmlFor="youtube-url" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">YouTube Video URL</label>
                                    <input type="url" id="youtube-url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} required
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
                                        focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)] focus:border-transparent
                                        transition-all duration-300 shadow-sm
                                        placeholder:text-[var(--color-text-secondary)] placeholder:opacity-70
                                        hover:border-[var(--color-hover-accent)] hover:shadow-md"
                                        placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ (AI will use the transcript)" />
                                </div>
                                {youtubeUrl && (
                                    <div className="flex items-center mt-4">
                                        <input
                                            type="checkbox"
                                            id="show-youtube-preview"
                                            checked={showYoutubePreview}
                                            onChange={(e) => setShowYoutubePreview(e.target.checked)}
                                            className="h-5 w-5 text-[var(--color-text-accent)] rounded border-[var(--color-input-border)] focus:ring-[var(--color-text-accent)]"
                                        />
                                        <label htmlFor="show-youtube-preview" className="ml-2 block text-sm font-medium text-[var(--color-text-primary)]">
                                            Show Video Preview
                                        </label>
                                    </div>
                                )}
                                {showYoutubePreview && getYouTubeVideoId(youtubeUrl) && (
                                    <div className="mt-6 aspect-video w-full rounded-lg overflow-hidden shadow-xl border border-[var(--color-border)]">
                                        <iframe
                                            className="w-full h-full"
                                            src={`https://www.youtube.com/embed/${getYouTubeVideoId(youtubeUrl)}`}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}

                    {activePanel === 'quizSettings' && !quizData && !isLoading && (
                        <div className="w-full max-w-2xl animate-fade-in bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-xl shadow-lg border border-[var(--color-border)]">
                            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-center">Quiz Settings</h2>
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="numQuestions" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Number of Questions</label>
                                    <input type="number" id="numQuestions" value={numQuestions} onChange={(e) => setNumQuestions(parseInt(e.target.value))} min="5" max="20" step="1"
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)] transition-colors duration-200 shadow-sm" />
                                </div>

                                <div>
                                    <label htmlFor="timeLimit" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Time Limit (minutes)</label>
                                    <input type="number" id="timeLimit" value={timeLimit} onChange={(e) => setTimeLimit(parseInt(e.target.value))} min="1" max="60" step="1"
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)] transition-colors duration-200 shadow-sm" />
                                </div>

                                <div>
                                    <label htmlFor="difficulty" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Difficulty</label>
                                    <select
                                        id="difficulty"
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)] transition-colors duration-200 shadow-sm appearance-none cursor-pointer"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="questionType" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Question Type</label>
                                    <select
                                        id="questionType"
                                        value={questionType}
                                        onChange={(e) => setQuestionType(e.target.value as 'mcq' | 'trueFalse' | 'fillInTheBlanks')}
                                        className="w-full px-4 py-2 rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)] transition-colors duration-200 shadow-sm appearance-none cursor-pointer"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
                                    >
                                        <option value="mcq">Multiple Choice</option>
                                        <option value="trueFalse">True/False</option>
                                        <option value="fillInTheBlanks">Fill-in-the-Blanks</option>
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <input type="checkbox" id="include-explanations" checked={includeExplanations} onChange={(e) => setIncludeExplanations(e.target.checked)}
                                        className="h-5 w-5 text-[var(--color-text-accent)] rounded border-[var(--color-input-border)] focus:ring-[var(--color-text-accent)]" />
                                    <label htmlFor="include-explanations" className="ml-2 block text-sm font-medium text-[var(--color-text-primary)]">Include explanations</label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activePanel === 'scoreHistory' && !quizData && !isLoading && (
                        <div className="w-full max-w-4xl animate-fade-in bg-[var(--color-background-secondary)] p-6 sm:p-8 rounded-xl shadow-lg border border-[var(--color-border)]">
                            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-center">Your Score History</h2>
                            {scoreHistory.length === 0 ? (
                                <p className="text-center text-[var(--color-text-secondary)]">No scores recorded yet. Generate a test and complete it to see your scores here!</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-[var(--color-border)]">
                                        <thead className="bg-[var(--color-progress-table-header-bg)]">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider rounded-tl-lg">
                                                    Date
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                    Test Title
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider rounded-tr-lg">
                                                    Score
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-[var(--color-background-primary)] divide-y divide-[var(--color-border)]">
                                            {scoreHistory.map((entry) => (
                                                <tr key={entry.id} className="hover:bg-[var(--color-progress-table-row-hover)] transition-colors duration-150">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">
                                                        {entry.date}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                        {entry.title}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                                        <span className="font-semibold text-[var(--color-text-accent)]">{entry.score}</span> / {entry.totalQuestions}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}


                    {/* Test Generation Loading State */}
                    {isLoading && !quizData && (
                        <div className="flex flex-col items-center p-8 rounded-xl bg-[var(--color-background-secondary)] shadow-lg border border-[var(--color-border)] animate-fade-in text-center">
                            <svg className="animate-spin h-16 w-16 text-[var(--color-text-accent)] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Generating your personalized test...</p>
                            <p className="text-md text-[var(--color-text-secondary)]">This might take a few moments as our AI crafts your questions.</p>
                        </div>
                    )}

                    {/* Mock Test Display Section (Full Screen) - will occupy main content area */}
                    {quizData && !showResults && (
                        <div className="flex flex-col items-center w-full min-h-[calc(100vh-80px)] bg-[var(--color-background-primary)] p-4 sm:p-8 lg:p-12">
                            <div className="bg-[var(--color-background-secondary)] rounded-2xl shadow-xl border border-[var(--color-border)] w-full max-w-screen-xl p-6 sm:p-8 lg:p-10 animate-slide-in-up flex-grow flex flex-col justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-center text-[var(--color-text-primary)] mb-4">{quizData.title}</h2>
                                    <p className="text-md text-[var(--color-text-secondary)] text-center mb-6">{quizData.description}</p>
                                </div>

                                {secondsLeft !== null && (
                                    <div className="text-center text-3xl font-bold mb-6">
                                        Time Left: {formatTime(secondsLeft)}
                                    </div>
                                )}

                                {currentQuestion && (
                                    <div className="p-6 bg-[var(--color-background-primary)] rounded-lg shadow-inner border border-[var(--color-border)] mb-6 flex-grow flex flex-col justify-center">
                                        <div className="flex justify-between items-center mb-6">
                                            <p className="text-xl font-semibold text-[var(--color-text-accent)]">
                                                Question {currentQuestionIndex + 1} / {quizData.questions.length}
                                            </p>
                                            <span className="text-3xl text-[var(--color-feature-icon-4)]">❓</span>
                                        </div>
                                        <p className="text-2xl font-medium text-[var(--color-text-primary)] mb-6">{currentQuestion.question}</p>
                                        {/* Conditional rendering for options based on question type */}
                                        {currentQuestion.options && currentQuestion.options.length > 0 ? (
                                            <div className="space-y-4">
                                                {currentQuestion.options.map((option, optIndex) => (
                                                    <label
                                                        key={optIndex}
                                                        className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200
                                                            ${userAnswers[currentQuestion.id] === option ? 'bg-[var(--color-feature-bg-hover)] border-[var(--color-text-accent)] text-[var(--color-text-accent)] shadow-md' : 'border-[var(--color-input-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-hover-light)] hover:shadow-sm'}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${currentQuestion.id}`}
                                                            value={option}
                                                            checked={userAnswers[currentQuestion.id] === option}
                                                            onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                                                            className="mr-3 h-6 w-6 text-[var(--color-text-accent)] focus:ring-[var(--color-text-accent)] border-[var(--color-input-border)] checked:bg-[var(--color-text-accent)]"
                                                        />
                                                        <span className="text-lg">{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        ) : (
                                            // Render for Fill-in-the-Blanks or questions without options
                                            <div className="p-4 rounded-lg border border-[var(--color-input-border)] bg-[var(--color-background-primary)] shadow-sm">
                                                <label htmlFor={`fill-in-blank-${currentQuestion.id}`} className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Your Answer:</label>
                                                <input
                                                    type="text"
                                                    id={`fill-in-blank-${currentQuestion.id}`}
                                                    value={userAnswers[currentQuestion.id] || ''}
                                                    onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                                                    className="w-full px-4 py-2 rounded-lg border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-[var(--color-text-primary)]
                                                        focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)] focus:border-transparent
                                                        transition-all duration-300 shadow-sm
                                                        placeholder:text-[var(--color-text-secondary)] placeholder:opacity-70"
                                                    placeholder="Type your answer here"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-between items-center mt-6">
                                    <button
                                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                        disabled={currentQuestionIndex === 0}
                                        className={`py-3 px-6 rounded-full text-lg font-semibold transition-all duration-300 button-glow
                                            ${currentQuestionIndex === 0 ? 'bg-[var(--color-button-secondary-hover)] text-[var(--color-button-secondary-text)] cursor-not-allowed' : 'bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white shadow-lg'}`}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={handleSubmitQuiz}
                                        className="py-3 px-6 rounded-full text-lg font-semibold transition-all duration-300 button-glow bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg"
                                    >
                                        Stop Test
                                    </button>
                                    {currentQuestionIndex < quizData.questions.length - 1 ? (
                                        <button
                                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                            // Disable if MCQ/TrueFalse not answered, or if Fill-in-the-Blank is empty
                                            disabled={!currentQuestion || (currentQuestion.options && !userAnswers[currentQuestion.id]) || (!currentQuestion.options && !userAnswers[currentQuestion.id]?.trim())}
                                            className={`py-3 px-6 rounded-full text-lg font-semibold transition-all duration-300 button-glow
                                                ${(!currentQuestion || (currentQuestion.options && !userAnswers[currentQuestion.id]) || (!currentQuestion.options && !userAnswers[currentQuestion.id]?.trim())) ? 'bg-[var(--color-button-secondary-hover)] cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg'}`}
                                        >
                                            Next Question
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSubmitQuiz}
                                            // Disable if MCQ/TrueFalse not answered, or if Fill-in-the-Blank is empty
                                            disabled={!currentQuestion || (currentQuestion.options && !userAnswers[currentQuestion.id]) || (!currentQuestion.options && !userAnswers[currentQuestion.id]?.trim())}
                                            className={`py-3 px-6 rounded-full text-lg font-semibold transition-all duration-300 button-glow
                                                ${(!currentQuestion || (currentQuestion.options && !userAnswers[currentQuestion.id]) || (!currentQuestion.options && !userAnswers[currentQuestion.id]?.trim())) ? 'bg-[var(--color-button-secondary-hover)] cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg'}`}
                                        >
                                            Submit Test
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Test Results Display (Full Screen) - will occupy main content area */}
                    {showResults && quizData && (
                        <div className="flex flex-col items-center w-full min-h-[calc(100vh-80px)] bg-[var(--color-background-primary)] p-4 sm:p-8 lg:p-12">
                            <div className="bg-[var(--color-background-secondary)] rounded-2xl shadow-xl border border-[var(--color-border)] w-full max-w-screen-xl p-6 sm:p-8 lg:p-10 animate-scale-in flex-grow flex flex-col justify-center">
                                <h2 className="text-3xl font-bold text-center text-[var(--color-text-primary)] mb-4">Test Results</h2>
                                <p className="text-xl text-[var(--color-text-secondary)] text-center mb-6">
                                    You scored: <span className="font-bold text-[var(--color-text-accent)]">{score} / {quizData.questions.length}</span>
                                </p>

                                <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar p-2">
                                    {quizData.questions.map((q, index) => (
                                        <div key={q.id} className="p-4 rounded-lg border border-[var(--color-input-border)] bg-[var(--color-background-primary)] shadow-sm">
                                            <p className="font-semibold text-lg text-[var(--color-text-primary)] mb-2">
                                                {index + 1}. {q.question}
                                            </p>
                                            <p className="text-md mb-1">
                                                Your Answer: <span className={`font-medium ${
                                                    (q.options && userAnswers[q.id] === q.correctAnswer) ||
                                                    (!q.options && userAnswers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim())
                                                        ? 'text-[var(--color-feature-icon-2)]'
                                                        : 'text-[var(--color-progress-red-text)]'
                                                }`}>
                                                    {userAnswers[q.id] || 'Not answered'}
                                                </span>
                                            </p>
                                            <p className="text-md mb-2">
                                                Correct Answer: <span className="font-medium text-[var(--color-feature-icon-2)]">{q.correctAnswer}</span>
                                            </p>
                                            {includeExplanations && q.explanation && (
                                                <p className="text-sm text-[var(--color-text-secondary)] border-t border-[var(--color-border)] pt-2 mt-2">
                                                    <span className="font-semibold text-[var(--color-text-primary)]">Explanation: </span>{q.explanation}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center mt-8">
                                    <button
                                        onClick={handleRestartQuiz}
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full text-lg button-glow
                                            transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-text-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-background-secondary)]"
                                    >
                                        Start New Test
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MockTestGenerator;