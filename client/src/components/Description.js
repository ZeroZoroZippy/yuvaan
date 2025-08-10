import React from 'react';
import { useNavigate } from 'react-router-dom';
import circle from '../assets/About/CIRCLE ICON.png'

function Description() {
  const navigate = useNavigate();
  return (
    <div
      className="rounded-2xl shadow-lg w-full lg:w-[470px] h-[250px] sm:h-[280px] lg:h-[300px] relative"
      style={{ backgroundColor: '#161711' }}
    >
      {/* Circle Icon at top left */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-6 lg:left-6">
        <img src={circle} alt="Circle Icon" className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
      </div>

      {/* More About Me Button at top right */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6">
        <button
          onClick={() => navigate('/about')}
          className="bg-[#A8977A] text-[#161711] px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 rounded-lg text-xs sm:text-sm lg:text-base font-semibold hover:bg-[#b8a78a] transition-colors duration-300"
        >
          More About Me
        </button>
      </div>

      {/* Description Container - pushed to bottom */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 lg:bottom-6 lg:left-6 lg:right-6">
        <p className="text-lg sm:text-sm lg:text-[1.25rem] text-[#A8977A] leading-relaxed lg:leading-relaxed">
          I'm a web developer who designs, or a designer who codes — either way, I bring ideas to life in ways people love to use. Blending creativity with clean execution, I make digital experiences that work beautifully and feel effortless.
        </p>
      </div>
    </div>
  );
}

export default Description;