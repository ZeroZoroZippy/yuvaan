import React, { useState } from 'react';
import { usePageNavigation } from '../hooks/usePageNavigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { navigateWithTransition } = usePageNavigation();

  return (
    <div className="fixed w-full z-50 p-3 backdrop-blur-lg">
      <nav className="rounded-2xl max-w-[90rem] mx-auto shadow-lg" style={{ backgroundColor: '#161711' }}>
        <div className="px-6 py-1">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => {
                  console.log('Name clicked - navigating to home');
                  navigateWithTransition('/', 'down');
                }}
                className="text-[1.5rem] font-bold text-[#A8977A] hover:text-white transition-colors duration-300 cursor-pointer"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Yuvaan Vithlani
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#projects" className="text-[#A8977A] hover:text-primary-[#45372B] transition-colors" style={{ fontFamily: 'Neuton, serif' }}>Projects</a>
              <a href="#about" className="text-[#A8977A] hover:text-primary-[#45372B] transition-colors" style={{ fontFamily: 'Neuton, serif' }}>About</a>
              <a href="#contact" className="text-[#A8977A] hover:text-primary-[#45372B] transition-colors" style={{ fontFamily: 'Neuton, serif' }}>Contact</a>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-primary-600 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="md:hidden mt-4">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="#projects" className="block px-3 py-2 text-gray-700 hover:text-primary-600" style={{ fontFamily: 'Neuton, serif' }}>Projects</a>
                <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-primary-600" style={{ fontFamily: 'Neuton, serif' }}>About</a>
                <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-primary-600" style={{ fontFamily: 'Neuton, serif' }}>Contact</a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;