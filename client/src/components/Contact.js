import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

function Contact({ onOpenModal }) {
  const { trackCTA } = useAnalytics();
  return (
    <section
      className="rounded-2xl shadow-lg w-full lg:w-[470px] h-[250px] sm:h-[280px] lg:h-[300px] relative"
      style={{ backgroundColor: '#A8977A' }}
      aria-labelledby="contact-heading"
    >
      {/* "Got an idea?" text at top left */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-6 lg:left-6">
        <p className="text-[1.25rem] sm:text-sm lg:text-[1.25rem] text-[#45372B]" style={{ fontFamily: 'var(--font-sans)' }}>Got an idea?</p>
      </div>

      {/* Diagonal Arrow at top right - slightly bigger than Description */}
      <div
        className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-2 lg:right-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#45372B] focus:ring-offset-2 focus:ring-offset-[#A8977A] rounded-md p-1"
        role="button"
        tabIndex={0}
        aria-label="Open contact form"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            trackCTA('contact_arrow', 'contact_modal_trigger', { 
              context: 'hero_page',
              currentPage: window.location.pathname,
              position: 'top_right'
            });
            onOpenModal();
          }
        }}
        onClick={() => {
          trackCTA('contact_arrow', 'contact_modal_trigger', { 
            context: 'hero_page',
            currentPage: window.location.pathname,
            position: 'top_right'
          });
          onOpenModal();
        }}
      >
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 lg:w-14 lg:h-14 text-[#45372B] transition-transform duration-300 ease-in-out hover:scale-110"
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

      {/* "Contact Me" heading at bottom left */}
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 lg:bottom-6 lg:left-6">
        <h2 id="contact-heading" className="text-[2rem] sm:text-2xl lg:text-4xl font-bold text-[#45372B]" style={{ fontFamily: 'var(--font-sans)' }}>Contact Me</h2>
      </div>
    </section>
  );
}

export default Contact;
