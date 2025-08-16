import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PageTransitionProvider } from './contexts/PageTransitionContext';
import { MobileMenuProvider, useMobileMenu } from './contexts/MobileMenuContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import { LenisProvider } from './contexts/LenisContext';
import PageTransition from './components/ui/PageTransition';
import Chatbot from './components/Chatbot';
import HeroPage from './pages/HeroPage';
import AboutPage from './pages/AboutPage';
import ProjectPage from './pages/ProjectPage';
import BlogsPage from './pages/BlogsPage';
import BlogPostPage from './pages/BlogPostPage';
import AnalyticsTest from './components/AnalyticsTest';
import ChatbotAnalyticsDashboard from './components/ChatbotAnalyticsDashboard';
import analyticsService from './services/analyticsService';
import { db } from './config/firebase'; // Add this import for diagnostics

const AppContent = () => {
  useEffect(() => {
    // Track page timing when app loads
    if (window.performance && window.performance.timing) {
      setTimeout(() => {
        analyticsService.trackPageTiming();
      }, 1000);
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
  }, []);

  return (
    <div className="App">
      <PageTransition />
      <Chatbot />
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects/:projectId" element={<ProjectPage />} />
        <Route path="/blog" element={<BlogsPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        <Route path="/analytics-test" element={<AnalyticsTest />} />
        <Route path="/chatbot-analytics" element={<ChatbotAnalyticsDashboard />} />
      </Routes>
    </div>
  );
};

function App() {

  useEffect(() => {
    // ENHANCED: Firebase setup with comprehensive diagnostics
    const setupFirebaseAnalytics = async () => {
      try {
        // Step 1: Diagnostic check
        console.log('🔍 Firebase Diagnostic Check:');
        console.log('- Project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID);
        console.log('- API Key exists:', !!process.env.REACT_APP_FIREBASE_API_KEY);
        console.log('- Auth Domain:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);
        console.log('- DB initialized:', !!db);
        console.log('- Analytics service exists:', !!analyticsService);
        
        // Step 2: Check required environment variables
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
          console.error('❌ Missing environment variables:', missingVars);
          console.error('📋 Please check your .env file');
          return;
        }
        
        console.log('✅ All environment variables present');
        
        // Step 3: Test database connection
        if (!db) {
          console.error('❌ Firebase database not initialized');
          console.error('📋 Check your firebase.js configuration');
          return;
        }
        
        console.log('✅ Firebase database initialized');
        
        // Step 4: Enable Firebase writes
        analyticsService.enableFirebase();
        console.log('🔥 Firebase writes enabled for analytics');
        
        // Step 5: Test basic analytics event (non-Firestore)
        try {
          analyticsService.trackEvent('app_initialized', {
            timestamp: Date.now(),
            userAgent: navigator.userAgent.substring(0, 100),
            test: true
          });
          console.log('✅ Basic analytics event tracked');
        } catch (eventError) {
          console.error('❌ Basic analytics event failed:', eventError.message);
        }
        
        // Step 6: Delayed test of Firestore operations
        setTimeout(async () => {
          try {
            // Test a simple counter update (this is what's failing)
            await analyticsService.updateClickCounter('test_counter', 'app_startup');
            console.log('✅ Firestore counter test successful');
          } catch (firestoreError) {
            console.error('❌ Firestore counter test failed:', firestoreError.message);
            console.error('📋 This suggests Firestore security rules or permissions issue');
            
            // Provide helpful error resolution
            if (firestoreError.message.includes('Missing or insufficient permissions')) {
              console.error('🔧 Solution: Update Firestore security rules to allow write access');
            } else if (firestoreError.message.includes('not-found')) {
              console.error('🔧 Solution: Ensure Firestore is enabled in Firebase Console');
            } else {
              console.error('🔧 Full error details:', firestoreError);
            }
          }
        }, 2000);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('📊 Chatbot messages will now be stored in Firestore');
          console.log('🎯 Visit /analytics-test to verify data collection');
        }
        
      } catch (setupError) {
        console.error('❌ Firebase setup failed:', setupError.message);
        console.error('📋 Analytics will run in local-only mode');
      }
    };
    
    // Run setup
    setupFirebaseAnalytics();
    
  }, []);
  
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <LenisProvider>
        <PageTransitionProvider>
          <MobileMenuProvider>
            <ChatbotProvider>
              <AppContent />
            </ChatbotProvider>
          </MobileMenuProvider>
        </PageTransitionProvider>
      </LenisProvider>
    </Router>
  );
}

export default App;