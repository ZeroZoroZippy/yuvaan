import React from 'react';
import { usePageNavigation } from '../hooks/usePageNavigation';
import { useMobileMenu } from '../contexts/MobileMenuContext';
import { useChatbot } from '../chatbot/context/ChatbotContext';
import { useAnalytics } from '../hooks/useAnalytics';

const Navbar = () => {
  const { isOpen, toggleMenu, closeMenu } = useMobileMenu();
  const { navigateWithTransition } = usePageNavigation();
  const { openChatbot } = useChatbot();
  const { trackCTA, trackNavigation, trackChatbot } = useAnalytics();

  const handleLogoClick = () => {
    console.log('Logo clicked - navigating to home');
    trackCTA('navbar_logo', 'logo', { destination: '/', currentPage: window.location.pathname });
    trackNavigation(window.location.pathname, '/', 'logo_click');
    navigateWithTransition('/', 'down');
    closeMenu();
  };

  const handleTalkToSaarthClick = () => {
    trackCTA('navbar_talk_to_saarth', 'chatbot_cta', { 
      context: 'navbar', 
      currentPage: window.location.pathname,
      deviceType: isOpen ? 'mobile' : 'desktop'
    });
    trackChatbot('open', 0, 'navbar');
    
    // Immediately open chatbot for instant response
    openChatbot();

    // Close menu with reduced delay to prevent animation conflicts
    if (isOpen) {
      // Use requestAnimationFrame for smoother coordination
      requestAnimationFrame(() => {
        closeMenu();
      });
    }
  };

  const handleMobileMenuKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    trackCTA('navbar_mobile_menu', 'menu_toggle', {
      action: isOpen ? 'close' : 'open',
      currentPage: window.location.pathname,
      trigger: 'keyboard'
    });
    toggleMenu();
  };

  return (
    <>
      {/* Blur overlay for mobile menu - positioned behind navbar */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={closeMenu}
      />

      <header className="fixed w-full z-50 p-3 backdrop-blur-lg" role="banner">
        <nav className="rounded-2xl max-w-[90rem] mx-auto shadow-lg bg-[#161711]" aria-label="Main navigation">
          <div className="px-6 py-1">
            <div className="flex justify-between h-16 items-center">
              {/* Logo */}
              <button
                onClick={handleLogoClick}
                className="text-[1.5rem] font-bold text-[#A8977A] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:ring-offset-2 focus:ring-offset-[#161711] rounded-md px-2 py-1"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Yuvaan Vithlani
              </button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-12">
                <a
                  href="/about"
                  className="text-xl text-[#A8977A] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:ring-offset-2 focus:ring-offset-[#161711] rounded-md px-2 py-1"
                  style={{ fontFamily: 'var(--font-sans)' }}
                  onClick={() => {
                    trackCTA('navbar_about_desktop', 'navigation', { 
                      destination: '/about', 
                      currentPage: window.location.pathname,
                      context: 'desktop_menu'
                    });
                    trackNavigation(window.location.pathname, '/about', 'desktop_menu_click');
                  }}
                >
                  About
                </a>
                <button
                  onClick={handleTalkToSaarthClick}
                  className="px-6 py-2 rounded-full bg-[#A8977A] text-xl text-[#161711] hover:bg-[#161711] hover:text-[#A8977A] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#161711]"
                  style={{ fontFamily: 'var(--font-sans)' }}
                  aria-label="Open Saarth chatbot for assistance"
                >
                  Talk to Saarth
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => {
                    trackCTA('navbar_mobile_menu', 'menu_toggle', { 
                      action: isOpen ? 'close' : 'open',
                      currentPage: window.location.pathname 
                    });
                    toggleMenu();
                  }}
                  onKeyDown={handleMobileMenuKeyDown}
                  className="text-[#A8977A] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:ring-offset-2 focus:ring-offset-[#161711] rounded-md p-1 transition-colors duration-300"
                  aria-label="Open navigation menu"
                  aria-expanded={isOpen}
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

            {/* Mobile Menu - Faster animations */}
            <div className={`md:hidden overflow-hidden transition-all duration-200 ease-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
              }`}>
              <div className="mt-4 border-t border-[#A8977A]/20">
                <div className={`pt-4 pb-3 space-y-1 transform transition-transform duration-200 ease-out ${isOpen ? 'translate-y-0' : '-translate-y-4'
                  }`}>
                  <a
                    href="/about"
                    className="block px-3 py-2 text-lg text-[#A8977A] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:ring-offset-2 focus:ring-offset-[#161711] rounded-md"
                    style={{ fontFamily: 'var(--font-sans)' }}
                    onClick={() => {
                      trackCTA('navbar_about_mobile', 'navigation', { 
                        destination: '/about', 
                        currentPage: window.location.pathname,
                        context: 'mobile_menu'
                      });
                      trackNavigation(window.location.pathname, '/about', 'mobile_menu_click');
                      closeMenu();
                    }}
                  >
                    About
                  </a>
                  <button
                    onClick={handleTalkToSaarthClick}
                    className="mx-3 mt-6 px-6 py-2 rounded-full bg-[#A8977A] text-[#161711] hover:bg-[#161711] hover:text-[#A8977A] transition-colors duration-200 w-[calc(100%-1.5rem)] active:scale-95 transform focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#161711]"
                    style={{ fontFamily: 'var(--font-sans)' }}
                    aria-label="Open Saarth chatbot for assistance"
                  >
                    Talk to Saarth
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
