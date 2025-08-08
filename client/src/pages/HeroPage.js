import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import WhoAmI from '../components/WhoAmI';
import HeroImage from '../components/HeroImage';
import Projects from '../components/Projects';
import Description from '../components/Description';
import Contact from '../components/Contact';
import SocialMedia from '../components/SocialMedia';

function HeroPage() {
  const [animationStage, setAnimationStage] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Clean staggered reveal animation
    const timeouts = [
      setTimeout(() => setShowContent(true), 100),         // Start revealing content
      setTimeout(() => setAnimationStage(1), 400),         // Hero Image
      setTimeout(() => setAnimationStage(2), 700),         // WhoAmI
      setTimeout(() => setAnimationStage(3), 1000),        // Projects
      setTimeout(() => setAnimationStage(4), 1300),        // Description
      setTimeout(() => setAnimationStage(5), 1600),        // Contact
      setTimeout(() => setAnimationStage(6), 1900),        // SocialMedia
    ];

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <>
      {/* Optional: Subtle loading transition */}
      <div className={`page-transition ${showContent ? 'loaded' : ''}`} />
      
      <Navbar />
      <div className="pt-24">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="flex justify-start mx-4 mt-0 gap-4">
            <div className="flex flex-col gap-4">
              <div className={`${animationStage >= 2 ? 'animate-fade-scale-in' : 'animate-hidden'}`}>
                <WhoAmI />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className={`${animationStage >= 1 ? 'animate-fade-scale-in' : 'animate-hidden'}`}>
                <HeroImage />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className={`${animationStage >= 3 ? 'animate-fade-scale-in' : 'animate-hidden'}`}>
                <Projects />
              </div>
              <div className={`${animationStage >= 6 ? 'animate-fade-scale-in' : 'animate-hidden'}`}>
                <SocialMedia />
              </div>
            </div>
          </div>
          <div className="flex justify-start mx-4 -mt-[18.75rem] gap-4">
            <div className="flex flex-col gap-4">
              <div className={`${animationStage >= 4 ? 'animate-fade-scale-in' : 'animate-hidden'}`}>
                <Description />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className={`${animationStage >= 5 ? 'animate-fade-scale-in' : 'animate-hidden'}`}>
                <Contact />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden px-4 space-y-4 pb-2">
          <div className={`${animationStage >= 2 ? 'animate-slide-up-fade' : 'animate-hidden'}`}>
            <WhoAmI />
          </div>
          <div className={`${animationStage >= 1 ? 'animate-slide-up-fade' : 'animate-hidden'}`}>
            <HeroImage />
          </div>
          <div className={`${animationStage >= 4 ? 'animate-slide-up-fade' : 'animate-hidden'}`}>
            <Description />
          </div>
          <div className={`${animationStage >= 3 ? 'animate-slide-up-fade' : 'animate-hidden'}`}>
            <Projects />
          </div>
          <div className={`${animationStage >= 5 ? 'animate-slide-up-fade' : 'animate-hidden'}`}>
            <Contact />
          </div>
          <div className={`${animationStage >= 6 ? 'animate-slide-up-fade' : 'animate-hidden'}`}>
            <SocialMedia />
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroPage;