import { useEffect, useCallback, useRef } from 'react';
import analyticsService from '../services/analyticsService';

export const useAnalytics = () => {
  const mountTimeRef = useRef(Date.now());

  // Track component mount/unmount
  useEffect(() => {
    const componentName = new Error().stack?.split('\n')[2]?.match(/at (\w+)/)?.[1] || 'Unknown';
    const mountTime = mountTimeRef.current;
    
    analyticsService.trackEvent('component_mount', {
      componentName,
      mountTime
    });

    return () => {
      analyticsService.trackEvent('component_unmount', {
        componentName,
        timeOnComponent: Date.now() - mountTime
      });
    };
  }, []);

  // CTA tracking
  const trackCTA = useCallback((ctaName, ctaType = 'button', additionalData = {}) => {
    analyticsService.trackCTAClick(ctaName, ctaType, additionalData);
  }, []);

  // Form tracking
  const trackFormField = useCallback((formName, fieldName, action, value = null) => {
    analyticsService.trackFormInteraction(formName, fieldName, action, value);
  }, []);

  const trackFormSubmit = useCallback((formName, formData, success = true, errorMessage = null) => {
    analyticsService.trackFormSubmit(formName, formData, success, errorMessage);
  }, []);

  // Navigation tracking
  const trackNavigation = useCallback((from, to, method = 'click') => {
    analyticsService.trackNavigation(from, to, method);
  }, []);

  // Project tracking
  const trackProject = useCallback((projectName, projectId, viewType = 'expand') => {
    analyticsService.trackProjectView(projectName, projectId, viewType);
  }, []);

  // Social media tracking
  const trackSocial = useCallback((platform, url, context = 'footer') => {
    analyticsService.trackSocialClick(platform, url, context);
  }, []);

  // ENHANCED: Complete Chatbot tracking with conversation intelligence
  const trackChatbot = useCallback(async (action, messageCount = 0, context = null, additionalData = {}) => {
    try {
      if (action === 'open' || action === 'session_start') {
        // Start new enhanced chatbot session
        const sessionId = await analyticsService.startChatbotSession();
        analyticsService.updateClickCounter('chatbot_opens', 'saarth');
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🤖 Enhanced chatbot session started:', sessionId);
        }
        
        return sessionId;
      } 
      else if (action === 'close' || action === 'session_end') {
        // End enhanced chatbot session with complete data
        const result = await analyticsService.endChatbotSession(context || 'user_close');
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🤖 Enhanced chatbot session ended:', result);
        }
        
        return result;
      }
      else if (action === 'message' && additionalData.messageData) {
        // Track individual message with enhanced analytics
        const result = await analyticsService.trackChatbotMessage(additionalData.messageData);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('💬 Enhanced message tracked:', {
            sender: additionalData.messageData.sender,
            length: additionalData.messageData.content?.length || 0,
            messageType: result?.messageType,
            sentiment: result?.sentiment,
            topics: result?.topics
          });
        }
        
        return result;
      }
      else if (action === 'lead_captured') {
        // Track lead capture with complete conversation context
        const leadData = additionalData.leadData || {};
        const conversationData = additionalData.conversationData || {};
        
        analyticsService.trackEvent('chatbot_lead_captured', {
          email: leadData.email,
          qualificationLevel: leadData.qualificationLevel,
          conversationId: leadData.conversationId,
          messageCount: conversationData.messageCount,
          duration: conversationData.duration,
          userQuestions: conversationData.userQuestions?.length || 0,
          leadIndicators: conversationData.leadIndicators?.length || 0,
          engagementLevel: conversationData.engagementLevel,
          conversionPotential: leadData.conversionPotential
        });
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🎯 Enhanced lead capture tracked:', {
            email: leadData.email,
            quality: leadData.qualificationLevel,
            engagement: conversationData.engagementLevel
          });
        }
        
        return true;
      }
      else if (action === 'unknown_topic') {
        // Track unknown topics with conversation context
        const topicData = additionalData.topicData || {};
        
        analyticsService.trackEvent('chatbot_unknown_topic', {
          topic: topicData.topic,
          userQuestion: topicData.userQuestion,
          conversationId: topicData.conversationId,
          context: topicData.context,
          timestamp: Date.now()
        });
        
        if (process.env.NODE_ENV === 'development') {
          console.log('❓ Unknown topic tracked:', topicData.topic);
        }
        
        return true;
      }
      else if (action === 'conversation_analysis') {
        // Track complete conversation analysis
        const analysisData = additionalData.analysisData || {};
        
        analyticsService.trackEvent('chatbot_conversation_analysis', {
          conversationId: analysisData.conversationId,
          totalMessages: analysisData.totalMessages,
          duration: analysisData.duration,
          leadQuality: analysisData.leadQuality,
          engagementLevel: analysisData.engagementLevel,
          dominantTopics: analysisData.dominantTopics,
          sentimentProgression: analysisData.sentimentProgression,
          unknownTopicsCount: analysisData.unknownTopicsCount,
          conversionPotential: analysisData.conversionPotential
        });
        
        if (process.env.NODE_ENV === 'development') {
          console.log('📊 Conversation analysis tracked:', {
            id: analysisData.conversationId,
            quality: analysisData.leadQuality,
            engagement: analysisData.engagementLevel
          });
        }
        
        return true;
      }
      
      // Fallback to legacy method for other actions
      return analyticsService.trackChatbotInteraction(action, messageCount, context, additionalData);
      
    } catch (error) {
      console.error('Enhanced chatbot tracking error:', error.message);
      return null;
    }
  }, []);

  // ENHANCED: Conversation quality tracking
  const trackConversationQuality = useCallback((conversationData) => {
    try {
      analyticsService.trackEvent('conversation_quality_assessment', {
        conversationId: conversationData.conversationId,
        qualityScore: conversationData.qualityScore,
        engagementMetrics: conversationData.engagementMetrics,
        responseAccuracy: conversationData.responseAccuracy,
        userSatisfactionIndicators: conversationData.userSatisfactionIndicators,
        improvementAreas: conversationData.improvementAreas
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('📈 Conversation quality tracked:', conversationData.qualityScore);
      }
    } catch (error) {
      console.error('Conversation quality tracking error:', error.message);
    }
  }, []);

  // ENHANCED: Lead scoring and qualification tracking
  const trackLeadScoring = useCallback((leadData) => {
    try {
      analyticsService.trackEvent('lead_scoring_analysis', {
        leadId: leadData.leadId,
        email: leadData.email ? 'provided' : 'not_provided', // Privacy-safe
        qualificationScore: leadData.qualificationScore,
        scoringFactors: leadData.scoringFactors,
        conversionProbability: leadData.conversionProbability,
        recommendedActions: leadData.recommendedActions,
        priorityLevel: leadData.priorityLevel
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🎯 Lead scoring tracked:', {
          score: leadData.qualificationScore,
          priority: leadData.priorityLevel
        });
      }
    } catch (error) {
      console.error('Lead scoring tracking error:', error.message);
    }
  }, []);

  // ENHANCED: Knowledge gap analysis tracking
  const trackKnowledgeGap = useCallback((gapData) => {
    try {
      analyticsService.trackEvent('knowledge_gap_analysis', {
        conversationId: gapData.conversationId,
        unknownTopics: gapData.unknownTopics,
        missedOpportunities: gapData.missedOpportunities,
        contentGaps: gapData.contentGaps,
        improvementSuggestions: gapData.improvementSuggestions,
        impactAssessment: gapData.impactAssessment
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('❓ Knowledge gap tracked:', {
          topics: gapData.unknownTopics?.length || 0,
          impact: gapData.impactAssessment
        });
      }
    } catch (error) {
      console.error('Knowledge gap tracking error:', error.message);
    }
  }, []);

  // ENHANCED: Conversation flow analysis
  const trackConversationFlow = useCallback((flowData) => {
    try {
      analyticsService.trackEvent('conversation_flow_analysis', {
        conversationId: flowData.conversationId,
        flowPattern: flowData.flowPattern,
        dropOffPoints: flowData.dropOffPoints,
        engagementTrends: flowData.engagementTrends,
        optimalPathDeviation: flowData.optimalPathDeviation,
        conversionFunnelStage: flowData.conversionFunnelStage
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Conversation flow tracked:', flowData.flowPattern);
      }
    } catch (error) {
      console.error('Conversation flow tracking error:', error.message);
    }
  }, []);

  // Error tracking with enhanced context
  const trackError = useCallback((errorType, errorMessage, context = null, additionalData = {}) => {
    analyticsService.trackError(errorType, errorMessage, context);
    
    // Enhanced error tracking for chatbot-related errors
    if (context?.includes('chatbot') || errorType?.includes('chatbot')) {
      analyticsService.trackEvent('chatbot_error_detailed', {
        errorType,
        errorMessage,
        context,
        conversationId: additionalData.conversationId,
        messageCount: additionalData.messageCount,
        userAction: additionalData.userAction,
        timestamp: Date.now()
      });
    }
  }, []);

  // Custom event tracking
  const trackEvent = useCallback((eventType, eventData = {}) => {
    analyticsService.trackEvent(eventType, eventData);
  }, []);

  // Mouse click tracking for heatmaps
  const trackClick = useCallback((event, elementName = '') => {
    analyticsService.trackMouseClick(
      event.clientX, 
      event.clientY, 
      event.target, 
      elementName || event.target.textContent
    );
  }, []);

  // Funnel tracking with enhanced conversion data
  const trackFunnel = useCallback((funnelName, stepName, stepNumber, additionalData = {}) => {
    analyticsService.trackFunnelStep(funnelName, stepName, stepNumber, additionalData);
    
    // Enhanced funnel tracking for chatbot conversion funnel
    if (funnelName === 'chatbot_conversion') {
      analyticsService.trackEvent('chatbot_conversion_funnel', {
        step: stepName,
        stepNumber,
        conversationId: additionalData.conversationId,
        timeToStep: additionalData.timeToStep,
        previousSteps: additionalData.previousSteps,
        conversionProbability: additionalData.conversionProbability
      });
    }
  }, []);

  // ENHANCED: Real-time conversation monitoring
  const trackRealTimeMetrics = useCallback((metricsData) => {
    try {
      analyticsService.trackEvent('real_time_conversation_metrics', {
        conversationId: metricsData.conversationId,
        activeTime: metricsData.activeTime,
        responseSpeed: metricsData.responseSpeed,
        userEngagement: metricsData.userEngagement,
        messageQuality: metricsData.messageQuality,
        conversionSignals: metricsData.conversionSignals,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Real-time metrics tracking error:', error.message);
    }
  }, []);

  // ENHANCED: Business intelligence tracking
  const trackBusinessIntelligence = useCallback((businessData) => {
    try {
      analyticsService.trackEvent('business_intelligence_metrics', {
        leadValue: businessData.leadValue,
        projectType: businessData.projectType,
        estimatedRevenue: businessData.estimatedRevenue,
        closingProbability: businessData.closingProbability,
        competitorMentions: businessData.competitorMentions,
        urgencyLevel: businessData.urgencyLevel,
        decisionMakerStatus: businessData.decisionMakerStatus
      });
    } catch (error) {
      console.error('Business intelligence tracking error:', error.message);
    }
  }, []);

  return {
    // Original tracking methods
    trackCTA,
    trackFormField,
    trackFormSubmit,
    trackNavigation,
    trackProject,
    trackSocial,
    trackError,
    trackEvent,
    trackClick,
    trackFunnel,
    
    // ENHANCED: Complete chatbot analytics
    trackChatbot, // Enhanced with conversation intelligence
    trackConversationQuality,
    trackLeadScoring,
    trackKnowledgeGap,
    trackConversationFlow,
    trackRealTimeMetrics,
    trackBusinessIntelligence,
    
    // ENHANCED: Utility methods for conversation analysis
    analyzeConversation: useCallback((conversationData) => {
      // Multi-dimensional conversation analysis
      trackConversationQuality(conversationData.qualityMetrics);
      trackConversationFlow(conversationData.flowMetrics);
      
      if (conversationData.leadData) {
        trackLeadScoring(conversationData.leadData);
      }
      
      if (conversationData.knowledgeGaps) {
        trackKnowledgeGap(conversationData.knowledgeGaps);
      }
      
      if (conversationData.businessMetrics) {
        trackBusinessIntelligence(conversationData.businessMetrics);
      }
    }, [trackConversationQuality, trackConversationFlow, trackLeadScoring, trackKnowledgeGap, trackBusinessIntelligence]),
    
    // ENHANCED: Get conversation insights
    getConversationInsights: useCallback(() => {
      return analyticsService.getCurrentChatbotSession() || null;
    }, [])
  };
};

// Higher-order component for automatic click tracking (enhanced)
export const withAnalytics = (WrappedComponent, componentName) => {
  return function AnalyticsWrappedComponent({ onClick, ...restProps }) {
    const { trackEvent, trackClick } = useAnalytics();
    const propKeys = Object.keys(restProps);
    if (onClick) {
      propKeys.push('onClick');
    }
    const propNames = propKeys.sort().join('|');

    useEffect(() => {
      trackEvent('component_render', { 
        componentName,
        renderTime: Date.now(),
        props: propNames ? propNames.split('|') : []
      });
    }, [trackEvent, propNames]);

    const handleClick = useCallback((event) => {
      // Enhanced click tracking with more context
      trackEvent('component_click', {
        componentName,
        elementType: event.target.tagName,
        elementText: event.target.textContent?.substring(0, 50),
        elementId: event.target.id,
        elementClass: event.target.className,
        clickPosition: {
          x: event.clientX,
          y: event.clientY
        },
        timestamp: Date.now()
      });

      // Track for heatmap data
      trackClick(event, componentName);

      // Call original onClick if it exists
      if (onClick) {
        onClick(event);
      }
    }, [trackEvent, trackClick, onClick]);

    return <WrappedComponent {...restProps} onClick={handleClick} />;
  };
};

// ENHANCED: Higher-order component for chatbot conversation tracking
export const withChatbotAnalytics = (WrappedComponent) => {
  return function ChatbotAnalyticsWrappedComponent({ onMessageSent, onConversationEnd, ...restProps }) {
    const { trackChatbot, trackConversationQuality } = useAnalytics();
    const handleMessageSent = useCallback((messageData) => {
      trackChatbot('message', 0, 'user_message', { messageData });
      onMessageSent?.(messageData);
    }, [trackChatbot, onMessageSent]);

    const handleConversationEnd = useCallback((conversationData) => {
      trackChatbot('conversation_analysis', 0, 'session_end', { analysisData: conversationData });
      trackConversationQuality(conversationData.qualityMetrics);
      onConversationEnd?.(conversationData);
    }, [trackChatbot, trackConversationQuality, onConversationEnd]);

    return (
      <WrappedComponent
        {...restProps}
        onMessageSent={handleMessageSent}
        onConversationEnd={handleConversationEnd}
      />
    );
  };
};

export default useAnalytics;
