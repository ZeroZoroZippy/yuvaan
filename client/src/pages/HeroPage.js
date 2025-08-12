import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import WhoAmI from '../components/WhoAmI';
import HeroImage from '../components/HeroImage';
import Projects from '../components/Projects';
import Testimonial from '../components/Testimonial';
import Contact from '../components/Contact';
import SocialMedia from '../components/SocialMedia';
import ContactModal from '../components/ContactModal';

function HeroPage() {
  const [animationStage, setAnimationStage] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openContactModal = () => {
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  useEffect(() => {
    // Smooth scroll to top when component mounts with animation
    const smoothScrollToTop = () => {
      const startPosition = window.pageYOffset;
      const startTime = performance.now();
      const duration = 800; // 800ms for smooth transition

      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);

        window.scrollTo(0, startPosition * (1 - easedProgress));

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    };

    smoothScrollToTop();

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
                <Testimonial />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className={`${animationStage >= 5 ? 'animate-fade-scale-in' : 'animate-hidden'}`}>
                <Contact onOpenModal={openContactModal} />
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
          <div className={`${animationStage >= 3 ? 'animate-slide-up-fade' : 'animate-hidden'}`}>
            <Projects />
          </div>
          <div className={`${animationStage >= 4 ? 'animate-slide-up-fade' : 'animate-hidden'}`}>
            <Testimonial />
          </div>
          <div className={`${animationStage >= 5 ? 'animate-slide-up-fade' : 'animate-hidden'}`}>
            <Contact onOpenModal={openContactModal} />
          </div>
          <div className={`${animationStage >= 6 ? 'animate-slide-up-fade' : 'animate-hidden'}`}>
            <SocialMedia />
          </div>
        </div>
      </div>

      {/* Contact Modal - positioned at page level for full-screen centering */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
      />
    </>
  );
}

export default HeroPage;