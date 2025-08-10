import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroPage from './pages/HeroPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;