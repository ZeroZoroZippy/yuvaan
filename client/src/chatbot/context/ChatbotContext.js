// Enhanced ChatbotContext.js with GPT-4o-mini (Fast & Efficient) + Complete Conversation Tracking
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
  
  // Enhanced lead data tracking
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

  // NEW: Complete conversation tracking
  const conversationTracking = useRef({
    fullConversation: [],
    userQuestions: [],
    unknownTopics: [],
    messageAnalytics: [],
    sessionMetrics: {
      startTime: null,
      messageCount: 0,
      userMessageCount: 0,
      botMessageCount: 0,
      averageResponseTime: 0,
      engagementLevel: 'low'
    }
  });

  // Enhanced message analysis with complete tracking
  const analyzeUserMessage = (text, messageId) => {
    const lowerText = text.toLowerCase();
    console.log('🔍 ANALYZE: Starting analysis of:', text);
    
    // Create detailed message analysis
    const messageAnalysis = {
      id: messageId,
      text: text,
      timestamp: new Date(),
      sender: 'user',
      metadata: {
        messageType: detectMessageType(text),
        intent: detectIntent(text),
        containsContact: containsContactInfo(text),
        sentiment: detectSentiment(text),
        topics: extractTopics(text),
        isQuestion: text.includes('?'),
        wordCount: text.split(' ').filter(word => word.length > 0).length,
        hasEmail: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(text),
        hasPhone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text)
      }
    };

    // Add to conversation tracking
    conversationTracking.current.fullConversation.push(messageAnalysis);
    conversationTracking.current.messageAnalytics.push(messageAnalysis);
    conversationTracking.current.sessionMetrics.userMessageCount++;
    conversationTracking.current.sessionMetrics.messageCount++;

    // Track questions
    if (messageAnalysis.metadata.isQuestion) {
      conversationTracking.current.userQuestions.push({
        question: text,
        timestamp: new Date(),
        messageId: messageId,
        context: conversationTracking.current.fullConversation.slice(-3).map(msg => ({
          sender: msg.sender,
          text: msg.text,
          timestamp: msg.timestamp
        }))
      });
    }
    
    // Email detection
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emailMatches = text.match(emailRegex);
    
    if (emailMatches && emailMatches.length > 0) {
      const email = emailMatches[0];
      leadData.current.email = email;
      leadData.current.qualificationLevel = 'qualified';
      conversationContext.current.intents.add('email_provided');
      
      // Add lead indicator to tracking
      conversationTracking.current.messageAnalytics[conversationTracking.current.messageAnalytics.length - 1].leadIndicator = {
        type: 'email_provided',
        value: email,
        strength: 'high'
      };
      
      console.log('✅ EMAIL CAPTURED:', email);
      
      // Record lead when email is captured
      setTimeout(() => {
        recordCompleteLeadData({
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

    return messageAnalysis;
  };

  // Enhanced bot message tracking
  const trackBotMessage = (text, messageId, responseTime = null) => {
    const botMessageAnalysis = {
      id: messageId,
      text: text,
      timestamp: new Date(),
      sender: 'bot',
      metadata: {
        responseTime: responseTime,
        containsQuestion: text.includes('?'),
        containsContactRequest: text.toLowerCase().includes('email') || text.toLowerCase().includes('contact'),
        helpfulnessScore: calculateHelpfulnessScore(text),
        topics: extractTopics(text)
      }
    };

    conversationTracking.current.fullConversation.push(botMessageAnalysis);
    conversationTracking.current.sessionMetrics.botMessageCount++;
    conversationTracking.current.sessionMetrics.messageCount++;

    return botMessageAnalysis;
  };

  // Message analysis helper functions
  const detectMessageType = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('?')) return 'question';
    if (lowerText.match(/\b(hello|hi|hey)\b/)) return 'greeting';
    if (lowerText.match(/\b(email|contact|phone|call)\b/)) return 'contact_inquiry';
    if (lowerText.match(/\b(price|cost|quote|budget)\b/)) return 'pricing_inquiry';
    if (lowerText.match(/\b(hire|work|project|service)\b/)) return 'service_inquiry';
    if (lowerText.match(/\b(portfolio|examples|work)\b/)) return 'portfolio_request';
    if (lowerText.match(/\b(thank|thanks)\b/)) return 'gratitude';
    return 'general';
  };

  const detectIntent = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.match(/\b(hire|want to work|need)\b/)) return 'hire_intent';
    if (lowerText.match(/\b(how much|price|cost)\b/)) return 'pricing_request';
    if (lowerText.match(/\b(contact|email|call|reach)\b/)) return 'contact_request';
    if (lowerText.match(/\b(portfolio|examples|see work)\b/)) return 'portfolio_request';
    if (lowerText.match(/\b(help|support|question)\b/)) return 'support_request';
    return 'information_seeking';
  };

  const containsContactInfo = (text) => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
    return emailRegex.test(text) || phoneRegex.test(text);
  };

  const detectSentiment = (text) => {
    const positiveWords = ['good', 'great', 'excellent', 'love', 'like', 'awesome', 'perfect', 'amazing'];
    const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'frustrated', 'disappointed', 'horrible'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const extractTopics = (text) => {
    const lowerText = text.toLowerCase();
    const topics = [];
    
    if (lowerText.match(/\b(website|web|site)\b/)) topics.push('web_development');
    if (lowerText.match(/\b(design|ui|ux)\b/)) topics.push('design');
    if (lowerText.match(/\b(react|javascript|frontend)\b/)) topics.push('frontend');
    if (lowerText.match(/\b(mobile|app|ios|android)\b/)) topics.push('mobile');
    if (lowerText.match(/\b(backend|server|database)\b/)) topics.push('backend');
    if (lowerText.match(/\b(ecommerce|store|shop)\b/)) topics.push('ecommerce');
    if (lowerText.match(/\b(price|cost|budget)\b/)) topics.push('pricing');
    if (lowerText.match(/\b(portfolio|work|examples)\b/)) topics.push('portfolio');
    if (lowerText.match(/\b(timeline|deadline|when)\b/)) topics.push('timeline');
    
    return topics.length > 0 ? topics : ['general'];
  };

  const calculateHelpfulnessScore = (text) => {
    let score = 50; // Base score
    
    if (text.includes('?')) score += 10; // Asks clarifying questions
    if (text.toLowerCase().includes('yuvaan')) score += 15; // Mentions Yuvaan
    if (text.toLowerCase().includes('email')) score += 10; // Tries to capture contact
    if (text.length > 50) score += 5; // Detailed response
    if (text.length < 20) score -= 10; // Too brief
    
    return Math.min(100, Math.max(0, score));
  };

  // Check if topic is unknown/needs attention
  const checkForUnknownTopics = (userMessage, botResponse) => {
    const lowerBot = botResponse.toLowerCase();
    const lowerUser = userMessage.toLowerCase();
    
    // Check if bot response indicates uncertainty
    const uncertaintyIndicators = [
      'not sure',
      'don\'t know',
      'let me check',
      'i\'ll have yuvaan',
      'ask yuvaan',
      'unclear',
      'uncertain'
    ];
    
    const isUncertain = uncertaintyIndicators.some(indicator => lowerBot.includes(indicator));
    
    // Check for specific technical questions that might be unknown
    const technicalQuestions = [
      'specific framework',
      'particular technology',
      'certain platform',
      'database type',
      'hosting solution'
    ];
    
    const isTechnicalUnknown = technicalQuestions.some(tech => lowerUser.includes(tech.split(' ')[0]));
    
    if (isUncertain || isTechnicalUnknown) {
      const unknownTopic = {
        userQuestion: userMessage,
        botResponse: botResponse,
        timestamp: new Date(),
        topic: extractTopics(userMessage)[0] || 'general',
        context: conversationTracking.current.fullConversation.slice(-2)
      };
      
      conversationTracking.current.unknownTopics.push(unknownTopic);
      console.log('❓ UNKNOWN TOPIC DETECTED:', unknownTopic);
    }
  };

  // GPT-4o-mini API integration (Optimized for Speed)
  const generateGPT4oMiniResponse = async (userMessage, conversationHistory) => {
    const responseStartTime = Date.now();
    
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
- Questions asked: ${conversationTracking.current.userQuestions.length}
- Conversation length: ${conversationTracking.current.sessionMetrics.messageCount} messages

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
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5001/api/chat'
        : '/api/chat';  // Uses Vercel Function in production

      const response = await fetch(apiUrl, {
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
      const responseTime = Date.now() - responseStartTime;
      
      // Check for unknown topics
      checkForUnknownTopics(userMessage, data.response);
      
      return {
        response: data.response,
        responseTime: responseTime
      };

    } catch (error) {
      console.error('GPT-4o-mini API error:', error);
      
      // Fallback response if API fails
      return {
        response: `I'm having a bit of trouble processing that right now. But I'd love to make sure Yuvaan can help you properly! What's your email? I'll have him reach out directly to discuss your needs.`,
        responseTime: Date.now() - responseStartTime
      };
    }
  };

  // Enhanced lead recording with complete conversation data
  const recordCompleteLeadData = (analysis) => {
    const sessionDuration = Date.now() - (sessionStartTime.current || Date.now());
    
    // Calculate engagement metrics
    const avgMessageLength = conversationTracking.current.messageAnalytics
      .filter(msg => msg.sender === 'user')
      .reduce((sum, msg) => sum + (msg.metadata.wordCount || 0), 0) / 
      (conversationTracking.current.sessionMetrics.userMessageCount || 1);

    const engagementLevel = calculateEngagementLevel(
      conversationTracking.current.sessionMetrics.messageCount,
      sessionDuration,
      conversationTracking.current.userQuestions.length,
      avgMessageLength
    );

    // Generate conversation summary
    const conversationSummary = generateConversationSummary();

    const completeLeadRecord = {
      // Original lead data
      conversationId: conversationId.current,
      timestamp: Date.now(),
      email: leadData.current.email,
      name: leadData.current.name,
      projectType: leadData.current.projectType,
      qualificationLevel: leadData.current.qualificationLevel,
      businessValue: analysis.businessValue,
      nextAction: analysis.recommendedFollowUp,
      source: 'portfolio_chatbot',
      intents: Array.from(conversationContext.current.intents),
      
      // Enhanced conversation data
      fullConversation: conversationTracking.current.fullConversation.map(msg => ({
        speaker: msg.sender === 'user' ? 'User' : 'Saarth (AI)',
        message: msg.text,
        timestamp: msg.timestamp.toLocaleString(),
        metadata: msg.metadata
      })),
      
      // Session metrics
      sessionData: {
        startTime: new Date(sessionStartTime.current),
        endTime: new Date(),
        duration: sessionDuration,
        totalMessages: conversationTracking.current.sessionMetrics.messageCount,
        userMessages: conversationTracking.current.sessionMetrics.userMessageCount,
        botMessages: conversationTracking.current.sessionMetrics.botMessageCount
      },
      
      // User questions with context
      userQuestions: conversationTracking.current.userQuestions,
      
      // Lead indicators
      leadIndicators: conversationTracking.current.messageAnalytics
        .filter(msg => msg.leadIndicator)
        .map(msg => msg.leadIndicator),
      
      // Analytics
      engagementLevel: engagementLevel,
      dominantTopics: getDominantTopics(),
      sentimentProgression: getSentimentProgression(),
      conversionPotential: analysis.businessValue,
      recommendedAction: analysis.recommendedFollowUp,
      
      // Conversation summary
      conversationSummary: conversationSummary
    };
    
    console.log('📧 RECORDING COMPLETE LEAD DATA:', completeLeadRecord);
    
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    fetch(`${apiUrl}/api/leads`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(completeLeadRecord)
    })
    .then(response => {
      console.log('📡 API RESPONSE STATUS:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('✅ COMPLETE LEAD RECORDED SUCCESSFULLY:', data);
    })
    .catch(err => {
      console.error('❌ LEAD RECORDING FAILED:', err);
    });
  };

  // Send unknown topics for analysis
  const recordUnknownTopics = () => {
    if (conversationTracking.current.unknownTopics.length === 0) return;

    const unknownTopicsData = {
      conversationId: conversationId.current,
      timestamp: Date.now(),
      
      // Complete conversation context
      fullConversation: conversationTracking.current.fullConversation.map(msg => ({
        speaker: msg.sender === 'user' ? 'User' : 'Saarth (AI)',
        message: msg.text,
        timestamp: msg.timestamp.toLocaleString(),
        metadata: msg.metadata
      })),
      
      // Unknown topics with context
      unknownTopics: conversationTracking.current.unknownTopics,
      
      // All user questions for context
      userQuestions: conversationTracking.current.userQuestions,
      
      // Session data
      sessionData: {
        duration: Date.now() - (sessionStartTime.current || Date.now()),
        totalMessages: conversationTracking.current.sessionMetrics.messageCount
      }
    };

    console.log('❓ RECORDING UNKNOWN TOPICS:', unknownTopicsData);

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    fetch(`${apiUrl}/api/unknown-questions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      credentials: 'include',
      mode: 'cors',
      body: JSON.stringify(unknownTopicsData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('✅ UNKNOWN TOPICS RECORDED:', data);
    })
    .catch(err => {
      console.error('❌ UNKNOWN TOPICS RECORDING FAILED:', err);
    });
  };

  // Helper functions for analytics
  const calculateEngagementLevel = (messageCount, duration, questionCount, avgMessageLength) => {
    let score = 0;
    
    if (messageCount >= 8) score += 25;
    else if (messageCount >= 4) score += 15;
    else if (messageCount >= 2) score += 5;
    
    if (duration > 300000) score += 25; // 5+ minutes
    else if (duration > 120000) score += 15; // 2+ minutes
    else if (duration > 60000) score += 5; // 1+ minute
    
    if (questionCount >= 3) score += 25;
    else if (questionCount >= 1) score += 10;
    
    if (avgMessageLength > 15) score += 15;
    else if (avgMessageLength > 8) score += 5;
    
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const getDominantTopics = () => {
    const topicCounts = {};
    conversationTracking.current.messageAnalytics.forEach(msg => {
      if (msg.metadata.topics) {
        msg.metadata.topics.forEach(topic => {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });
      }
    });
    
    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, mentions: count }));
  };

  const getSentimentProgression = () => {
    return conversationTracking.current.messageAnalytics
      .filter(msg => msg.sender === 'user')
      .map((msg, index) => ({
        messageNumber: index + 1,
        sentiment: msg.metadata.sentiment,
        timestamp: msg.timestamp
      }));
  };

  const generateConversationSummary = () => {
    const duration = Math.round((Date.now() - (sessionStartTime.current || Date.now())) / 60000);
    const topics = getDominantTopics();
    const questions = conversationTracking.current.userQuestions;
    
    return `
Conversation lasted ${duration} minutes with ${conversationTracking.current.sessionMetrics.messageCount} total messages.

Key Topics: ${topics.map(t => t.topic).join(', ') || 'General conversation'}

User Engagement: ${calculateEngagementLevel(
  conversationTracking.current.sessionMetrics.messageCount,
  Date.now() - (sessionStartTime.current || Date.now()),
  questions.length,
  10
)}

${questions.length > 0 ? 
  `Questions Asked:\n${questions.map((q, i) => `${i+1}. ${q.question}`).join('\n')}` :
  'No specific questions asked.'
}

Lead Quality: ${leadData.current.qualificationLevel}
Contact Provided: ${leadData.current.email ? 'Yes' : 'No'}
    `.trim();
  };

  const openChatbot = () => {
    setIsOpen(true);
    setIsAnimating(true);
    sessionStartTime.current = Date.now();
    
    // Initialize conversation tracking
    conversationTracking.current = {
      fullConversation: [],
      userQuestions: [],
      unknownTopics: [],
      messageAnalytics: [],
      sessionMetrics: {
        startTime: Date.now(),
        messageCount: 1, // Starting message
        userMessageCount: 0,
        botMessageCount: 1, // Starting message
        averageResponseTime: 0,
        engagementLevel: 'low'
      }
    };
    
    console.log('🚀 CHATBOT OPENED - Session started with conversation tracking');
    
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
    console.log('📚 CHATBOT CLOSING - Recording complete conversation');
    
    const sessionAnalysis = analyzeBusinessConversation();
    
    // Record lead data if qualified
    if (leadData.current.email || sessionAnalysis.leadQuality === 'high') {
      console.log('📧 Recording final complete lead data on close');
      recordCompleteLeadData(sessionAnalysis);
    }

    // Record unknown topics if any
    recordUnknownTopics();

    try {
      analyticsService.trackChatbotInteraction('session_end', messages.length, 'professional_conclusion', {
        ...sessionAnalysis,
        conversationId: conversationId.current,
        duration: Date.now() - (sessionStartTime.current || Date.now()),
        totalMessages: conversationTracking.current.sessionMetrics.messageCount,
        unknownTopics: conversationTracking.current.unknownTopics.length,
        userQuestions: conversationTracking.current.userQuestions.length
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
    
    const messageId = Date.now();
    const newMessage = {
      id: messageId,
      text,
      sender,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);

    if (sender === 'user') {
      // Analyze user message with complete tracking
      analyzeUserMessage(text, messageId);
      
      // Generate GPT-4o-mini response (fast!)
      setIsProcessing(true);
      try {
        // Get conversation history (last 8 messages for optimal speed/context balance)
        const recentMessages = messages.slice(-8);
        const responseData = await generateGPT4oMiniResponse(text, recentMessages);
        
        console.log('🤖 GPT-4o-mini RESPONSE:', responseData.response);
        
        // Reduced delay for faster perceived speed
        setTimeout(() => {
          const botMessageId = Date.now() + 1;
          
          // Track bot message with response time
          trackBotMessage(responseData.response, botMessageId, responseData.responseTime);
          
          addMessage(responseData.response, 'bot');
          setIsProcessing(false);
        }, 400); // Faster than before - GPT-4o-mini is quick!
        
      } catch (error) {
        console.error('Response generation failed:', error);
        setIsProcessing(false);
        
        const fallbackMessage = "I'm having a bit of trouble right now, but I'd love to make sure Yuvaan can help you! What's your email? I'll have him reach out directly.";
        trackBotMessage(fallbackMessage, Date.now() + 1, null);
        addMessage(fallbackMessage, 'bot');
      }
    } else if (sender === 'bot') {
      // Track bot message if not already tracked
      if (!conversationTracking.current.fullConversation.find(msg => msg.id === messageId)) {
        trackBotMessage(text, messageId);
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
    console.log('🔄 RESETTING SESSION AND CONVERSATION TRACKING');
    
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

    // Reset conversation tracking
    conversationTracking.current = {
      fullConversation: [],
      userQuestions: [],
      unknownTopics: [],
      messageAnalytics: [],
      sessionMetrics: {
        startTime: null,
        messageCount: 0,
        userMessageCount: 0,
        botMessageCount: 0,
        averageResponseTime: 0,
        engagementLevel: 'low'
      }
    };

    // Reset messages to initial state
    setMessages([
      {
        id: 1,
        text: "Hey there! I'm Saarth, Yuvaan's AI assistant. I help him connect with people who need great digital experiences. I can tell you about his work and approach, and if there's a good fit, I'll make sure you two get connected properly. What brings you here today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
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
        conversationContext: conversationContext.current,
        
        // NEW: Expose conversation tracking data for debugging/monitoring
        conversationTracking: conversationTracking.current,
        
        // NEW: Utility functions for external use
        getCurrentConversationSummary: generateConversationSummary,
        getEngagementMetrics: () => ({
          messageCount: conversationTracking.current.sessionMetrics.messageCount,
          duration: Date.now() - (sessionStartTime.current || Date.now()),
          questions: conversationTracking.current.userQuestions.length,
          unknownTopics: conversationTracking.current.unknownTopics.length,
          engagementLevel: calculateEngagementLevel(
            conversationTracking.current.sessionMetrics.messageCount,
            Date.now() - (sessionStartTime.current || Date.now()),
            conversationTracking.current.userQuestions.length,
            10
          )
        })
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};