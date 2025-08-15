import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PageTransitionProvider } from './contexts/PageTransitionContext';
import PageTransition from './components/ui/PageTransition';
import HeroPage from './pages/HeroPage';
import AboutPage from './pages/AboutPage';
import ProjectPage from './pages/ProjectPage';
import BlogsPage from './pages/BlogsPage';
import BlogPostPage from './pages/BlogPostPage';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <PageTransitionProvider>
        <div className="App">
          <PageTransition />
          <Routes>
            <Route path="/" element={<HeroPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects/:projectId" element={<ProjectPage />} />
            <Route path="/blog" element={<BlogsPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
          </Routes>
        </div>
      </PageTransitionProvider>
    </Router>
  );
}

export default App;