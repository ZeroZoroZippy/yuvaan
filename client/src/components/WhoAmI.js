import React from 'react';
import { useNavigate } from 'react-router-dom';
import Orb from './ui/orb'

function WhoAmI() {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl shadow-lg w-full lg:w-[590px] h-[500px] lg:h-[400px] p-4 relative"
      style={{ backgroundColor: '#161711' }}
    >
      {/* Orb Component - Top Left */}
      <div className="absolute top-4 left-4 lg:top-6 lg:left-6">
        <div className="relative w-16 h-16 lg:w-20 lg:h-20">
          <Orb />
        </div>
      </div>

      {/* Diagonal Arrow at top right */}
      <div
        className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-2 lg:right-4 cursor-pointer"
        onClick={() => navigate('/about')}
      >
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-14 lg:h-14 text-[#A8977A] transition-transform duration-300 ease-in-out hover:scale-110"
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
      <div className="absolute top-[6rem] left-2 lg:top-[7rem] lg:left-4">
        <h2 className="text-[1.75rem] lg:text-[2rem] font-medium text-[#A8977A] text-left px-4">
          Where web meets intelligence.
        </h2>
      </div>

      {/* Description Container - positioned at bottom */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 lg:bottom-6 lg:left-6 lg:right-6">
        <p className="text-lg sm:text-sm lg:text-[1.25rem] text-[#A8977A] leading-relaxed lg:leading-relaxed">
          I'm a web developer who designs, or a designer who codes — either way, I bring ideas to life in ways people love to use. Blending creativity with clean execution, I make digital experiences that work beautifully and feel effortless.
        </p>
      </div>
    </div>
  );
}

export default WhoAmI;