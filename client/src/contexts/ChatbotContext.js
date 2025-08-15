import React, { createContext, useContext, useState } from 'react';

const ChatbotContext = createContext();

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Saarth, Yuvaan's AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  const openChatbot = () => {
    setIsOpen(true);
    setIsAnimating(true);
  };

  const closeChatbot = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
    }, 800); // Match animation duration
  };

  const addMessage = (text, sender = 'user') => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate bot response for demo
    if (sender === 'user') {
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: getBotResponse(text),
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const getBotResponse = (userMessage) => {
    const responses = [
      "That's interesting! Yuvaan would love to discuss that with you.",
      "I can help you learn more about Yuvaan's work and experience.",
      "Would you like to know more about Yuvaan's projects or background?",
      "Feel free to ask me anything about Yuvaan's skills and expertise!",
      "I'm here to help you connect with Yuvaan. What would you like to know?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        isAnimating,
        messages,
        openChatbot,
        closeChatbot,
        addMessage,
        setIsAnimating
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};