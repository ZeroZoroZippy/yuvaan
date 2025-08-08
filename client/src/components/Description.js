import React from 'react';
import circle from '../assets/About/CIRCLE ICON.png'

function Description() {
  return (
    <div
      className="rounded-2xl shadow-lg w-full lg:w-[470px] h-[250px] sm:h-[280px] lg:h-[300px] relative"
      style={{ backgroundColor: '#161711' }}
    >
      {/* Circle Icon at top left */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-6 lg:left-6">
        <img src={circle} alt="Circle Icon" className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
      </div>

      {/* Diagonal Arrow at top right */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 cursor-pointer">
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-[#A8977A] transition-transform duration-300 ease-in-out hover:scale-110"
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

      {/* Description Container - pushed to bottom */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 lg:bottom-6 lg:left-6 lg:right-6">
        <p className="text-lg sm:text-sm lg:text-[1.25rem] text-[#A8977A] leading-relaxed lg:leading-relaxed">
          I build digital products that work — and work fast. From AI companions to small business websites, I turn ideas into things people actually use and pay for. My focus: create something useful, simple, and a little bit delightful.
        </p>
      </div>
    </div>
  );
}

export default Description;