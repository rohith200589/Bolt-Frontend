import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa'; // Assuming react-icons is installed
import { Sparkle, SparkleIcon } from 'lucide-react';
interface AIChatWidgetProps {
  onClose: () => void;
}

interface ChatMessage {
  from: 'user' | 'ai';
  text: string;
}

const AIChatWidget: React.FC<AIChatWidgetProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scrolling

  // Initial welcome messages from AI
  useEffect(() => {
    // Add an initial welcome message from the AI only once
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([
          { from: 'ai', text: "Hello! I'm Knovia AI, your intelligent assistant. How can I help you learn today?" },
          { from: 'ai', text: "I can assist with course questions, provide quick definitions, or guide you to relevant resources. Try asking me anything!" }
        ]);
      }, 500); // Small delay to make it feel like AI is "loading"
    }
  }, []); // Empty dependency array means this runs once on mount

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]); // Scroll whenever messages or typing status changes

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      from: 'user',
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Mock AI Response Logic (enhanced for professionalism and variety)
    setTimeout(() => {
      let aiResponseText: string;
      const lowerCaseInput = userMessage.text.toLowerCase();

      if (lowerCaseInput.includes('hello') || lowerCaseInput.includes('hi')) {
        aiResponseText = "Hi there! What's on your mind? I'm ready to assist you with Knovia's features or any study-related queries.";
      } else if (lowerCaseInput.includes('course') && lowerCaseInput.includes('math')) {
        aiResponseText = "Great! We have excellent mathematics courses. Are you looking for foundational math, calculus, or something more advanced?";
      } else if (lowerCaseInput.includes('visualizer') || lowerCaseInput.includes('diagram')) {
        aiResponseText = "Ah, the AI Content Visualizer! It's designed to transform your text into insightful diagrams. You can find more details and a tutorial by navigating to the Visualizer page from the main menu.";
      } else if (lowerCaseInput.includes('define') || lowerCaseInput.includes('what is')) {
        aiResponseText = "To provide an accurate definition, could you please specify the term you're interested in? For example: 'Define quantum physics' or 'What is photosynthesis?'";
      } else if (lowerCaseInput.includes('quiz') || lowerCaseInput.includes('test')) {
        aiResponseText = "Quizzes are a fantastic way to test your knowledge! Which subject or course are you preparing for? I can help you find relevant practice tests.";
      } else if (lowerCaseInput.includes('feedback') || lowerCaseInput.includes('suggestion')) {
        aiResponseText = "Your feedback is valuable to us! Please visit the 'Contact Us' page to submit your suggestions, or you can often find a feedback form within the settings or profile section.";
      } else if (lowerCaseInput.includes('thank you') || lowerCaseInput.includes('thanks')) {
        aiResponseText = "You're most welcome! Is there anything else I can assist you with today?";
      }
      else {
        aiResponseText = `I'm Knovia AI, here to assist with your learning journey. While I can't process that specific query just yet, I'm constantly learning! For now, I can help with general information or guide you through the platform's features.`;
      }

      const aiResponse: ChatMessage = {
        from: 'ai',
        text: aiResponseText,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-20 right-4 md:right-8 w-full max-w-sm z-50
                     bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700
                     rounded-xl shadow-xl flex flex-col h-[450px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 dark:border-gray-700">
        <h3 className="text-base font-bold text-gray-800 dark:text-white"> <SparkleIcon className="h-5 w-5 inline mr-2" /> Knovia AI Assistant</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-red-500 transition"
          aria-label="Close chat widget"
        >
          <FaTimes size={18} /> {/* Slightly larger close icon */}
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-sm scrollbar-hide"> {/* Added scrollbar-hide for cleaner look */}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-4 py-2 rounded-xl whitespace-pre-line break-words
              ${msg.from === 'user'
                ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm'}`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 italic px-4 py-2 rounded-xl rounded-bl-none shadow-sm">
              Knovia AI is thinking<span className="dot-animation">...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Scroll target */}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="border-t border-gray-300 dark:border-gray-700 p-3 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-[#2a2a2a]
                     text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600
                     focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Ask Knovia AI anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping} // Disable input while AI is "typing"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition
                     flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!input.trim() || isTyping} // Disable send button if input is empty or AI is typing
          aria-label="Send message"
        >
          <FaPaperPlane size={16} /> {/* Slightly larger send icon */}
        </button>
      </form>
    </div>
  );
};

export default AIChatWidget;