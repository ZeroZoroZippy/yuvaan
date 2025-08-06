import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800">Portfolio</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-primary-600 transition-colors">Home</a>
            <a href="#about" className="text-gray-700 hover:text-primary-600 transition-colors">About</a>
            <a href="#projects" className="text-gray-700 hover:text-primary-600 transition-colors">Projects</a>
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
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-primary-600">Home</a>
            <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-primary-600">About</a>
            <a href="#projects" className="block px-3 py-2 text-gray-700 hover:text-primary-600">Projects</a>
            <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-primary-600">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;