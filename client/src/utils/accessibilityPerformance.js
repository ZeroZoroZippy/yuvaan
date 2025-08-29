/**
 * Performance optimization utilities for accessibility features
 * Ensures accessibility enhancements don't impact load times or rendering performance
 */

/**
 * Debounced ARIA attribute injection to prevent excessive DOM updates
 * @param {Function} callback - Function to execute
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounceAriaUpdates = (callback, delay = 16) => {
  let timeoutId;
  let lastArgs;
  
  return (...args) => {
    lastArgs = args;
    clearTimeout(timeoutId);
    
    // Use requestAnimationFrame for better performance
    timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        callback.apply(null, lastArgs);
      });
    }, delay);
  };
};

/**
 * Batch ARIA attribute updates to minimize DOM reflows
 * @param {Array} updates - Array of {element, attributes} objects
 */
export const batchAriaUpdates = (updates) => {
  if (!updates || updates.length === 0) return;
  
  // Use requestAnimationFrame to batch DOM updates and avoid layout thrashing
  requestAnimationFrame(() => {
    // Group updates by element to minimize DOM access
    const elementUpdates = new Map();
    
    updates.forEach(({ element, attributes }) => {
      if (element && attributes) {
        if (!elementUpdates.has(element)) {
          elementUpdates.set(element, {});
        }
        Object.assign(elementUpdates.get(element), attributes);
      }
    });
    
    // Apply all updates for each element at once
    elementUpdates.forEach((attributes, element) => {
      Object.entries(attributes).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          element.setAttribute(key, value);
        } else if (value === null) {
          element.removeAttribute(key);
        }
      });
    });
  });
};

/**
 * Lazy load accessibility enhancements for non-critical elements
 * @param {HTMLElement} element - Element to enhance
 * @param {Function} enhancementCallback - Function to apply enhancements
 */
export const lazyLoadAccessibility = (element, enhancementCallback) => {
  if (!element || !enhancementCallback) return;

  // Use Intersection Observer for lazy loading
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Apply enhancements when element comes into view
          enhancementCallback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '50px', // Load slightly before element is visible
      threshold: 0.1
    }
  );

  observer.observe(element);
  return observer;
};

/**
 * Optimize focus management to prevent render blocking
 * @param {HTMLElement} element - Element to focus
 * @param {Object} options - Focus options
 */
export const optimizedFocus = (element, options = {}) => {
  if (!element) return;

  // Use requestAnimationFrame to ensure focus doesn't block rendering
  requestAnimationFrame(() => {
    try {
      element.focus(options);
    } catch (error) {
      // Fallback for older browsers
      element.focus();
    }
  });
};

/**
 * Performance-aware ARIA live region updates
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announceToScreenReader = (() => {
  let liveRegion = null;
  let messageQueue = [];
  let isProcessing = false;

  const createLiveRegion = () => {
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.style.cssText = `
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      `;
      document.body.appendChild(liveRegion);
    }
    return liveRegion;
  };

  const processQueue = () => {
    if (isProcessing || messageQueue.length === 0) return;
    
    isProcessing = true;
    const { message, priority } = messageQueue.shift();
    const region = createLiveRegion();
    
    // Update aria-live based on priority
    region.setAttribute('aria-live', priority);
    
    // Clear previous message and set new one
    region.textContent = '';
    requestAnimationFrame(() => {
      region.textContent = message;
      
      // Process next message after a delay
      setTimeout(() => {
        isProcessing = false;
        processQueue();
      }, 100);
    });
  };

  return (message, priority = 'polite') => {
    if (!message) return;
    
    messageQueue.push({ message, priority });
    processQueue();
  };
})();

/**
 * Throttled scroll event handler for accessibility features
 * @param {Function} callback - Callback function
 * @param {number} limit - Throttle limit in milliseconds
 */
export const throttleScrollHandler = (callback, limit = 16) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      callback.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Efficient keyboard navigation handler
 * @param {Object} keyMap - Map of key codes to handlers
 * @param {Object} options - Options for the handler
 */
export const createKeyboardHandler = (keyMap, options = {}) => {
  const { preventDefault = true, stopPropagation = false } = options;
  
  return (event) => {
    const handler = keyMap[event.key] || keyMap[event.code];
    
    if (handler) {
      if (preventDefault) event.preventDefault();
      if (stopPropagation) event.stopPropagation();
      
      // Use requestAnimationFrame to prevent blocking
      requestAnimationFrame(() => handler(event));
    }
  };
};

/**
 * Memory-efficient focus trap implementation
 * @param {HTMLElement} container - Container element
 * @returns {Object} Focus trap controls
 */
