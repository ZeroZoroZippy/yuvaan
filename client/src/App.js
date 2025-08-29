import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PageTransitionProvider } from './contexts/PageTransitionContext';
import { MobileMenuProvider } from './contexts/MobileMenuContext';
import { LenisProvider } from './contexts/LenisContext';
import PageTransition from './components/ui/PageTransition';
import { Chatbot, ChatbotTrigger, ChatbotProvider } from './chatbot';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingFallback from './components/LoadingFallback';
import analyticsService from './services/analyticsService';
import { db } from './config/firebase'; // Add this import for diagnostics

// Lazy load pages for code splitting
const HeroPage = lazy(() => import('./pages/HeroPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const BlogsPage = lazy(() => import('./pages/BlogsPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const AnalyticsTest = lazy(() => import('./components/AnalyticsTest'));
const ChatbotAnalyticsDashboard = lazy(() => import('./chatbot/components/ChatbotAnalyticsDashboard'));

const AppContent = () => {
  useEffect(() => {
    // Defer analytics setup to not block initial render
    const initializeAnalytics = () => {
      // Track page timing when app loads
      if (window.performance && window.performance.timing) {
        setTimeout(() => {
          analyticsService.trackPageTiming();
        }, 2000);
      }

      // Track page visibility changes
      const handleVisibilityChange = () => {
        analyticsService.trackEvent('page_visibility', {
          action: document.hidden ? 'hidden' : 'visible',
          timestamp: Date.now()
        });
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    };

    // Use requestIdleCallback to run analytics when browser is idle
    if (window.requestIdleCallback) {
      window.requestIdleCallback(initializeAnalytics);
    } else {
      setTimeout(initializeAnalytics, 1000);
    }
  }, []);

  return (
    <div className="App">
      <PageTransition />
      <Chatbot />
      <ChatbotTrigger />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects/:projectId" element={<ProjectPage />} />
          <Route path="/blog" element={<BlogsPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/analytics-test" element={<AnalyticsTest />} />
          <Route path="/chatbot-analytics" element={<ChatbotAnalyticsDashboard />} />
        </Routes>
      </Suspense>
    </div>
  );
};

function App() {

  useEffect(() => {
    // Defer Firebase setup to avoid blocking initial render
    const setupFirebaseAnalytics = async () => {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 Firebase setup deferred to improve performance');
        }
        
        // Check required environment variables
        const requiredEnvVars = [
          'REACT_APP_FIREBASE_API_KEY',
          'REACT_APP_FIREBASE_AUTH_DOMAIN', 
          'REACT_APP_FIREBASE_PROJECT_ID',
          'REACT_APP_FIREBASE_STORAGE_BUCKET',
          'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
          'REACT_APP_FIREBASE_APP_ID'
        ];
        
        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
        
        if (missingVars.length > 0) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Missing Firebase env vars, running in local mode');
          }
          return;
        }
        
        // Test database connection
        if (!db) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Firebase database not initialized');
          }
          return;
        }
        
        // Enable Firebase writes
        analyticsService.enableFirebase();
        
        // Test basic analytics event (non-blocking)
        setTimeout(() => {
          try {
            analyticsService.trackEvent('app_initialized', {
              timestamp: Date.now(),
              test: true
            });
          } catch (error) {
            // Silent fail for performance
            if (process.env.NODE_ENV === 'development') {
              console.warn('Analytics event failed:', error.message);
            }
          }
        }, 3000);
        
      } catch (setupError) {
        // Silent fail in production for performance
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Firebase setup failed, running in local mode');
        }
      }
    };
    
    // Use requestIdleCallback to defer Firebase setup
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => setupFirebaseAnalytics());
    } else {
      setTimeout(setupFirebaseAnalytics, 2000);
    }
    
  }, []);
  
  return (
    <HelmetProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <LenisProvider>
          <PageTransitionProvider>
            <MobileMenuProvider>
              <ChatbotProvider>
                <ErrorBoundary>
                  <AppContent />
                </ErrorBoundary>
              </ChatbotProvider>
            </MobileMenuProvider>
          </PageTransitionProvider>
        </LenisProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;