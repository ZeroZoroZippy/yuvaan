import React, { useState, useRef, useEffect } from 'react';
import { useChatbot } from '../contexts/ChatbotContext';
import { useAnalytics } from '../hooks/useAnalytics';
import Orb from './ui/orb';

const Chatbot = () => {
    const { isOpen, isAnimating, messages, closeChatbot, addMessage, setIsAnimating } = useChatbot();
    const { trackChatbot, trackCTA } = useAnalytics();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && !isAnimating) {
            inputRef.current?.focus();
        }
    }, [isOpen, isAnimating]);

    useEffect(() => {
        if (isOpen && isAnimating) {
            // End animation after orb reaches final position
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [isOpen, isAnimating, setIsAnimating]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            trackChatbot('message_sent', messages.length + 1, 'user_input');
            trackCTA('chatbot_message_send', 'chatbot_interaction', {
                messageLength: inputValue.trim().length,
                messageCount: messages.length + 1,
                currentPage: window.location.pathname
            });
            addMessage(inputValue.trim());
            setInputValue('');
        }
    };

    const handleCloseChatbot = (context = 'unknown') => {
        trackChatbot('close', messages.length, 'close_button');
        trackCTA(`chatbot_close_${context}`, 'chatbot_interaction', {
            messageCount: messages.length,
            sessionDuration: Date.now() - (messages[0]?.timestamp || Date.now()),
            currentPage: window.location.pathname,
            context
        });
        closeChatbot();
    };

    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Blur overlay background */}
            <div
                className={`fixed inset-0 z-40 transition-all duration-1000 ease-out ${isAnimating ? 'backdrop-blur-0' : 'backdrop-blur-md'
                    }`}
            />

            {/* Desktop Layout - Orb and Chat positioned together */}
            <div className="hidden md:block">
                {/* Smaller Orb for Desktop */}
                <div
                    className={`fixed z-50 w-20 h-20 transition-all duration-1200 ease-out ${isAnimating
                        ? 'bottom-[-80px] right-[60px] opacity-0'
                        : 'bottom-[60px] right-[60px] opacity-100'
                        }`}
                >
                    <Orb
                        hue={220}
                        hoverIntensity={0.3}
                        rotateOnHover={true}
                        forceHoverState={!isAnimating}
                    />
                </div>

                {/* Chat interface positioned above orb */}
                <div
                    className={`fixed z-50 transition-all duration-1000 ease-out ${isAnimating ? 'opacity-0 pointer-events-none delay-0' : 'opacity-100 delay-300'
                        }`}
                    style={{
                        bottom: '160px', // 60px (orb bottom) + 80px (orb height) + 20px (gap)
                        right: '60px',
                        width: '420px'
                    }}
                >
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl h-[550px] flex flex-col border border-white/20 shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/20">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="text-white text-base font-bold">S</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold" style={{ fontFamily: "Syne, sans-serif" }}>Saarth</h3>
                                    <p className="text-white/70 text-xs" style={{ fontFamily: "Neuton, serif" }}>AI Assistant</p>
                                </div>
                            </div>
                            <button
                                onClick={closeChatbot}
                                className="text-white/70 hover:text-white transition-colors p-1"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30 scroll-smooth">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.sender === 'user'
                                            ? 'bg-[#A8977A] text-[#45372B]'
                                            : 'bg-[#161711] text-[#A8977A] border border-[#A8977A]/20'
                                            }`}
                                    >
                                        <p className="text-base" style={{ fontFamily: "Neuton, serif" }}>{message.text}</p>
                                        <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-[#45372B]/80' : 'text-[#A8977A]/60'
                                            }`}>
                                            {formatTime(message.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-white/20">
                            <div className="flex space-x-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="bg-blue-500/80 hover:bg-blue-600/80 disabled:bg-white/20 text-white rounded-full px-6 py-2 transition-colors disabled:cursor-not-allowed"
                                    style={{ fontFamily: "Neuton, serif" }}
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Mobile Layout - Centered orb with reduced size */}
            <div className="md:hidden">
                {/* Centered Orb for mobile with smaller size */}
                <div
                    className={`fixed z-50 w-16 h-16 transition-all duration-1200 ease-out ${isAnimating
                        ? 'bottom-[-64px] left-1/2 transform -translate-x-1/2 opacity-0'
                        : 'bottom-[60px] left-1/2 transform -translate-x-1/2 opacity-100'
                        }`}
                >
                    <Orb
                        hue={220}
                        hoverIntensity={0.3}
                        rotateOnHover={true}
                        forceHoverState={!isAnimating}
                    />
                </div>

                {/* Chat interface centered for mobile */}
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-1000 ease-out ${isAnimating ? 'opacity-0 pointer-events-none delay-0' : 'opacity-100 delay-300'
                        }`}
                >
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl w-full max-w-md h-[600px] flex flex-col border border-white/20 shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/20">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="text-white text-base font-bold">S</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold" style={{ fontFamily: "Syne, sans-serif" }}>Saarth</h3>
                                    <p className="text-white/70 text-xs" style={{ fontFamily: "Neuton, serif" }}>AI Assistant</p>
                                </div>
                            </div>
                            <button
                                onClick={closeChatbot}
                                className="text-white/70 hover:text-white transition-colors p-1"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30 scroll-smooth">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.sender === 'user'
                                            ? 'bg-[#A8977A] text-[#45372B]'
                                            : 'bg-[#161711] text-[#A8977A] border border-[#A8977A]/20'
                                            }`}
                                    >
                                        <p className="text-lg" style={{ fontFamily: "Neuton, serif" }}>{message.text}</p>
                                        <p className={`text-sm mt-1 ${message.sender === 'user' ? 'text-[#45372B]/80' : 'text-[#A8977A]/60'
                                            }`}>
                                            {formatTime(message.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-white/20">
                            <div className="flex space-x-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="bg-blue-500/80 hover:bg-blue-600/80 disabled:bg-white/20 text-white rounded-full px-6 py-2 transition-colors disabled:cursor-not-allowed"
                                    style={{ fontFamily: "Neuton, serif" }}
                                >
                                    Send
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