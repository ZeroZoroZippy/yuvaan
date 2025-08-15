// Utility functions for smooth scrolling with Lenis

export const scrollToElement = (lenis, selector, options = {}) => {
  if (!lenis) return;
  
  const element = document.querySelector(selector);
  if (!element) return;
  
  const defaultOptions = {
    offset: 0,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    ...options
  };
  
  lenis.scrollTo(element, defaultOptions);
};

export const scrollToTop = (lenis, options = {}) => {
  if (!lenis) return;
  
  const defaultOptions = {
    duration: 0.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    ...options
  };
  
  lenis.scrollTo(0, defaultOptions);
};

export const scrollToPosition = (lenis, position, options = {}) => {
  if (!lenis) return;
  
  const defaultOptions = {
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    ...options
  };
  
  lenis.scrollTo(position, defaultOptions);
};

// Smooth scroll with custom easing functions
export const easingFunctions = {
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
  easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
  easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  // Lenis default (recommended)
  lenisDefault: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
};