// Enhanced ChatbotContext.js with GPT-4o-mini (Fast & Efficient)
import React, { createContext, useContext, useState, useRef } from 'react';
import analyticsService from '../../services/analyticsService';
import { yuvaanKnowledge, systemPromptConfig } from '../../data/yuvaanKnowledge';

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
      text: "Hey there! I'm Saarth, Yuvaan's AI assistant. I help him connect with people who need great digital experiences. I can tell you about his work and approach, and if there's a good fit, I'll make sure you two get connected properly. What brings you here today?",
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
    qualificationLevel: 'unknown'
  });
  const conversationContext = useRef({
    topics: new Set(),
    intents: new Set(),
    sentiments: [],
    businessValue: 'unknown',
    nextActions: []
  });

  // Enhanced user message analysis
  const analyzeUserMessage = (text) => {
    const lowerText = text.toLowerCase();
    console.log('🔍 ANALYZE: Starting analysis of:', text);
    
    // Email detection
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emailMatches = text.match(emailRegex);
    
    if (emailMatches && emailMatches.length > 0) {
      const email = emailMatches[0];
      leadData.current.email = email;
      leadData.current.qualificationLevel = 'qualified';
      conversationContext.current.intents.add('email_provided');
      console.log('✅ EMAIL CAPTURED:', email);
      
      // Record lead when email is captured
      setTimeout(() => {
        recordLeadData({
          leadQuality: 'qualified',
          businessValue: 'high',
          contactProvided: true,
          primaryIntent: 'email_provided',
          recommendedFollowUp: 'immediate_outreach'
        });
      }, 500);
    }
    
    // Business intent detection
    if (lowerText.includes('hire') || lowerText.includes('project') || lowerText.includes('work with')) {
      conversationContext.current.intents.add('hire_intent');
      if (!leadData.current.email) {
        leadData.current.qualificationLevel = 'high';
      }
      console.log('🎯 HIRE INTENT detected');
    }
    
    if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('budget')) {
      conversationContext.current.intents.add('pricing_inquiry');
      if (leadData.current.qualificationLevel === 'unknown') {
        leadData.current.qualificationLevel = 'medium';
      }
      console.log('💰 PRICING INQUIRY detected');
    }
    
    // Project type detection
    if (lowerText.includes('ecommerce') || lowerText.includes('online store')) {
      leadData.current.projectType = 'ecommerce';
    } else if (lowerText.includes('website') || lowerText.includes('web')) {
      leadData.current.projectType = 'website';
    } else if (lowerText.includes('app') || lowerText.includes('application')) {
      leadData.current.projectType = 'application';
    }
    
    // Name detection
    const namePatterns = [
      /my name is ([a-zA-Z\s]+)/i,
      /i'm ([a-zA-Z\s]+)/i,
      /i am ([a-zA-Z\s]+)/i
    ];
    
    for (let pattern of namePatterns) {
      const nameMatch = text.match(pattern);
      if (nameMatch && nameMatch[1]) {
        leadData.current.name = nameMatch[1].trim();
        console.log('👤 NAME DETECTED:', nameMatch[1].trim());
        break;
      }
    }
  };

  // GPT-4o-mini API integration (Optimized for Speed)
  const generateGPT4oMiniResponse = async (userMessage, conversationHistory) => {
    try {
      // Build system prompt with Yuvaan's knowledge and current context
      const systemPrompt = `${systemPromptConfig.identity}

${systemPromptConfig.tone}

${systemPromptConfig.approach}

YUVAAN'S BACKGROUND:
${yuvaanKnowledge.personal.background}

YUVAAN'S APPROACH:
${yuvaanKnowledge.personal.approach}

YUVAAN'S EXPERIENCE:
${yuvaanKnowledge.experience.detailed}

RECENT PROJECTS:
${yuvaanKnowledge.experience.projects}

PRICING APPROACH:
${yuvaanKnowledge.conversationStyle.pricing}

CURRENT CONVERSATION CONTEXT:
- Lead qualification level: ${leadData.current.qualificationLevel}
- Email captured: ${leadData.current.email ? 'Yes' : 'No'}
- Project type: ${leadData.current.projectType || 'Unknown'}
- Detected intents: ${Array.from(conversationContext.current.intents).join(', ') || 'None'}

CRITICAL RULES:
1. You are Saarth, Yuvaan's AI assistant - always make this clear
2. Speak about Yuvaan in third person ("Yuvaan does this..." not "I do this...")
3. When capturing emails, say "I'll make sure Yuvaan gets this and reaches out"
4. Focus on understanding needs and facilitating connection with Yuvaan
5. Be consultative, curious, and value-driven
6. If someone shows hiring intent, try to capture their email
7. Keep responses under 100 words unless explaining something complex
8. Use a friendly, approachable tone that reflects Yuvaan's personality

SPECIAL INSTRUCTIONS:
- If they ask about pricing, mention projects start around ₹35,000 but emphasize connecting with Yuvaan for specifics
- If they want to hire or discuss projects, capture email to facilitate Yuvaan's outreach
- If they ask about portfolio, mention Sarvodaya Dental Clinic and mental wellness projects
- Always position as facilitating connection with Yuvaan, not replacing him`;

      // Build conversation history for context (limit to last 8 messages for speed)
      const recentMessages = conversationHistory.slice(-8);
      const conversationMessages = [
        { role: 'system', content: systemPrompt },
        ...recentMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: userMessage }
      ];

      // Call API with GPT-4o-mini optimized settings
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationMessages,
          max_tokens: 300,  // Optimized for speed - shorter responses
          temperature: 0.7, // GPT-4o-mini supports standard parameters
          model: 'gpt-4o-mini' // Explicitly specify the model
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;

    } catch (error) {
      console.error('GPT-4o-mini API error:', error);
      
      // Fallback response if API fails
      return `I'm having a bit of trouble processing that right now. But I'd love to make sure Yuvaan can help you properly! What's your email? I'll have him reach out directly to discuss your needs.`;
    }
  };

  // Lead recording function (unchanged)
  const recordLeadData = (analysis) => {
    const leadRecord = {
      conversationId: conversationId.current,
      timestamp: Date.now(),
      email: leadData.current.email,
      name: leadData.current.name,
      projectType: leadData.current.projectType,
      qualificationLevel: leadData.current.qualificationLevel,
      businessValue: analysis.businessValue,
      conversationSummary: `${analysis.leadQuality} quality lead${leadData.current.email ? ` with email ${leadData.current.email}` : ''}${leadData.current.projectType ? ` interested in ${leadData.current.projectType}` : ''}`,
      nextAction: analysis.recommendedFollowUp,
      source: 'portfolio_chatbot',
      intents: Array.from(conversationContext.current.intents),
      rawConversation: messages.map(m => `${m.sender}: ${m.text}`).join('\n')
    };
    
    console.log('📧 RECORDING LEAD DATA:', leadRecord);
    
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    fetch(`${apiUrl}/api/leads`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(leadRecord)
    })
    .then(response => {
      console.log('📡 API RESPONSE STATUS:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('✅ LEAD RECORDED SUCCESSFULLY:', data);
    })
    .catch(err => {
      console.error('❌ LEAD RECORDING FAILED:', err);
    });
  };

  const openChatbot = () => {
    setIsOpen(true);
    setIsAnimating(true);
    sessionStartTime.current = Date.now();
    
    console.log('🚀 CHATBOT OPENED - Session started');
    
    try {
      analyticsService.trackChatbotInteraction('session_start', messages.length, 'professional_inquiry', {
        conversationId: conversationId.current,
        sessionStartTime: sessionStartTime.current,
        currentPage: window.location.pathname,
        referrer: document.referrer,
        timestamp: Date.now()
      });
    } catch (error) {
      console.warn('Analytics tracking error:', error);
    }
  };

  const closeChatbot = () => {
    console.log('📚 CHATBOT CLOSING');
    
    const sessionAnalysis = analyzeBusinessConversation();
    
    if (leadData.current.email || sessionAnalysis.leadQuality === 'high') {
      console.log('📧 Recording final lead data on close');
      recordLeadData(sessionAnalysis);
    }

    try {
      analyticsService.trackChatbotInteraction('session_end', messages.length, 'professional_conclusion', {
        ...sessionAnalysis,
        conversationId: conversationId.current,
        duration: Date.now() - (sessionStartTime.current || Date.now())
      });
    } catch (error) {
      console.warn('Analytics tracking error:', error);
    }
    
    setIsAnimating(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimating(false);
      resetSession();
    }, 800);
  };

  const addMessage = async (text, sender = 'user') => {
    console.log(`💬 NEW MESSAGE - ${sender}:`, text);
    
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);

    if (sender === 'user') {
      // Analyze user message for lead qualification
      analyzeUserMessage(text);
      
      // Generate GPT-4o-mini response (fast!)
      setIsProcessing(true);
      try {
        // Get conversation history (last 8 messages for optimal speed/context balance)
        const recentMessages = messages.slice(-8);
        const response = await generateGPT4oMiniResponse(text, recentMessages);
        
        console.log('🤖 GPT-4o-mini RESPONSE:', response);
        
        // Reduced delay for faster perceived speed
        setTimeout(() => {
          addMessage(response, 'bot');
          setIsProcessing(false);
        }, 400); // Faster than before - GPT-4o-mini is quick!
        
      } catch (error) {
        console.error('Response generation failed:', error);
        setIsProcessing(false);
        addMessage("I'm having a bit of trouble right now, but I'd love to make sure Yuvaan can help you! What's your email? I'll have him reach out directly.", 'bot');
      }
    }
  };

  const analyzeBusinessConversation = () => {
    const intents = Array.from(conversationContext.current.intents);
    
    let leadQuality = 'low';
    if (leadData.current.email && intents.includes('hire_intent')) leadQuality = 'qualified';
    else if (leadData.current.email) leadQuality = 'high';
    else if (intents.includes('hire_intent') || intents.includes('pricing_inquiry')) leadQuality = 'high';
    else if (intents.includes('business_inquiry')) leadQuality = 'medium';
    
    let businessValue = 'low';
    if (leadData.current.email && (intents.includes('pricing_inquiry') || intents.includes('hire_intent'))) {
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
      intents: intents,
      recommendedFollowUp: leadData.current.email ? 'immediate_outreach' : 'nurture_lead'
    };
  };

  const resetSession = () => {
    console.log('🔄 RESETTING SESSION');
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