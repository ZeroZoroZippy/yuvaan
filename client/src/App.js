import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PageTransitionProvider } from './contexts/PageTransitionContext';
import PageTransition from './components/ui/PageTransition';
import HeroPage from './pages/HeroPage';
import AboutPage from './pages/AboutPage';
import ProjectPage from './pages/ProjectPage';

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
          </Routes>
        </div>
      </PageTransitionProvider>
    </Router>
  );
}

export default App;