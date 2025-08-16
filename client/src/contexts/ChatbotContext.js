import React, { createContext, useContext, useState, useRef } from 'react';
import analyticsService from '../services/analyticsService';

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

  // Analytics tracking refs
  const conversationId = useRef(`conv_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`);
  const sessionStartTime = useRef(null);
  const userMessageCount = useRef(0);
  const botMessageCount = useRef(1); // Start with 1 for initial greeting
  const conversationTopics = useRef(new Set());
  const userIntents = useRef(new Set());
  const conversationSentiments = useRef([]);

  const openChatbot = () => {
    setIsOpen(true);
    setIsAnimating(true);
    
    // Track chatbot session start
    sessionStartTime.current = Date.now();
    
    // REMOVED: Duplicate session start tracking
    // The Chatbot.js component will handle session management via useAnalytics hook
    
    // Track basic chatbot open event
    analyticsService.trackChatbotInteraction('open', messages.length, 'chatbot_trigger', {
      conversationId: conversationId.current,
      sessionStartTime: sessionStartTime.current,
      initialMessageCount: messages.length,
      currentPage: window.location.pathname,
      userAgent: navigator.userAgent.substring(0, 100),
      timestamp: Date.now()
    });
  };

  const closeChatbot = () => {
    // Track comprehensive chatbot session before closing
    const sessionEndTime = Date.now();
    const sessionDuration = sessionEndTime - (sessionStartTime.current || sessionEndTime);
    
    // Analyze conversation for insights
    const conversationAnalysis = analyzeConversation();
    
    // REMOVED: Duplicate session end tracking
    // The Chatbot.js component will handle session closure via useAnalytics hook

    // Track basic close interaction for context analysis
    analyticsService.trackChatbotInteraction('close', messages.length, 'session_end', {
      conversationId: conversationId.current,
      duration: sessionDuration,
      userMessages: messages.filter(m => m.sender === 'user').length,
      botResponses: messages.filter(m => m.sender === 'bot').length,
      summary: conversationAnalysis.summary,
      detectedIntent: conversationAnalysis.primaryIntent,
      satisfaction: conversationAnalysis.satisfaction,
      outcome: conversationAnalysis.outcome,
      topics: Array.from(conversationTopics.current)
    });
    
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
      
      // Reset conversation tracking for next session
      resetConversationTracking();
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

    // REMOVED: Duplicate message tracking
    // The Chatbot.js component will handle message tracking via useAnalytics hook
    // We'll only maintain local conversation analytics here
    
    // Update local conversation tracking for analysis
    if (sender === 'user') {
      userMessageCount.current++;
      
      // Extract and track topics and intents from user message locally
      const topics = analyticsService.extractTopics(text);
      const intent = analyticsService.detectUserIntent(text);
      const sentiment = analyticsService.detectSentiment(text);
      
      topics.forEach(topic => conversationTopics.current.add(topic));
      userIntents.current.add(intent);
      conversationSentiments.current.push(sentiment);
    } else {
      botMessageCount.current++;
    }

    // Simulate bot response for demo
    if (sender === 'user') {
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: getBotResponse(text),
          sender: 'bot',
          timestamp: new Date()
        };
        
        // Add bot response (this will not trigger duplicate tracking)
        addMessage(botResponse.text, 'bot');
      }, 1000);
    }
  };

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Contextual responses based on user message content
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote')) {
      return "I'd be happy to help you with pricing information! Yuvaan offers competitive rates for web development projects. Would you like to discuss your specific project requirements?";
    }
    
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('work') || lowerMessage.includes('examples')) {
      return "Great question! You can see Yuvaan's latest projects right here on this website. Check out the Projects section to see his recent work, including the Sarvodaya Dental Clinic website and other exciting projects.";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email')) {
      return "Perfect! You can reach Yuvaan directly through the contact form on this website, or connect with him on LinkedIn. He typically responds within 24 hours and would love to discuss your project!";
    }
    
    if (lowerMessage.includes('experience') || lowerMessage.includes('skills') || lowerMessage.includes('background')) {
      return "Yuvaan is a skilled full-stack developer with expertise in React, Node.js, and modern web technologies. He specializes in creating beautiful, functional websites that deliver great user experiences. Check out the About page to learn more!";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! Welcome to Yuvaan's portfolio. I'm here to help you learn more about his work and how he can help with your project. What would you like to know?";
    }
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're very welcome! Is there anything else you'd like to know about Yuvaan's services or experience? I'm here to help!";
    }
    
    // Default responses
    const responses = [
      "That's interesting! Yuvaan would love to discuss that with you. Feel free to reach out through the contact form.",
      "I can help you learn more about Yuvaan's work and experience. What specific aspect interests you most?",
      "Would you like to know more about Yuvaan's projects, skills, or how he can help with your next project?",
      "Feel free to ask me anything about Yuvaan's expertise in web development and design!",
      "I'm here to help you connect with Yuvaan. What would you like to know about his services?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Analyze conversation for insights (used by close tracking)
  const analyzeConversation = () => {
    
    // Determine overall sentiment
    const sentimentCounts = conversationSentiments.current.reduce((acc, sentiment) => {
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {});
    
    const overallSentiment = Object.keys(sentimentCounts).reduce((a, b) => 
      sentimentCounts[a] > sentimentCounts[b] ? a : b, 'neutral'
    );
    
    // Determine primary intent
    const intentArray = Array.from(userIntents.current);
    const primaryIntent = intentArray.length > 0 ? intentArray[0] : 'general_inquiry';
    
    // Determine conversation outcome
    let outcome = 'completed';
    if (userMessageCount.current === 0) outcome = 'no_interaction';
    else if (userMessageCount.current < 3) outcome = 'brief_interaction';
    else if (userIntents.current.has('contact_request') || userIntents.current.has('hire_intent')) outcome = 'lead_generated';
    
    // Determine satisfaction level
    let satisfaction = 'unknown';
    if (overallSentiment === 'positive') satisfaction = 'satisfied';
    else if (overallSentiment === 'negative') satisfaction = 'unsatisfied';
    else satisfaction = 'neutral';
    
    // Determine lead quality
    let leadQuality = 'low';
    if (userIntents.current.has('hire_intent') || userIntents.current.has('pricing_request')) leadQuality = 'high';
    else if (userIntents.current.has('contact_request') || userIntents.current.has('portfolio_request')) leadQuality = 'medium';
    
    // Determine conversion potential
    let conversionPotential = 'low';
    if (leadQuality === 'high' && overallSentiment === 'positive') conversionPotential = 'high';
    else if (leadQuality === 'medium' || overallSentiment === 'positive') conversionPotential = 'medium';
    
    // Create conversation summary
    const summary = `${userMessageCount.current} user messages, topics: ${Array.from(conversationTopics.current).join(', ')}, primary intent: ${primaryIntent}`;
    
    return {
      overallSentiment,
      primaryIntent,
      outcome,
      satisfaction,
      leadQuality,
      conversionPotential,
      summary
    };
  };

  // Reset conversation tracking for new session
  const resetConversationTracking = () => {
    conversationId.current = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStartTime.current = null;
    userMessageCount.current = 0;
    botMessageCount.current = 1; // Reset to 1 for initial greeting
    conversationTopics.current.clear();
    userIntents.current.clear();
    conversationSentiments.current = [];
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