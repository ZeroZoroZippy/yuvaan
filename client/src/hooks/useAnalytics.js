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

  // Enhanced Chatbot tracking - FIXED VERSION
  const trackChatbot = useCallback(async (action, messageCount = 0, context = null, additionalData = {}) => {
    try {
      if (action === 'open') {
        // Start new chatbot session and return session ID
        const sessionId = await analyticsService.startChatbotSession();
        analyticsService.updateClickCounter('chatbot_opens', 'saarth');
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🤖 Chatbot session started via hook:', sessionId);
        }
        
        return sessionId;
      } 
      else if (action === 'close') {
        // End chatbot session
        const result = await analyticsService.endChatbotSession(context || 'user_close');
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🤖 Chatbot session ended via hook:', result);
        }
        
        return result;
      }
      else if (action === 'message' && additionalData.messageData) {
        // Track individual message using the enhanced method
        const result = await analyticsService.trackChatbotMessage(additionalData.messageData);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('💬 Message tracked via hook:', {
            sender: additionalData.messageData.sender,
            length: additionalData.messageData.content?.length || 0,
            messageType: result?.messageType,
            sentiment: result?.sentiment
          });
        }
        
        return result;
      }
      
      // Fallback to legacy method for other actions
      return analyticsService.trackChatbotInteraction(action, messageCount, context, additionalData);
      
    } catch (error) {
      console.error('Chatbot tracking error in hook:', error.message);
      return null;
    }
  }, []);

  // Blog tracking
  const trackBlog = useCallback((action, blogId = null, blogTitle = null) => {
    analyticsService.trackBlogInteraction(action, blogId, blogTitle);
  }, []);

  // Error tracking
  const trackError = useCallback((errorType, errorMessage, context = null) => {
    analyticsService.trackError(errorType, errorMessage, context);
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

  // Funnel tracking
  const trackFunnel = useCallback((funnelName, stepName, stepNumber, additionalData = {}) => {
    analyticsService.trackFunnelStep(funnelName, stepName, stepNumber, additionalData);
  }, []);

  return {
    trackCTA,
    trackFormField,
    trackFormSubmit,
    trackNavigation,
    trackProject,
    trackSocial,
    trackChatbot, // Now properly handles enhanced chatbot analytics
    trackBlog,
    trackError,
    trackEvent,
    trackClick,
    trackFunnel
  };
};

// Higher-order component for automatic click tracking
export const withAnalytics = (WrappedComponent, componentName) => {
  return function AnalyticsWrappedComponent(props) {
    const { trackEvent } = useAnalytics();
    const { onClick } = props;

    useEffect(() => {
      trackEvent('component_render', { componentName });
    }, [trackEvent]);

    const handleClick = useCallback((event) => {
      trackEvent('component_click', {
        componentName,
        elementType: event.target.tagName,
        elementText: event.target.textContent?.substring(0, 50)
      });

      // Call original onClick if it exists
      if (onClick) {
        onClick(event);
      }
    }, [trackEvent, onClick]);

    return <WrappedComponent {...props} onClick={handleClick} />;
  };
};

export default useAnalytics;