export const createFocusTrap = (container) => {
  if (!container) return { activate: () => {}, deactivate: () => {} };

  let isActive = false;
  let previousFocus = null;
  let focusableElements = [];

  const getFocusableElements = () => {
    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    return Array.from(container.querySelectorAll(selectors))
      .filter(el => el.offsetParent !== null); // Only visible elements
  };

  const handleKeyDown = (event) => {
    if (!isActive || event.key !== 'Tab') return;

    focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        optimizedFocus(lastElement);
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        optimizedFocus(firstElement);
      }
    }
  };

  return {
    activate: () => {
      if (isActive) return;
      
      isActive = true;
      previousFocus = document.activeElement;
      focusableElements = getFocusableElements();
      
      if (focusableElements.length > 0) {
        optimizedFocus(focusableElements[0]);
      }
      
      document.addEventListener('keydown', handleKeyDown);
    },
    
    deactivate: () => {
      if (!isActive) return;
      
      isActive = false;
      document.removeEventListener('keydown', handleKeyDown);
      
      if (previousFocus && previousFocus.focus) {
        optimizedFocus(previousFocus);
      }
      
      previousFocus = null;
      focusableElements = [];
    }
  };
};

/**
 * Optimize semantic HTML element creation to prevent performance impact
 * @param {string} tagName - HTML tag name
 * @param {Object} props - Element properties
 * @param {Array} children - Child elements
 * @returns {Object} Optimized element configuration
 */
export const optimizeSemanticElement = (tagName, props = {}, children = []) => {
  // Cache commonly used semantic elements
  const semanticCache = new Map();
  const cacheKey = `${tagName}-${JSON.stringify(props)}`;
  
  if (semanticCache.has(cacheKey)) {
    return semanticCache.get(cacheKey);
  }
  
  const optimizedConfig = {
    tagName,
    props: {
      ...props,
      // Add performance-optimized attributes
      ...(props.role && { role: props.role }),
      ...(props['aria-label'] && { 'aria-label': props['aria-label'] }),
      ...(props['aria-labelledby'] && { 'aria-labelledby': props['aria-labelledby'] })
    },
    children
  };
  
  // Cache for reuse (limit cache size to prevent memory leaks)
  if (semanticCache.size < 50) {
    semanticCache.set(cacheKey, optimizedConfig);
  }
  
  return optimizedConfig;
};

/**
 * Validate that accessibility features don't impact Core Web Vitals
 * @param {Function} callback - Function to measure
 * @param {string} label - Performance label
 * @returns {Promise} Performance measurement result
 */
export const measureAccessibilityImpact = async (callback, label) => {
  const startTime = performance.now();
  let result;
  let lcpObserver = null;
  
  try {
    // Only use PerformanceObserver in browser environment
    if (typeof PerformanceObserver !== 'undefined' && typeof window !== 'undefined') {
      lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          console.log(`LCP after ${label}:`, lastEntry.startTime);
        }
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (observerError) {
        // Ignore observer errors in test environment
        lcpObserver = null;
      }
    }
    
    result = await callback();
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Warn if accessibility feature impacts performance significantly
    if (duration > 50) {
      console.warn(`Accessibility feature "${label}" took ${duration.toFixed(2)}ms - consider optimization`);
    }
    
    if (lcpObserver) {
      lcpObserver.disconnect();
    }
    
    return { result, duration };
  } catch (error) {
    // In test environment, still return the result if callback succeeded
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (process.env.NODE_ENV === 'test') {
      // Try to execute callback even if observer failed
      try {
        result = await callback();
        return { result, duration };
      } catch (callbackError) {
        return { result: null, duration };
      }
    }
    
    console.error(`Error measuring accessibility impact for ${label}:`, error);
    return { result: null, duration };
  }
};

/**
 * Performance monitoring for accessibility features
 */
export const AccessibilityPerformanceMonitor = {
  measurements: new Map(),
  
  start(label) {
    if (performance.mark) {
      performance.mark(`${label}-start`);
    }
    this.measurements.set(label, performance.now());
  },
  
  end(label) {
    const startTime = this.measurements.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      
      if (performance.mark && performance.measure) {
        performance.mark(`${label}-end`);
        performance.measure(label, `${label}-start`, `${label}-end`);
      }
      
      // Log slow accessibility operations in development
      if (process.env.NODE_ENV === 'development' && duration > 16) {
        console.warn(`Slow accessibility operation: ${label} took ${duration.toFixed(2)}ms`);
      }
      
      this.measurements.delete(label);
      return duration;
    }
  },
  
  clear() {
    this.measurements.clear();
    if (performance.clearMarks) {
      performance.clearMarks();
    }
    if (performance.clearMeasures) {
      performance.clearMeasures();
    }
  }
};