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
import analyticsService from './services/analyticsService';

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
      </Routes>
    </div>
  );
};

function App() {
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