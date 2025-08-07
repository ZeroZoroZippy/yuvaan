import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed w-full z-50 p-2">
      <nav className="bg-white rounded-2xl max-w-[89rem] mx-auto">
        <div className="px-6 py-1">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-800">Yuvaan Vithlani</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#projects" className="text-gray-700 hover:text-primary-600 transition-colors">Projects</a>
              <a href="#about" className="text-gray-700 hover:text-primary-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors">Contact</a>
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
                <a href="#projects" className="block px-3 py-2 text-gray-700 hover:text-primary-600">Projects</a>
                <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-primary-600">About</a>
                <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-primary-600">Contact</a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;