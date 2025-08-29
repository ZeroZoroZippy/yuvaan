import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import WhoAmI from '../components/WhoAmI';
import HeroImage from '../components/HeroImage';
import Projects from '../components/Projects';
import Testimonial from '../components/Testimonial';
import Contact from '../components/Contact';
import SocialMedia from '../components/SocialMedia';
import ContactModal from '../components/ContactModal';
import MetaManager from '../components/SEO/MetaManager';
import { useLenisContext } from '../contexts/LenisContext';
import { useMeta } from '../hooks/useMeta';

function HeroPage() {
  const [animationStage, setAnimationStage] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Get Lenis instance from context
  const lenis = useLenisContext();
  
  // Get meta configuration for homepage
  const metaConfig = useMeta();

  const openContactModal = () => {
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  useEffect(() => {
    // Smooth scroll to top using Lenis when component mounts
    if (lenis) {
      lenis.scrollTo(0, { immediate: false, duration: 0.8 });
    }

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
  }, [lenis]);

  return (
    <MetaManager
      title={metaConfig.title}
      description={metaConfig.description}
      keywords={metaConfig.keywords}
      canonicalUrl={metaConfig.canonicalUrl}
      ogImage={metaConfig.ogImage}
    >
      {/* Optional: Subtle loading transition */}
      <div className={`page-transition ${showContent ? 'loaded' : ''}`} />

      <Navbar />
      <main className="pt-24" role="main">
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
      </main>

      {/* Contact Modal - positioned at page level for full-screen centering */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
      />
    </MetaManager>
  );
}

export default HeroPage;