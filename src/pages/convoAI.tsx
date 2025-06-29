import React, { useState, useRef, useEffect } from 'react';
import MessageModal from '../components/MessageModal';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Play, Pause, StopCircle, Download, Copy, XCircle, Sparkles } from 'lucide-react'; // Import Lucide icons

// Custom hook to provide message modal functionality
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

// Utility function to clean markdown from text
const cleanMarkdown = (text: string): string => {
    // Remove bold, italic, strikethrough, and heading markdown
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // **bold**
        .replace(/\*(.*?)\*/g, '$1')   // *italic*
        .replace(/__(.*?)__/g, '$1')   // __bold__ (for underscores)
        .replace(/_(.*?)_/g, '$1')     // _italic_ (for underscores)
        .replace(/~~(.*?)~~/g, '$1')   // ~~strikethrough~~
        .replace(/#{1,6}\s/g, '')      // # headings (e.g., # Hello, ## World)
        .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // `inline code` or ```code block```
        .replace(/\n\s*-\s/g, '\n- ') // Clean up list hyphens if any
        .trim(); // Trim leading/trailing whitespace
};


const ConversationPage: React.FC = () => {
    const [question, setQuestion] = useState<string>('');
    const [aiAnswerText, setAiAnswerText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false); // Indicates AI is thinking/processing
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false); // True when AI audio is actively playing
    const [isAudioLoaded, setIsAudioLoaded] = useState<boolean>(false); // True when audio blob is loaded and ready to play

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioBlobRef = useRef<Blob | null>(null); // To store the fetched audio blob for replay/download

    const { showAlert, MessageModalComponent } = useMessageModal();

    const BACKEND_URL = 'http://localhost:5000';

    // --- Speech Recognition using react-speech-recognition ---
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    // Update the question state when transcript changes (user speaks)
    useEffect(() => {
        setQuestion(transcript);
    }, [transcript]);

    // Function to handle playing the audio
    const playAudio = (audioBlob: Blob) => {
        if (audioRef.current) {
            // Revoke previous URL if any to prevent memory leaks
            if (audioRef.current.src && audioRef.current.src.startsWith('blob:')) {
                URL.revokeObjectURL(audioRef.current.src);
            }
            const audioUrl = URL.createObjectURL(audioBlob);
            audioRef.current.src = audioUrl;
            audioRef.current.load(); // Load the new audio
            audioRef.current.play()
                .then(() => {
                    setIsSpeaking(true);
                    setIsAudioLoaded(true);
                })
                .catch(e => {
                    console.error("Error playing AI voice:", e);
                    showAlert('Error playing AI voice. Please try again or check browser settings.', 'error');
                    setIsSpeaking(false);
                    setIsAudioLoaded(false);
                });
        }
    };

    // Audio element event listeners (for AI's Eleven Labs voice)
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.onended = () => {
                setIsSpeaking(false);
            };
            audioRef.current.onerror = (e: any) => { // Corrected type to 'any'
                console.error("Audio playback error on <audio> element:", e);

                setIsSpeaking(false);
                setIsAudioLoaded(false);
            };
        }

        // Cleanup on unmount
        return () => {
            if (audioRef.current && audioRef.current.src.startsWith('blob:')) {
                URL.revokeObjectURL(audioRef.current.src);
            }
        };
    }, []);

    // Function to start speech recognition
    const startListening = () => {
        if (browserSupportsSpeechRecognition) {
            resetTranscript(); // Clear previous transcript
            setQuestion(''); // Clear previous question for fresh input
            SpeechRecognition.startListening({ continuous: false, language: 'en-US' });
            showAlert('Listening for your question...', 'info');
        } else {
            showAlert('Speech Recognition not supported in this browser. Please use text input.', 'error');
        }
    };

    // Function to stop speech recognition
    const stopListening = () => {
        SpeechRecognition.stopListening();
    };

    // New audio control functions
    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isSpeaking) {
                audioRef.current.pause();
                setIsSpeaking(false);
            } else if (isAudioLoaded) { // Only play if audio is loaded
                audioRef.current.play()
                    .then(() => setIsSpeaking(true))
                    .catch(e => {
                        console.error("Error resuming playback:", e);
                        showAlert('Could not resume audio. Try replaying.', 'error');
                    });
            }
        }
    };

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0; // Rewind to start
            setIsSpeaking(false);
        }
    };

    const downloadAudio = () => {
        if (audioBlobRef.current) {
            const downloadUrl = URL.createObjectURL(audioBlobRef.current);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'ai_answer.mp3';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);
            showAlert('Downloading audio...', 'success');
        } else {
            showAlert('No audio available to download.', 'info');
        }
    };


    // Function to ask AI and get response (text + Eleven Labs audio)
    const askAI = async () => {
        if (!question.trim()) {
            showAlert('Please enter your question (or speak it) to ask the AI!', 'error');
            return;
        }

        setIsLoading(true);
        setAiAnswerText(''); // Clear previous answer
        setIsSpeaking(false); // Ensure speaking indicator is off initially
        setIsAudioLoaded(false); // Reset audio loaded state
        audioBlobRef.current = null; // Clear previous audio blob

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }

        try {
            // --- Step 1: Get text answer from Gemini endpoint ---
            const textResponse = await fetch(`${BACKEND_URL}/generate-text`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question }),
            });

            if (!textResponse.ok) {
                const errorData = await textResponse.json();
                throw new Error(`Text generation failed: ${errorData.error || textResponse.statusText}`);
            }
            const textResult = await textResponse.json();
            const generatedText = textResult.text;

            // Clean markdown from the generated text
            const cleanedText = cleanMarkdown(generatedText);

            // --- Step 2: Get audio for the generated text from Eleven Labs endpoint ---
            const audioResponse = await fetch(`${BACKEND_URL}/generate-audio`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: generatedText }), // Send original text for better voice synthesis
            });

            if (!audioResponse.ok) {
                const errorText = await audioResponse.text();
                let errorMessage = `Audio generation failed: ${audioResponse.statusText}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = `Audio generation failed: ${errorJson.error || audioResponse.statusText}`;
                } catch (e) {
                    errorMessage = `Audio generation failed: ${errorText || audioResponse.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const audioBlob = await audioResponse.blob();
            audioBlobRef.current = audioBlob; // Store the blob for replay/download

            // Set text AFTER audio blob is successfully received
            setAiAnswerText(cleanedText); // Use the cleaned text for display
            playAudio(audioBlob);
            showAlert('AI is answering!', 'success');

        } catch (error: any) {
            console.error('Error asking AI:', error);
            showAlert(`Failed to get AI answer: ${error.message}`, 'error');
            setIsSpeaking(false);
            setIsAudioLoaded(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to re-speak the generated text answer (only calls generate-audio if blob not available)
    const reSpeakAnswer = async () => {
        if (!aiAnswerText) {
            showAlert('No answer available to replay.', 'info');
            return;
        }

        // If audio blob is already available, just play it
        if (audioBlobRef.current && audioRef.current && !isSpeaking) {
            audioRef.current.currentTime = 0; // Rewind to start
            playAudio(audioBlobRef.current);
            showAlert('Replaying AI answer!', 'info');
            return;
        }

        if (isSpeaking) {
             showAlert('AI is already speaking.', 'info');
             return;
        }

        // If no blob is stored (e.g., page refresh), re-fetch audio
        setIsLoading(true);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }

        try {
            // For replay, send the original (potentially markdown) text if possible for consistent voice.
            // If aiAnswerText is already cleaned, that's what will be sent.
            const audioResponse = await fetch(`${BACKEND_URL}/generate-audio`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: aiAnswerText }), // Use the existing AI answer text (might be cleaned)
            });

            if (!audioResponse.ok) {
                const errorText = await audioResponse.text();
                let errorMessage = `Audio generation failed: ${audioResponse.statusText}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = `Audio generation failed: ${errorJson.error || audioResponse.statusText}`;
                } catch (e) {
                    errorMessage = `Audio generation failed: ${errorText || audioResponse.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const audioBlob = await audioResponse.blob();
            audioBlobRef.current = audioBlob; // Store new blob
            playAudio(audioBlob);
            showAlert('Replaying AI answer!', 'info');

        } catch (error: any) {
            console.error('Error re-speaking answer:', error);
            showAlert(`Failed to replay answer: ${error.message}`, 'error');
            setIsSpeaking(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Clear question input
    const clearQuestion = () => {
        setQuestion('');
        resetTranscript(); // Clear speech recognition transcript
        showAlert('Question cleared!', 'info');
    };

    // Copy AI answer to clipboard
    const copyAiAnswer = async () => {
        if (aiAnswerText) {
            try {
                await navigator.clipboard.writeText(aiAnswerText);
                showAlert('AI answer copied to clipboard!', 'success');
            } catch (err) {
                console.error('Failed to copy text:', err);
                showAlert('Failed to copy text.', 'error');
            }
        } else {
            showAlert('No AI answer to copy.', 'info');
        }
    };


    return (
        // Outermost container - ensures it takes full viewport height and potentially hides overflow
        <div className="flex flex-col items-center justify-center h-screen p-4 bg-[var(--color-background-primary)] font-sans">
            {MessageModalComponent}

            <audio ref={audioRef} className="hidden" />

            {/* Main content wrapper - constrained height and internal scrolling for its content */}
            <div className="bg-[var(--color-background-secondary)] rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-screen-2xl border border-[var(--color-border)] transform transition-all duration-300 hover:shadow-3xl flex flex-col flex-grow">
                <h1 className="text-4xl md:text-5xl font-extrabold text-center text-[var(--color-text-primary)] mb-8 tracking-tight">
                    <span className="text-[var(--color-text-accent)]">AI</span> Conversational Assistant
                </h1>
                <p className="text-lg md:text-xl text-[var(--color-text-secondary)] text-center mb-10 max-w-3xl mx-auto">
                    Engage with the AI! Ask questions via text or voice, and get spoken answers.
                </p>

                {/* Three-column layout for input, animation, and AI response. This is the main flex container for the cards. */}
                <div className="flex flex-col lg:flex-row gap-8 flex-grow pb-4">
                    {/* Left Column: User Input Section */}
                    <div className="p-6 bg-[var(--color-background-primary)] rounded-xl shadow-inner border border-[var(--color-border)] flex flex-col h-full lg:w-[35%] overflow-hidden">
                        <label htmlFor="question-input" className="block text-[var(--color-text-primary)] text-lg font-semibold mb-3">
                            Your Question:
                        </label>
                        <textarea
                            id="question-input"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="e.g., What is dark matter? or Explain photosynthesis."
                            className="w-full p-4 border border-[var(--color-input-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-text-accent)]
                                    bg-[var(--color-input-bg)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] text-lg transition-colors duration-200 resize-none flex-grow mb-4 overflow-y-auto"
                            disabled={isLoading}
                        />

                        {/* Combined Mic Toggle Button */}
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4 mt-auto">
                            <button
                                onClick={listening ? stopListening : startListening}
                                disabled={isLoading || !browserSupportsSpeechRecognition}
                                title={listening ? 'Stop Listening' : 'Speak Question'} // Tooltip
                                className={`flex-1 py-3 px-6 rounded-full text-white font-semibold text-lg flex items-center justify-center
                                        ${isLoading || !browserSupportsSpeechRecognition ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400'}
                                        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background-primary)] shadow-md`}
                            >
                                {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                            </button>
                            <button
                                onClick={clearQuestion}
                                disabled={isLoading || listening || !question.trim()}
                                title="Clear Question" // Tooltip
                                className={`flex-1 py-3 px-6 rounded-full text-white font-semibold text-lg flex items-center justify-center
                                        ${isLoading || listening || !question.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-gray-700'}
                                        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background-primary)] shadow-md`}
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>


                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={askAI}
                                disabled={isLoading || listening || !question.trim()}
                                className={`flex-1 py-3 px-6 rounded-full text-white font-semibold text-lg flex items-center justify-center
                                        ${isLoading || !question.trim() ? 'bg-[var(--color-button-secondary-hover)] cursor-not-allowed' : 'bg-[var(--color-button-primary-bg)] hover:bg-[var(--color-button-primary-hover)] focus:ring-[var(--color-text-accent)]'}
                                        transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background-primary)] shadow-md`}
                            >
                                <Sparkles className="h-5 w-5 inline-block mr-2" />
                                {isLoading ? 'Thinking...' : 'Get AI Answer'}
                            </button>
                        </div>
                    </div>

                    {/* Middle Column: Voice Animation & Status Card */}
                    {(isLoading || isSpeaking) ? (
                        <div className="p-6 bg-[var(--color-background-primary)] rounded-xl shadow-inner border border-[var(--color-border)] flex flex-col items-center justify-center h-full lg:w-[30%]">
                            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-6 text-center">
                                AI Status
                            </h2>
                            <div className="audio-wave-large mb-4">
                                {Array.from({ length: 15 }).map((_, i) => (
                                    <div key={i} className="bar-large" style={{ animationDelay: `${i * 0.08}s` }}></div>
                                ))}
                            </div>
                            <span className="text-[var(--color-text-primary)] text-2xl font-bold mt-4 animate-pulse">
                                {isSpeaking ? 'AI is Speaking...' : 'AI is Thinking...'}
                            </span>
                        </div>
                    ) : (
                        // Placeholder for middle column when not active (to maintain layout if needed, or remove to collapse)
                        <div className="hidden lg:flex items-center justify-center p-6 bg-[var(--color-background-primary)] rounded-xl shadow-inner border border-[var(--color-border)] text-[var(--color-text-secondary)] h-full lg:w-[30%]">
                             <p className="text-center text-xl">Voice activity will appear here.</p>
                        </div>
                    )}


                    {/* Right Column: AI Answer Section */}
                    <div className="p-6 bg-[var(--color-background-primary)] rounded-xl shadow-inner border border-[var(--color-border)] flex flex-col justify-between h-full lg:w-[35%] overflow-hidden">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-4 text-center">
                                AI's Answer
                            </h2>

                            {/* Audio Controls & Copy Button - positioned at the top of the right card */}
                            {aiAnswerText && isAudioLoaded && (
                                <div className="flex flex-wrap justify-center gap-4 mb-6">
                                    <button
                                        onClick={togglePlayPause}
                                        disabled={isLoading}
                                        title={isSpeaking ? 'Pause Audio' : 'Play Audio'} // Tooltip
                                        className={`py-2 px-4 rounded-full text-white font-semibold text-md flex items-center justify-center
                                                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--color-feature-icon-1)] hover:bg-orange-700'}
                                                transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background-primary)] shadow-md`}
                                    >
                                        {isSpeaking ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                                    </button>

                                    <button
                                        onClick={stopAudio}
                                        disabled={isLoading || !isAudioLoaded}
                                        title="Stop Audio" // Tooltip
                                        className={`py-2 px-4 rounded-full text-white font-semibold text-md flex items-center justify-center
                                                ${isLoading || !isAudioLoaded ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}
                                                transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background-primary)] shadow-md`}
                                    >
                                        <StopCircle className="h-5 w-5" />
                                    </button>

                                    <button
                                        onClick={downloadAudio}
                                        disabled={isLoading || !isAudioLoaded}
                                        title="Download Audio" // Tooltip
                                        className={`py-2 px-4 rounded-full text-white font-semibold text-md flex items-center justify-center
                                                ${isLoading || !isAudioLoaded ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'}
                                                transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background-primary)] shadow-md`}
                                    >
                                        <Download className="h-5 w-5" />
                                    </button>

                                    <button
                                        onClick={reSpeakAnswer}
                                        disabled={isLoading || isSpeaking}
                                        title="Replay Answer" // Tooltip
                                        className={`py-2 px-4 rounded-full text-white font-semibold text-md flex items-center justify-center
                                            ${isLoading || isSpeaking ? 'bg-[var(--color-button-secondary-hover)] cursor-not-allowed' : 'bg-[var(--color-feature-icon-1)] hover:bg-orange-700'}
                                            transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background-primary)] shadow-md`}
                                    >
                                        <Play className="h-5 w-5" />
                                    </button>

                                    <button
                                        onClick={copyAiAnswer}
                                        disabled={!aiAnswerText}
                                        title="Copy Answer" // Tooltip
                                        className={`py-2 px-4 rounded-full text-white font-semibold text-md flex items-center justify-center
                                            ${!aiAnswerText ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}
                                            transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background-primary)] shadow-md`}
                                    >
                                        <Copy className="h-5 w-5" />
                                    </button>
                                </div>
                            )}

                            {aiAnswerText ? (
                                <div className="text-lg text-[var(--color-text-secondary)] leading-relaxed mb-4 whitespace-pre-wrap p-4 bg-[var(--color-input-bg)] rounded-md border border-[var(--color-input-border)] flex-grow overflow-y-auto">
                                    {aiAnswerText}
                                </div>
                            ) : (
                                !isLoading && (
                                    <div className="text-center text-[var(--color-text-secondary)] p-4 flex-grow flex items-center justify-center">
                                        <p className="text-xl mb-4">AI answers will appear on this card!</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Call to Action if nothing is happening and not loading (shown below the columns) */}
                {!aiAnswerText && !isLoading && (
                    <div className="text-center text-[var(--color-text-secondary)] mt-10">
                        <p className="text-xl mb-4">Start by asking a question!</p>
                        <p className="text-md">Your conversational AI assistant awaits.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConversationPage;