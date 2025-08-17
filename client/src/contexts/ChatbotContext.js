import React, { createContext, useContext, useState, useRef } from 'react';
import analyticsService from '../services/analyticsService';
import { yuvaanKnowledge, systemPromptConfig } from '../data/yuvaanKnowledge';

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
    qualificationLevel: 'unknown' // low, medium, high, qualified
  });
  const conversationContext = useRef({
    topics: new Set(),
    intents: new Set(),
    sentiments: [],
    businessValue: 'unknown', // high, medium, low
    nextActions: []
  });

  // Professional portfolio data - Yuvaan's actual information
  const portfolioData = {
    name: "Yuvaan Vithlani",
    title: "Product Professional & Full-Stack Developer", 
    specialties: ["Product Management", "Full-Stack Development", "UI/UX Design", "Healthcare Websites"],
    recentProjects: [
      "Sarvodaya Dental Clinic - Complete digital transformation with online booking",
      "Mental Wellness Practice - Approachable therapy website that reduces barriers",
      "Local SEO Product - Led beta launch at Cube with market research insights"
    ],
    experience: "Product management and development experience across startups and established companies",
    contact: {
      email: "yuvaanvithlani11@gmail.com",
      linkedin: "linkedin.com/in/yuvaanvithlani",
      portfolio: "yuvaan-portfolio.com"
    },
    pricing: {
      starting: "₹35,000",
      approach: "Investment varies based on project scope and business goals"
    }
  };

  // Debug function for email detection
  const debugEmailDetection = (text) => {
    console.log('🔍 DEBUG: Analyzing message for email:', text);
    
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emailMatches = text.match(emailRegex);
    
    console.log('📧 DEBUG: Email regex result:', emailMatches);
    
    if (emailMatches && emailMatches.length > 0) {
      console.log('✅ DEBUG: Email detected:', emailMatches[0]);
      return emailMatches[0];
    } else {
      console.log('❌ DEBUG: No email detected');
      return null;
    }
  };

  // Enhanced user message analysis with debugging
  const analyzeUserMessage = (text) => {
    const lowerText = text.toLowerCase();
    console.log('🔍 ANALYZE: Starting analysis of:', text);
    
    // Email detection with debugging
    const detectedEmail = debugEmailDetection(text);
    if (detectedEmail) {
      leadData.current.email = detectedEmail;
      leadData.current.qualificationLevel = 'qualified';
      conversationContext.current.intents.add('email_provided');
      console.log('✅ EMAIL CAPTURED:', detectedEmail);
      console.log('🎯 QUALIFICATION UPDATED TO: qualified');
      
      // Immediately record the lead when email is captured
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
    
    // Business context detection
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
    
    if (lowerText.includes('company') || lowerText.includes('business')) {
      conversationContext.current.intents.add('business_inquiry');
      if (leadData.current.qualificationLevel === 'unknown') {
        leadData.current.qualificationLevel = 'medium';
      }
      console.log('🏢 BUSINESS INQUIRY detected');
    }
    
    // Project type detection
    if (lowerText.includes('ecommerce') || lowerText.includes('online store')) {
      leadData.current.projectType = 'ecommerce';
      console.log('🛒 PROJECT TYPE: ecommerce');
    } else if (lowerText.includes('website') || lowerText.includes('web')) {
      leadData.current.projectType = 'website';
      console.log('🌐 PROJECT TYPE: website');
    } else if (lowerText.includes('app') || lowerText.includes('application')) {
      leadData.current.projectType = 'application';
      console.log('📱 PROJECT TYPE: application');
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
    
    console.log('📊 CURRENT LEAD DATA:', {
      email: leadData.current.email,
      name: leadData.current.name,
      qualificationLevel: leadData.current.qualificationLevel,
      projectType: leadData.current.projectType
    });
  };

  // Lead recording function with debugging
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
    
    // Send to your backend API
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
      console.error('🔧 Check if server is running on port 8000');
      console.error('🔧 Check server/.env file for notification credentials');
    });
  };

  // Record unknown questions
  const recordUnknownQuestion = (question) => {
    console.log('❓ RECORDING UNKNOWN QUESTION:', question);
    
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    fetch(`${apiUrl}/api/unknown-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questions: [question],
        conversationId: conversationId.current,
        timestamp: Date.now()
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('✅ UNKNOWN QUESTION RECORDED:', data);
    })
    .catch(err => {
      console.error('❌ UNKNOWN QUESTION RECORDING FAILED:', err);
    });
  };

  // Professional response generation - Yuvaan speaking as himself
  const generateProfessionalResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    const context = conversationContext.current;
    const intents = Array.from(context.intents);
    
    console.log('🤖 GENERATING RESPONSE for:', userMessage);
    console.log('🎯 Current intents:', intents);
    console.log('📊 Lead qualification:', leadData.current.qualificationLevel);

    // Email acknowledgment with clear AI identity and handoff
    if (leadData.current.email && intents.includes('email_provided')) {
      const responses = [
        `Perfect! I've captured ${leadData.current.email} and I'll make sure Yuvaan gets this conversation along with your details. He typically reaches out within 24-48 hours with specific thoughts about your project. While we're chatting though, what's the main challenge you're hoping to solve?`,
        `Great! I've noted ${leadData.current.email} and will pass everything along to Yuvaan. He'll reach out directly within the next day or two with relevant examples and ideas. I'm curious though - what's been the biggest frustration with your current digital presence?`,
        `Excellent! I'll make sure Yuvaan sees ${leadData.current.email} and our entire conversation. He'll follow up personally with some tailored recommendations. In the meantime, help me understand - what does success look like for this project?`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Consultative lead capture with clear AI role
    if (intents.includes('hire_intent') && !leadData.current.email) {
      return `I'd love to connect you with Yuvaan to discuss this! He's really good at understanding unique project needs and finding the right solutions. What's your email? I'll make sure he gets our conversation and reaches out directly to dive deeper into your goals.`;
    }

    // Strategic pricing conversations with handoff
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
      if (!leadData.current.email) {
        return `Great question! Yuvaan's projects typically start around ${portfolioData.pricing.starting} for complete websites, but it really depends on what you're building together. He's much better at explaining the investment once he understands your specific goals. What's your email? I'll make sure he reaches out with relevant examples and can discuss pricing properly.`;
      } else {
        return `Since I have your email, Yuvaan will include detailed investment information when he reaches out. Generally, projects start around ${portfolioData.pricing.starting}, but he always focuses on what kind of results you're looking for first. Are you trying to increase bookings, build trust with customers, or solve a specific problem?`;
      }
    }

    // Portfolio showcase with clear attribution
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('work') || lowerMessage.includes('projects')) {
      return `I'd love to show you some of Yuvaan's work! He's been focusing on healthcare and wellness websites lately - like transforming Sarvodaya Dental Clinic's patient experience and creating a welcoming mental wellness practice site. He's also worked on AI product launches and community platforms. What type of business are you in? I can point out the most relevant examples, and Yuvaan can share more details when you connect.`;
    }

    // Experience with clear attribution
    if (lowerMessage.includes('experience') || lowerMessage.includes('background') || lowerMessage.includes('skills')) {
      return `Yuvaan's path has been really interesting! He started in mechanical engineering, then moved into product management at companies like Cube and TimelyAI, where he learned to think strategically about user needs. Now he combines that product thinking with full-stack development. What I find impressive is how he sees both big-picture business goals and technical details. What's your background - what got you thinking about improving your digital presence?`;
    }

    // Natural contact facilitation
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email')) {
      if (!leadData.current.contactAttempted) {
        leadData.current.contactAttempted = true;
        return `The best way is definitely email - I can make sure Yuvaan gets our conversation and your details. He usually responds within a day or two with relevant examples and questions about your specific needs. What's your email address?`;
      }
      return `You can reach Yuvaan directly at ${portfolioData.contact.email} or connect on LinkedIn. I'll also make sure he sees our conversation here so he can reference what we've discussed. What's the best way to describe what you're hoping to accomplish?`;
    }

    // Project exploration with clear positioning
    if (!leadData.current.projectType && (lowerMessage.includes('website') || lowerMessage.includes('app') || lowerMessage.includes('platform'))) {
      return `That sounds like it could be really impactful! Yuvaan loves working on projects where good design genuinely helps businesses grow. What industry are you in? He's been getting great results with healthcare and wellness businesses lately, but I'd love to understand your specific situation so I can give him better context when you connect.`;
    }

    // Warm greetings with clear AI positioning
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hey! Really glad you're here. I help Yuvaan connect with people who need great digital experiences - not just websites that look good, but ones that solve real problems and drive results. What's bringing you to think about your website or digital presence today?`;
    }

    // Gracious acknowledgments with curiosity
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return `Of course! I'm genuinely excited to learn more about what you're working on. What's been the biggest challenge with your current digital setup, or what opportunity are you most excited about?`;
    }

    // Problem-solving discovery questions
    if (lowerMessage.includes('problem') || lowerMessage.includes('challenge') || lowerMessage.includes('issue')) {
      return `I'd love to understand more about what you're dealing with. Often the best solutions come from really understanding the underlying challenge, not just the symptoms. What's been the most frustrating part of your current situation?`;
    }

    // Business-focused responses
    if (lowerMessage.includes('business') || lowerMessage.includes('company') || lowerMessage.includes('customers')) {
      return `That's exactly the kind of thinking I love - focusing on how digital tools can actually help your business serve customers better. What's your business about, and what's working well versus what could be improved in how you connect with customers online?`;
    }

    // Consultative default responses with strategic thinking
    const consultativeResponses = [
      `That's a really interesting point. I'm curious - what's the context behind that? Understanding the full picture usually helps me give much better guidance.`,
      `Great question! Every situation is different, so I'd love to understand more about your specific goals. What does success look like for you in this area?`,
      `That makes me think about a few different approaches. Before I share some ideas, help me understand - what's driving this need right now? Is there a particular challenge or opportunity you're focused on?`,
      `I've seen similar situations before, and there are usually some creative ways to approach it. What constraints are you working with, and what would an ideal outcome look like?`,
      `Absolutely! I'd love to dive deeper into that with you. What's your email? I can send you some relevant examples and thoughts, and we can explore how it might work for your specific situation.`
    ];

    // Record as unknown question for improvement
    recordUnknownQuestion(userMessage);
    
    return consultativeResponses[Math.floor(Math.random() * consultativeResponses.length)];
  };

  const openChatbot = () => {
    setIsOpen(true);
    setIsAnimating(true);
    sessionStartTime.current = Date.now();
    
    console.log('🚀 CHATBOT OPENED - Session started');
    
    // Track professional interaction start
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
    console.log('🔚 CHATBOT CLOSING');
    
    const sessionAnalysis = analyzeBusinessConversation();
    
    console.log('📊 SESSION ANALYSIS:', sessionAnalysis);
    
    // Send lead data if qualified
    if (leadData.current.email || sessionAnalysis.leadQuality === 'high') {
      console.log('📧 Recording final lead data on close');
      recordLeadData(sessionAnalysis);
    }

    // Track session end
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

  const addMessage = (text, sender = 'user') => {
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
      
      // Generate professional AI response
      setIsProcessing(true);
      setTimeout(() => {
        try {
          const response = generateProfessionalResponse(text);
          console.log('🤖 BOT RESPONSE:', response);
          addMessage(response, 'bot');
        } catch (error) {
          console.error('Response generation failed:', error);
          addMessage("I apologize for the delay. Let me connect you directly with Yuvaan for the best assistance. Could you share your email so he can reach out personally?", 'bot');
        }
        setIsProcessing(false);
      }, 1200); // Professional response timing
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
      recommendedFollowUp: determineFollowUpAction()
    };
  };

  const determineFollowUpAction = () => {
    if (leadData.current.email) return 'immediate_outreach';
    if (conversationContext.current.intents.has('hire_intent')) return 'aggressive_follow_up';
    if (conversationContext.current.intents.has('pricing_inquiry')) return 'proposal_ready';
    return 'nurture_lead';
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