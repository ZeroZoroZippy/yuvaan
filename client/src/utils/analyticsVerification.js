// Analytics Implementation Verification
// This file helps verify that all analytics tracking is properly implemented

export const verifyAnalyticsImplementation = () => {
  const results = {
    components: {},
    services: {},
    hooks: {},
    overall: 'pending'
  };

  // Check if analytics service is available
  try {
    const analyticsService = require('../services/analyticsService').default;
    results.services.analyticsService = analyticsService ? 'available' : 'missing';
    results.services.sessionId = analyticsService?.sessionId ? 'generated' : 'missing';
    results.services.userId = analyticsService?.userId ? 'generated' : 'missing';
  } catch (error) {
    results.services.analyticsService = `error: ${error.message}`;
  }

  // Check if analytics hook is available
  try {
    const useAnalytics = require('../hooks/useAnalytics').useAnalytics;
    results.hooks.useAnalytics = useAnalytics ? 'available' : 'missing';
  } catch (error) {
    results.hooks.useAnalytics = `error: ${error.message}`;
  }

  // Check Firebase configuration
  try {
    const { db } = require('../config/firebase');
    results.services.firebase = db ? 'configured' : 'missing';
  } catch (error) {
    results.services.firebase = `error: ${error.message}`;
  }

  // Determine overall status
  const hasErrors = Object.values(results.services).some(status => status.includes('error')) ||
                   Object.values(results.hooks).some(status => status.includes('error'));
  
  const hasMissing = Object.values(results.services).some(status => status === 'missing') ||
                    Object.values(results.hooks).some(status => status === 'missing');

  if (hasErrors) {
    results.overall = 'error';
  } else if (hasMissing) {
    results.overall = 'incomplete';
  } else {
    results.overall = 'ready';
  }

  return results;
};

// List of all tracked events for verification
export const trackedEvents = {
  navigation: [
    'navbar_logo',
    'navbar_about_desktop',
    'navbar_about_mobile', 
    'navbar_blog',
    'navbar_talk_to_saarth',
    'navbar_mobile_menu'
  ],
  contact: [
    'contact_arrow',
    'contact_modal_open',
    'contact_modal_close',
    'contact_form_success',
    'contact_modal_send_another'
  ],
  projects: [
    'project_project1_expand',
    'project_project2_expand',
    'project_project1_close',
    'project_project2_close',
    'project_dental_external_link'
  ],
  social: [
    'footer_linkedin',
    'footer_instagram',
    'about_linkedin_link',
    'about_instagram_link'
  ],
  blog: [
    'blog_post_click',
    'blog_post_click_mobile'
  ],
  chatbot: [
    'chatbot_message_send',
    'chatbot_close_desktop',
    'chatbot_close_mobile'
  ],
  forms: [
    'contact_modal form interactions',
    'about_contact_form form interactions'
  ]
};

// Analytics health check
export const performHealthCheck = () => {
  const healthCheck = {
    timestamp: new Date().toISOString(),
    checks: {},
    status: 'unknown'
  };

  // Check localStorage for user ID
  try {
    const userId = localStorage.getItem('analytics_user_id');
    healthCheck.checks.localStorage = userId ? 'working' : 'no_user_id';
  } catch (error) {
    healthCheck.checks.localStorage = `error: ${error.message}`;
  }

  // Check if we can access window objects
  try {
    healthCheck.checks.windowAccess = {
      location: !!window.location,
      navigator: !!window.navigator,
      screen: !!window.screen,
      performance: !!window.performance
    };
  } catch (error) {
    healthCheck.checks.windowAccess = `error: ${error.message}`;
  }

  // Check environment variables
  try {
    const hasFirebaseConfig = !!(
      process.env.REACT_APP_FIREBASE_API_KEY &&
      process.env.REACT_APP_FIREBASE_PROJECT_ID
    );
    healthCheck.checks.environment = hasFirebaseConfig ? 'configured' : 'missing_config';
  } catch (error) {
    healthCheck.checks.environment = `error: ${error.message}`;
  }

  // Determine overall health
  const hasErrors = Object.values(healthCheck.checks).some(check => 
    typeof check === 'string' && check.includes('error')
  );
  
  if (hasErrors) {
    healthCheck.status = 'unhealthy';
  } else if (healthCheck.checks.environment === 'missing_config') {
    healthCheck.status = 'needs_config';
  } else {
    healthCheck.status = 'healthy';
  }

  return healthCheck;
};

// Console logging helper for debugging
export const logAnalyticsEvent = (eventType, eventData) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔍 Analytics Event: ${eventType}`);
    console.log('Event Data:', eventData);
    console.log('Timestamp:', new Date().toISOString());
    console.log('URL:', window.location.href);
    console.groupEnd();
  }
};

export default {
  verifyAnalyticsImplementation,
  trackedEvents,
  performHealthCheck,
  logAnalyticsEvent
};