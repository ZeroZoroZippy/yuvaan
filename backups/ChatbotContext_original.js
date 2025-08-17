// Enhanced ChatbotContext.js - Professional AI Assistant
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
      text: "Hello! I'm Yuvaan's AI assistant, representing him professionally. I can discuss his projects, expertise, and how he might help with your needs. What brings you here today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Professional context and lead tracking
  const conversationId = useRef(`session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`);
  const sessionStartTime = useRef(null);
  const leadData = useRef({
    email: null,
    name: null,
    company: null,
    projectType: null,
    budget: null,
    timeline: null,
    contactAttempted: false,
    qualificationLevel: 'unknown' // low, medium, high, qualified
  });
  const conversationContext = useRef({
    topics: new Set(),
    intents: new Set(),
    sentiments: [],
    businessValue: 'unknown', // high, medium, low
    nextActions: []
  });

  // Professional portfolio data (replace with your actual data)
  const portfolioData = {
    name: "Yuvaan",
    title: "Full-Stack Developer & UI/UX Designer",
    specialties: ["React", "Node.js", "Modern Web Development", "UI/UX Design"],
    recentProjects: [
      "Sarvodaya Dental Clinic - Complete digital transformation",
      "E-commerce Platform - Full-stack solution",
      "Corporate Website - Modern, responsive design"
    ],
    experience: "3+ years in full-stack development",
    contact: {
      email: "yuvaanvithlani@gmail.com", // Replace with actual
      linkedin: "https://www.linkedin.com/in/yuvaanvithlani/", // Replace with actual
      portfolio: "yourportfolio.com" // Replace with actual
    }
  };

  const openChatbot = () => {
    setIsOpen(true);
    setIsAnimating(true);
    sessionStartTime.current = Date.now();
    
    // Track professional interaction start
    analyticsService.trackChatbotInteraction('session_start', messages.length, 'professional_inquiry', {
      conversationId: conversationId.current,
      sessionStartTime: sessionStartTime.current,
      currentPage: window.location.pathname,
      referrer: document.referrer,
      timestamp: Date.now()
    });
  };

  const closeChatbot = () => {
    const sessionAnalysis = analyzeBusinessConversation();
    
    // Send lead data if qualified
    if (leadData.current.email || sessionAnalysis.leadQuality === 'high') {
      recordLeadData(sessionAnalysis);
    }

    // Track any unanswered questions for improvement
    if (conversationContext.current.intents.has('unknown_request')) {
      recordUnknownQuestions();
    }
    
    analyticsService.trackChatbotInteraction('session_end', messages.length, 'professional_conclusion', {
      ...sessionAnalysis,
      conversationId: conversationId.current,
      duration: Date.now() - (sessionStartTime.current || Date.now())
    });
    
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
      resetSession();
    }, 800);
  };

  const addMessage = async (text, sender = 'user') => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);

    if (sender === 'user') {
      // Analyze user intent and extract business context
      analyzeUserMessage(text);
      
      // Generate professional AI response
      setIsProcessing(true);
      try {
        const response = await generateProfessionalResponse(text);
        setTimeout(() => {
          addMessage(response, 'bot');
          setIsProcessing(false);
        }, 1200); // Professional response timing
      } catch (error) {
        console.error('Response generation failed:', error);
        setIsProcessing(false);
        addMessage("I apologize for the delay. Let me connect you directly with Yuvaan for the best assistance. May I have your email to facilitate this?", 'bot');
      }
    }
  };

  const analyzeUserMessage = (text) => {
    const lowerText = text.toLowerCase();
    
    // Extract business context
    if (lowerText.includes('email') && lowerText.includes('@')) {
      const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) leadData.current.email = emailMatch[0];
    }
    
    if (lowerText.includes('company') || lowerText.includes('business')) {
      conversationContext.current.intents.add('business_inquiry');
      leadData.current.qualificationLevel = 'medium';
    }
    
    if (lowerText.includes('hire') || lowerText.includes('project') || lowerText.includes('work with')) {
      conversationContext.current.intents.add('hire_intent');
      leadData.current.qualificationLevel = 'high';
    }
    
    if (lowerText.includes('budget') || lowerText.includes('cost') || lowerText.includes('price')) {
      conversationContext.current.intents.add('pricing_inquiry');
    }
    
    // Detect project type
    if (lowerText.includes('ecommerce') || lowerText.includes('online store')) {
      leadData.current.projectType = 'ecommerce';
    } else if (lowerText.includes('website') || lowerText.includes('web')) {
      leadData.current.projectType = 'website';
    } else if (lowerText.includes('app') || lowerText.includes('application')) {
      leadData.current.projectType = 'application';
    }
  };

  const generateProfessionalResponse = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    const context = conversationContext.current;
    
    // Professional contact capture responses
    if (context.intents.has('hire_intent') && !leadData.current.email) {
      return "Excellent! I'd love to discuss how Yuvaan can help with your project. To ensure he can provide you with detailed information and a proper consultation, could you share your email address? He typically responds within 4-6 hours with project insights.";
    }
    
    // Pricing and business development
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
      leadData.current.qualificationLevel = 'high';
      return "Great question about investment. Yuvaan's project rates vary based on scope and complexity, typically ranging from $2,000-$15,000 for complete solutions. He provides detailed proposals after understanding your specific needs. Would you like to schedule a consultation to discuss your project requirements?";
    }
    
    // Portfolio and expertise showcase
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('work') || lowerMessage.includes('projects')) {
      return `You're in the right place! Yuvaan has delivered impressive results including the Sarvodaya Dental Clinic digital transformation and several e-commerce platforms. His expertise spans ${portfolioData.specialties.join(', ')}. Which type of project interests you most?`;
    }
    
    // Professional background and credentials
    if (lowerMessage.includes('experience') || lowerMessage.includes('background') || lowerMessage.includes('skills')) {
      return `Yuvaan brings ${portfolioData.experience} specializing in modern web technologies. His approach combines technical excellence with user-centered design. Recent clients have seen 40%+ improvements in user engagement. What specific technical challenges are you facing?`;
    }
    
    // Contact and next steps
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email')) {
      if (!leadData.current.contactAttempted) {
        leadData.current.contactAttempted = true;
        return "Perfect! The best way to connect is through this website's contact form or email directly. Before I facilitate that connection, could you briefly describe your project so Yuvaan can prepare relevant insights for your conversation?";
      }
      return `You can reach Yuvaan at ${portfolioData.contact.email} or connect via LinkedIn. I'll also notify him about our conversation so he's prepared to discuss your specific needs.`;
    }
    
    // Qualification and discovery questions
    if (!leadData.current.projectType && (lowerMessage.includes('website') || lowerMessage.includes('app') || lowerMessage.includes('platform'))) {
      return "That sounds like an exciting project! Yuvaan excels at creating both stunning websites and powerful applications. To provide you with the most relevant insights - are you looking to build something new, redesign an existing platform, or enhance current functionality?";
    }
    
    // Default professional responses with business development focus
    const professionalResponses = [
      "That's an interesting challenge. Yuvaan has likely encountered similar situations and would have valuable insights. Would you like me to connect you directly with him to discuss your specific needs?",
      "Based on Yuvaan's portfolio, he's well-equipped to help with that. What's the timeline you're working with for this project?",
      "Excellent question! Yuvaan's approach to such challenges typically involves understanding the full business context first. Could you share a bit more about your goals?",
      "That aligns well with Yuvaan's expertise. Many of his clients have had similar needs. Would you be interested in seeing some relevant case studies or discussing your project directly?"
    ];
    
    return professionalResponses[Math.floor(Math.random() * professionalResponses.length)];
  };

  const analyzeBusinessConversation = () => {
    const intents = Array.from(conversationContext.current.intents);
    const topics = Array.from(conversationContext.current.topics);
    
    let leadQuality = 'low';
    if (leadData.current.email && intents.includes('hire_intent')) leadQuality = 'qualified';
    else if (intents.includes('hire_intent') || intents.includes('pricing_inquiry')) leadQuality = 'high';
    else if (intents.includes('business_inquiry')) leadQuality = 'medium';
    
    let businessValue = 'low';
    if (leadData.current.projectType && (intents.includes('pricing_inquiry') || intents.includes('hire_intent'))) {
      businessValue = 'high';
    } else if (leadData.current.projectType || intents.includes('business_inquiry')) {
      businessValue = 'medium';
    }
    
    return {
      leadQuality,
      businessValue,
      contactProvided: !!leadData.current.email,
      projectType: leadData.current.projectType,
      qualificationLevel: leadData.current.qualificationLevel,
      primaryIntent: intents[0] || 'general_inquiry',
      topics: topics,
      recommendedFollowUp: determineFollowUpAction()
    };
  };

  const determineFollowUpAction = () => {
    if (leadData.current.email) return 'direct_outreach';
    if (conversationContext.current.intents.has('hire_intent')) return 'aggressive_follow_up';
    if (conversationContext.current.intents.has('pricing_inquiry')) return 'proposal_ready';
    return 'nurture_lead';
  };

  const recordLeadData = (analysis) => {
    // This would integrate with your backend/CRM
    const leadRecord = {
      conversationId: conversationId.current,
      timestamp: Date.now(),
      email: leadData.current.email,
      name: leadData.current.name,
      projectType: leadData.current.projectType,
      qualificationLevel: leadData.current.qualificationLevel,
      businessValue: analysis.businessValue,
      conversationSummary: `${analysis.leadQuality} quality lead interested in ${analysis.projectType || 'web development'}`,
      nextAction: analysis.recommendedFollowUp,
      source: 'portfolio_chatbot',
      rawConversation: messages.map(m => `${m.sender}: ${m.text}`).join('\n')
    };
    
    // Send to your backend endpoint
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadRecord)
    }).catch(err => console.error('Lead recording failed:', err));
    
    console.log('Lead recorded:', leadRecord);
  };

  const recordUnknownQuestions = () => {
    const unknownQuestions = messages
      .filter(m => m.sender === 'user')
      .filter(m => !isKnownIntent(m.text))
      .map(m => m.text);
    
    if (unknownQuestions.length > 0) {
      fetch('/api/unknown-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: unknownQuestions,
          conversationId: conversationId.current,
          timestamp: Date.now()
        })
      }).catch(err => console.error('Unknown questions recording failed:', err));
    }
  };

  const isKnownIntent = (text) => {
    const knownPatterns = [
      /portfolio|work|projects/i,
      /price|cost|budget/i,
      /contact|email|reach/i,
      /experience|skills|background/i,
      /hire|project|work with/i
    ];
    return knownPatterns.some(pattern => pattern.test(text));
  };

  const resetSession = () => {
    conversationId.current = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStartTime.current = null;
    leadData.current = {
      email: null,
      name: null,
      company: null,
      projectType: null,
      budget: null,
      timeline: null,
      contactAttempted: false,
      qualificationLevel: 'unknown'
    };
    conversationContext.current = {
      topics: new Set(),
      intents: new Set(),
      sentiments: [],
      businessValue: 'unknown',
      nextActions: []
    };
  };

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        isAnimating,
        messages,
        isProcessing,
        openChatbot,
        closeChatbot,
        addMessage,
        setIsAnimating,
        leadData: leadData.current,
        conversationContext: conversationContext.current
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};