import React, { useState, useRef, useEffect } from 'react';
import { useChatbot } from '../context/ChatbotContext';
import { useAnalytics } from '../../hooks/useAnalytics';

const Chatbot = () => {
    const {
        isOpen,
        isAnimating,
        messages,
        isProcessing,
        closeChatbot,
        addMessage,
        setIsAnimating,
        leadData,
        conversationContext
    } = useChatbot();
    const { trackChatbot, trackCTA } = useAnalytics();
    const [inputValue, setInputValue] = useState('');
    const [chatbotSessionId, setChatbotSessionId] = useState(null);
    const [showTypingIndicator, setShowTypingIndicator] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);

    // Enhanced auto-scroll with smooth behavior
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [messages, showTypingIndicator]);

    useEffect(() => {
        if (isOpen && !isAnimating) {
            inputRef.current?.focus();
        }
    }, [isOpen, isAnimating]);

    // Professional typing indicator
    useEffect(() => {
        if (isProcessing) {
            setShowTypingIndicator(true);
        } else {
            const timer = setTimeout(() => setShowTypingIndicator(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isProcessing]);

    useEffect(() => {
        if (isOpen && isAnimating) {
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [isOpen, isAnimating, setIsAnimating]);

    // Enhanced session management with business analytics
    useEffect(() => {
        if (isOpen && !chatbotSessionId) {
            const startSession = async () => {
                try {
                    const sessionId = await trackChatbot('professional_session_start', 0, 'business_inquiry', {
                        userAgent: navigator.userAgent.substring(0, 100),
                        referrer: document.referrer,
                        currentPage: window.location.pathname,
                        timestamp: Date.now()
                    });
                    setChatbotSessionId(sessionId);

                    if (process.env.NODE_ENV === 'development') {
                        console.log('Professional session started:', sessionId);
                    }
                } catch (error) {
                    console.error('Failed to start professional session:', error);
                }
            };

            startSession();
        }
    }, [isOpen, chatbotSessionId, trackChatbot]);

    // Enhanced message tracking with business context
    useEffect(() => {
        if (messages.length > 0 && chatbotSessionId) {
            const lastMessage = messages[messages.length - 1];

            // Track with professional context
            trackChatbot('professional_message', messages.length, 'client_interaction', {
                messageData: {
                    id: lastMessage.id,
                    content: lastMessage.text,
                    sender: lastMessage.sender,
                    timestamp: lastMessage.timestamp.getTime(),
                    conversationId: chatbotSessionId,
                    leadQuality: leadData?.qualificationLevel || 'unknown',
                    businessValue: conversationContext?.businessValue || 'unknown'
                }
            });
        }
    }, [messages, chatbotSessionId, trackChatbot, leadData, conversationContext]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            // Enhanced tracking with professional context
            try {
                trackCTA('professional_message_send', 'client_engagement', {
                    messageLength: inputValue.trim().length,
                    messageCount: messages.length + 1,
                    currentPage: window.location.pathname,
                    sessionId: chatbotSessionId,
                    leadQuality: leadData?.qualificationLevel || 'unknown',
                    hasEmail: !!leadData?.email,
                    projectType: leadData?.projectType || 'unknown'
                });
            } catch (error) {
                console.warn('Professional analytics tracking error:', error.message);
            }

            addMessage(inputValue.trim());
            setInputValue('');
        }
    };

    const handleCloseChatbot = async (context = 'unknown') => {
        try {
            // Enhanced professional session closure tracking
            const sessionDuration = chatbotSessionId ? Date.now() - (messages[0]?.timestamp?.getTime() || Date.now()) : 0;

            await trackChatbot('professional_session_close', messages.length, 'client_conclusion', {
                context,
                sessionDuration,
                finalMessageCount: messages.length,
                sessionId: chatbotSessionId,
                leadQuality: leadData?.qualificationLevel || 'unknown',
                businessValue: conversationContext?.businessValue || 'unknown',
                emailCaptured: !!leadData?.email,
                projectType: leadData?.projectType || 'unknown',
                conversionPotential: determineConversionPotential()
            });

            trackCTA(`professional_close_${context}`, 'client_interaction', {
                messageCount: messages.length,
                sessionDuration,
                currentPage: window.location.pathname,
                context,
                sessionId: chatbotSessionId,
                businessOutcome: getBusinessOutcome()
            });
        } catch (error) {
            console.warn('Professional analytics tracking error:', error.message);
        }

        setChatbotSessionId(null);
        closeChatbot();
    };

    const determineConversionPotential = () => {
        if (leadData?.email && leadData?.qualificationLevel === 'high') return 'high';
        if (leadData?.qualificationLevel === 'high' || leadData?.email) return 'medium';
        if (conversationContext?.intents?.has('business_inquiry')) return 'low';
        return 'minimal';
    };

    const getBusinessOutcome = () => {
        if (leadData?.email) return 'lead_captured';
        if (leadData?.qualificationLevel === 'high') return 'qualified_prospect';
        if (conversationContext?.intents?.has('hire_intent')) return 'hiring_interest';
        return 'general_inquiry';
    };

    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Professional typing indicator component
    const TypingIndicator = () => (
        <div className="w-full mb-4">
            <div className="bg-[#161711] text-[#A8977A] border border-[#A8977A]/20 rounded-2xl px-4 py-3 max-w-[70%]">
                <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#A8977A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-[#A8977A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-[#A8977A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-xs text-[#A8977A]/60 ml-2" style={{ fontFamily: "Neuton, serif" }}>
                        Analyzing your needs...
                    </span>
                </div>
            </div>
        </div>
    );

    if (!isOpen) return null;

    return (
        <>
            {/* Blur overlay background */}
            <div
                className={`fixed inset-0 z-[9998] transition-all duration-1000 ease-out ${isAnimating ? 'backdrop-blur-0' : 'backdrop-blur-md'
                    }`}
            />

            {/* Desktop Layout - Enhanced for professional use */}
            <div className="hidden md:block">
                {/* Enhanced chat interface - Centered and larger */}
                <div
                    className={`fixed z-[9999] transition-all duration-1000 ease-out ${isAnimating ? 'opacity-0 pointer-events-none delay-0' : 'opacity-100 delay-300'
                        }`}
                    style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '600px',
                        height: '700px'
                    }}
                >
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl h-full flex flex-col border border-white/20 shadow-2xl relative">

                        {/* Professional Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/20 flex-shrink-0">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A8977A] to-[#8B7355] flex items-center justify-center">
                                        <span className="text-white text-base font-bold">S</span>
                                    </div>
                                    {/* Online status indicator */}
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold" style={{ fontFamily: "Bubblegum Sans, sans-serif" }}>
                                        Saarth
                                    </h3>
                                    <p className="text-white/70 text-xs" style={{ fontFamily: "Neuton, serif" }}>
                                        AI Assistant
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleCloseChatbot('desktop')}
                                className="text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Enhanced Messages with full-width left alignment */}
                        <div
                            ref={messagesContainerRef}
                            className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 scroll-smooth"
                            data-lenis-prevent
                            style={{
                                overscrollBehavior: 'contain',
                                WebkitOverflowScrolling: 'touch'
                            }}
                        >
                            {messages.map((message) => {
                                // More precise dynamic width based on message length
                                const getMessageWidth = (text) => {
                                    if (text.length <= 10) return 'max-w-[35%]';  // Very short: "hello", "ok", "yes"
                                    if (text.length <= 20) return 'max-w-[50%]';  // Short phrases
                                    if (text.length <= 40) return 'max-w-[65%]';  // Medium sentences
                                    if (text.length <= 80) return 'max-w-[75%]';  // Longer messages
                                    if (text.length <= 150) return 'max-w-[85%]'; // Very long messages
                                    return 'max-w-[95%]';                          // Maximum width
                                };

                                return (
                                    <div key={message.id} className="w-full">
                                        <div
                                            className={`${getMessageWidth(message.text)} rounded-2xl px-4 py-3 ${message.sender === 'user'
                                                    ? 'bg-gradient-to-r from-[#A8977A] to-[#8B7355] text-white shadow-lg'
                                                    : 'bg-[#161711] text-[#A8977A] border border-[#A8977A]/20 shadow-md'
                                                }`}
                                        >
                                            <p className={`text-lg leading-relaxed ${message.sender === 'user' ? 'font-semibold' : ''
                                                }`} style={{
                                                    fontFamily: message.sender === 'user' ? "Bubblegum Sans, sans-serif" : "Neuton, serif"
                                                }}>
                                                {message.text}
                                            </p>
                                            <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-white/80' : 'text-[#A8977A]/60'
                                                }`}>
                                                {formatTime(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Professional typing indicator */}
                            {showTypingIndicator && <TypingIndicator />}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Enhanced Input with professional features */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-white/20 flex-shrink-0">
                            <div className="flex space-x-3">
                                <div className="flex-1 relative">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Discuss your project needs..."
                                        disabled={isProcessing}
                                        className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#A8977A] focus:ring-1 focus:ring-[#A8977A] transition-all disabled:opacity-50"
                                        style={{ fontFamily: "Neuton, serif" }}
                                    />
                                    {/* Character count for longer messages */}
                                    {inputValue.length > 100 && (
                                        <span className="absolute -top-6 right-2 text-xs text-white/40">
                                            {inputValue.length}/500
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isProcessing}
                                    className="bg-gradient-to-r from-[#A8977A] to-[#8B7355] hover:from-[#8B7355] hover:to-[#6D5D42] disabled:from-white/20 disabled:to-white/20 text-white rounded-full px-6 py-3 transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                                    style={{ fontFamily: "Neuton, serif" }}
                                >
                                    {isProcessing ? (
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        'Send'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Mobile Layout - Full Screen */}
            <div className="md:hidden">
                {/* Mobile Chat Interface - Full Screen */}
                <div
                    className={`fixed z-[9999] inset-0 transition-all duration-1000 ease-out ${isAnimating ? 'opacity-0 pointer-events-none delay-0' : 'opacity-100 delay-300'
                        }`}
                >
                    <div className="bg-white/10 backdrop-blur-lg h-full flex flex-col border-0 shadow-2xl relative">

                        {/* Mobile Professional Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/20 flex-shrink-0 bg-white/5">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A8977A] to-[#8B7355] flex items-center justify-center">
                                        <span className="text-white text-lg font-bold">S</span>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-lg" style={{ fontFamily: "Bubblegum Sans, sans-serif" }}>
                                        Saarth
                                    </h3>
                                    <p className="text-white/70 text-sm" style={{ fontFamily: "Neuton, serif" }}>
                                        AI Assistant • Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleCloseChatbot('mobile')}
                                className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Mobile Messages - Full available space */}
                        <div
                            ref={messagesContainerRef}
                            className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 scroll-smooth"
                            data-lenis-prevent
                            style={{
                                overscrollBehavior: 'contain',
                                WebkitOverflowScrolling: 'touch'
                            }}
                        >
                            {messages.map((message) => {
                                // More precise dynamic width based on message length  
                                const getMessageWidth = (text) => {
                                    if (text.length <= 10) return 'max-w-[35%]';  // Very short: "hello", "ok", "yes"
                                    if (text.length <= 20) return 'max-w-[50%]';  // Short phrases
                                    if (text.length <= 40) return 'max-w-[65%]';  // Medium sentences
                                    if (text.length <= 80) return 'max-w-[75%]';  // Longer messages
                                    if (text.length <= 150) return 'max-w-[85%]'; // Very long messages
                                    return 'max-w-[95%]';                          // Maximum width
                                };

                                return (
                                    <div key={message.id} className="w-full">
                                        <div
                                            className={`${getMessageWidth(message.text)} rounded-2xl px-4 py-3 ${message.sender === 'user'
                                                    ? 'bg-gradient-to-r from-[#A8977A] to-[#8B7355] text-white shadow-lg'
                                                    : 'bg-[#161711] text-[#A8977A] border border-[#A8977A]/20 shadow-md'
                                                }`}
                                        >
                                            <p className={`text-lg leading-relaxed ${message.sender === 'user' ? 'font-semibold' : ''
                                                }`} style={{
                                                    fontFamily: message.sender === 'user' ? "Bubblegum Sans, sans-serif" : "Neuton, serif"
                                                }}>
                                                {message.text}
                                            </p>
                                            <p className={`text-sm mt-2 ${message.sender === 'user' ? 'text-white/80' : 'text-[#A8977A]/60'
                                                }`}>
                                                {formatTime(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            {showTypingIndicator && <TypingIndicator />}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Mobile Input - Fixed at bottom */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-white/20 flex-shrink-0 bg-white/5">
                            <div className="flex space-x-3">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your message..."
                                    disabled={isProcessing}
                                    className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#A8977A] focus:ring-1 focus:ring-[#A8977A] transition-all disabled:opacity-50 text-lg"
                                    style={{ fontFamily: "Neuton, serif" }}
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isProcessing}
                                    className="bg-gradient-to-r from-[#A8977A] to-[#8B7355] hover:from-[#8B7355] hover:to-[#6D5D42] disabled:from-white/20 disabled:to-white/20 text-white rounded-full px-6 py-3 transition-all disabled:cursor-not-allowed shadow-lg font-medium"
                                    style={{ fontFamily: "Neuton, serif" }}
                                >
                                    {isProcessing ? (
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        'Send'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbot;