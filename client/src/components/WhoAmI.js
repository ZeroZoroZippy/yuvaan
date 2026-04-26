import React, { useState, useEffect } from 'react';
import { usePageNavigation } from '../hooks/usePageNavigation';
import { useChatbot } from '../chatbot/context/ChatbotContext';
import Orb from './ui/orb'

function WhoAmI() {
  const { navigateWithTransition } = usePageNavigation();
  const { openChatbot, isOpen } = useChatbot();
  const [isOrbTeleporting, setIsOrbTeleporting] = useState(false);

  // Reset teleporting state when chatbot closes, trigger when chatbot opens
  useEffect(() => {
    if (isOpen && !isOrbTeleporting) {
      // Chatbot opened from elsewhere (like navbar) - trigger teleportation
      setIsOrbTeleporting(true);
    } else if (!isOpen && isOrbTeleporting) {
      // Chatbot closed - reset teleporting state
      setIsOrbTeleporting(false);
    }
  }, [isOpen, isOrbTeleporting]);

  const handleOrbClick = () => {
    // Start teleportation animation
    setIsOrbTeleporting(true);

    // Open chatbot after scale down animation completes
    setTimeout(() => {
      openChatbot();
    }, 300); // Match the scale down duration
  };

  return (
    <section
      className="rounded-2xl shadow-lg w-full lg:w-[590px] h-[350px] lg:h-[400px] p-4 relative"
      style={{ backgroundColor: '#161711' }}
      aria-labelledby="about-heading"
    >
      {/* Orb Component - Top Left with teleportation effect */}
      <div
        className="absolute top-4 left-4 lg:top-6 lg:left-6 cursor-pointer"
        onClick={handleOrbClick}
      >
        <div className={`relative w-16 h-16 lg:w-20 lg:h-20 transition-all duration-300 ease-in-out ${isOrbTeleporting || isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          }`}>
          <Orb
            hue={220}
            hoverIntensity={0.3}
            rotateOnHover={true}
            forceHoverState={false}
          />
        </div>
      </div>

      {/* Diagonal Arrow at top right */}
      <div
        className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-2 lg:right-4 cursor-pointer"
        onClick={() => navigateWithTransition('/about', 'up')}
      >
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-14 lg:h-14 text-[#A8977A] transition-all duration-300 ease-in-out hover:scale-110 hover:text-white hover:rotate-12 active:scale-95"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M7 17L17 7M17 7H7M17 7V17"
          />
        </svg>
      </div>

      {/* Text Content */}
      <div className="absolute top-[5rem] left-2 lg:top-[6rem] lg:left-4">
        <h1 id="about-heading" className="text-[1.5rem] lg:text-[1.75rem] font-medium text-[#A8977A] text-left px-4 mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
          Yuvaan Vithlani - Product-Minded Systems Thinker
        </h1>
      </div>

      {/* Description Container - positioned at bottom */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 lg:bottom-6 lg:left-6 lg:right-6">
        <p className="text-lg sm:text-sm lg:text-[1.25rem] text-[#A8977A] leading-relaxed lg:leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
          I use systems thinking, user empathy, and AI-assisted building to turn ambiguity into digital products that feel clearer, calmer, and more useful.
        </p>
      </div>
    </section>
  );
}

export default WhoAmI;
