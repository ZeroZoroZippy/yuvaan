import { useEffect, useCallback, useRef } from 'react';
import analyticsService from '../services/analyticsService';

export const useAnalytics = () => {
  const mountTimeRef = useRef(Date.now());

  // Track component mount/unmount
  useEffect(() => {
    const componentName = new Error().stack?.split('\n')[2]?.match(/at (\w+)/)?.[1] || 'Unknown';
    
    analyticsService.trackEvent('component_mount', {
      componentName,
      mountTime: mountTimeRef.current
    });

    return () => {
      analyticsService.trackEvent('component_unmount', {
        componentName,
        timeOnComponent: Date.now() - mountTimeRef.current
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

  // Chatbot tracking
  const trackChatbot = useCallback((action, messageCount = 0, context = null) => {
    analyticsService.trackChatbotInteraction(action, messageCount, context);
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
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
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
    trackChatbot,
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
      if (props.onClick) {
        props.onClick(event);
      }
    }, [trackEvent, props.onClick]);

    return <WrappedComponent {...props} onClick={handleClick} />;
  };
};

export default useAnalytics;