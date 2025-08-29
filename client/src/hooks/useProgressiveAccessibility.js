import { useEffect, useRef, useCallback } from 'react';
import { 
  getFeatureSupport, 
  progressiveEnhance, 
  enhanceButton, 
  enhanceNavigation,
  enhanceImage,
  enhanceForm
} from '../utils/progressiveEnhancement';
import { useOptimizedAccessibility } from './useOptimizedAccessibility';

/**
 * Hook for progressive enhancement of accessibility features
 * Ensures core functionality works without JavaScript while adding enhancements when available
 * @param {Object} options - Configuration options
 * @returns {Object} Progressive accessibility utilities
 */
export const useProgressiveAccessibility = (options = {}) => {
  const {
    enableEnhancements = true,
    fallbackMode = false,
    logFeatureSupport = process.env.NODE_ENV === 'development'
  } = options;

  const featureSupport = useRef(null);
  const enhancedElements = useRef(new Set());
  const { setAriaAttributes, manageFocus, getFocusRingClasses } = useOptimizedAccessibility();

  // Initialize feature support detection
  useEffect(() => {
    featureSupport.current = getFeatureSupport();
    
    if (logFeatureSupport) {
      console.log('Progressive Accessibility - Feature Support:', featureSupport.current);
    }
  }, [logFeatureSupport]);

  // Ensure feature support is available immediately
  if (!featureSupport.current) {
    featureSupport.current = getFeatureSupport();
  }

  /**
   * Create progressively enhanced button
   * @param {Object} config - Button configuration
   * @returns {Object} Button props and handlers
   */
  const createEnhancedButton = useCallback((config = {}) => {
    const {
      onClick,
      onKeyDown,
      ariaLabel,
      ariaDescribedBy,
      className = '',
      disabled = false,
      enhanceVisuals = true
    } = config;

    // Base props that work without JavaScript
    const baseProps = {
      type: 'button',
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      className: `${className} ${getFocusRingClasses()}`.trim(),
      disabled
    };

    // Progressive enhancements
    const enhancedProps = enableEnhancements && featureSupport.current?.javascript ? {
      onClick: (event) => {
        // Enhanced click handling with performance optimization
        if (onClick) {
          requestAnimationFrame(() => onClick(event));
        }
      },
      onKeyDown: onKeyDown || ((event) => {
        if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
          event.preventDefault();
          if (onClick) {
            requestAnimationFrame(() => onClick(event));
          }
        }
      }),
      // Enhanced visual feedback
      ...(enhanceVisuals && {
        onMouseDown: (event) => {
          if (!featureSupport.current?.reducedMotion) {
            event.currentTarget.style.transform = 'scale(0.98)';
          }
        },
        onMouseUp: (event) => {
          if (!featureSupport.current?.reducedMotion) {
            event.currentTarget.style.transform = 'scale(1)';
          }
        },
        onMouseLeave: (event) => {
          if (!featureSupport.current?.reducedMotion) {
            event.currentTarget.style.transform = 'scale(1)';
          }
        }
      })
    } : {};

    return { ...baseProps, ...enhancedProps };
  }, [enableEnhancements, getFocusRingClasses]);

  /**
   * Create progressively enhanced navigation
   * @param {Object} config - Navigation configuration
   * @returns {Object} Navigation props and utilities
   */
  const createEnhancedNavigation = useCallback((config = {}) => {
    const {
      ariaLabel = 'Main navigation',
      enableKeyboardNav = true,
      enableSkipLinks = true,
      className = ''
    } = config;

    // Base props that work without JavaScript
    const baseProps = {
      role: 'navigation',
      'aria-label': ariaLabel,
      className
    };

    // Progressive enhancements
    const enhancedProps = enableEnhancements && featureSupport.current?.javascript ? {
      onKeyDown: enableKeyboardNav ? (event) => {
        const links = event.currentTarget.querySelectorAll('a, button');
        const currentIndex = Array.from(links).indexOf(event.target);
        let nextIndex;

        switch (event.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            event.preventDefault();
            nextIndex = (currentIndex + 1) % links.length;
            manageFocus(links[nextIndex]);
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            event.preventDefault();
            nextIndex = (currentIndex - 1 + links.length) % links.length;
            manageFocus(links[nextIndex]);
            break;
          case 'Home':
            event.preventDefault();
            manageFocus(links[0]);
            break;
          case 'End':
            event.preventDefault();
            manageFocus(links[links.length - 1]);
            break;
        }
      } : undefined
    } : {};

    return { ...baseProps, ...enhancedProps };
  }, [enableEnhancements, manageFocus]);

  /**
   * Create progressively enhanced image
   * @param {Object} config - Image configuration
   * @returns {Object} Image props
   */
  const createEnhancedImage = useCallback((config = {}) => {
    const {
      src,
      alt,
      className = '',
      lazy = true,
      webpFallback = true,
      sizes
    } = config;

    // Base props that work without JavaScript
    const baseProps = {
      src,
      alt,
      className
    };

    // Progressive enhancements
    const enhancedProps = enableEnhancements && featureSupport.current?.javascript ? {
      // Enhanced lazy loading
      ...(lazy && featureSupport.current?.intersectionObserver && {
        loading: 'lazy'
      }),
      // Enhanced responsive images
      ...(sizes && {
        sizes: sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      }),
      // Enhanced format support
      ...(webpFallback && src.match(/\.(jpg|png)$/i) && {
        onError: (event) => {
          // Fallback to original format if WebP fails
          if (event.target.src.includes('.webp')) {
            event.target.src = src;
          }
        }
      })
    } : {};

    return { ...baseProps, ...enhancedProps };
  }, [enableEnhancements]);

  /**
   * Create progressively enhanced form
   * @param {Object} config - Form configuration
   * @returns {Object} Form props and utilities
   */
  const createEnhancedForm = useCallback((config = {}) => {
    const {
      onSubmit,
      enableValidation = true,
      enableAutoSave = false,
      className = ''
    } = config;

    // Base props that work without JavaScript
    const baseProps = {
      className,
      noValidate: enableEnhancements && featureSupport.current?.javascript // Only disable native validation if JS is available
    };

    // Progressive enhancements
    const enhancedProps = enableEnhancements && featureSupport.current?.javascript ? {
      onSubmit: (event) => {
        if (enableValidation) {
          const form = event.currentTarget;
          const inputs = form.querySelectorAll('input, textarea, select');
          let isValid = true;

          inputs.forEach(input => {
            if (!input.checkValidity()) {
              isValid = false;
              setAriaAttributes(input, { 'aria-invalid': 'true' });
            } else {
              setAriaAttributes(input, { 'aria-invalid': 'false' });
            }
          });

          if (!isValid) {
            event.preventDefault();
            const firstInvalid = form.querySelector('[aria-invalid="true"]');
            if (firstInvalid) {
              manageFocus(firstInvalid);
            }
            return;
          }
        }

        if (onSubmit) {
          onSubmit(event);
        }
      }
    } : {
      onSubmit
    };

    return { ...baseProps, ...enhancedProps };
  }, [enableEnhancements, setAriaAttributes, manageFocus]);

  /**
   * Enhance existing DOM element with progressive accessibility
   * @param {HTMLElement} element - Element to enhance
   * @param {string} type - Type of enhancement ('button', 'nav', 'img', 'form')
   * @param {Object} config - Enhancement configuration
   */
  const enhanceElement = useCallback((element, type, config = {}) => {
    if (!element || enhancedElements.current.has(element)) return;

    // Mark as enhanced to prevent duplicate enhancements
    enhancedElements.current.add(element);

    if (!enableEnhancements || fallbackMode) {
      return; // Skip enhancements in fallback mode
    }

    switch (type) {
      case 'button':
        enhanceButton(element, config);
        break;
      case 'nav':
        enhanceNavigation(element, config);
        break;
      case 'img':
        enhanceImage(element, config);
        break;
      case 'form':
        enhanceForm(element, config);
        break;
      default:
        console.warn(`Unknown enhancement type: ${type}`);
    }
  }, [enableEnhancements, fallbackMode]);

  /**
   * Create fallback for when JavaScript is disabled
   * @param {string} message - Fallback message
   * @returns {Object} Noscript element props
   */
  const createNoScriptFallback = useCallback((message = 'This feature requires JavaScript to be enabled.') => {
    return {
      dangerouslySetInnerHTML: {
        __html: `<noscript><div class="noscript-fallback bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4" role="alert">${message}</div></noscript>`
      }
    };
  }, []);

  /**
   * Check if a specific feature is supported
   * @param {string} feature - Feature name
   * @returns {boolean} Is supported
   */
  const isFeatureSupported = useCallback((feature) => {
    return featureSupport.current?.[feature] ?? false;
  }, []);

  /**
   * Get graceful degradation strategy for a feature
   * @param {string} feature - Feature name
   * @returns {string} Degradation strategy
   */
  const getDegradationStrategy = useCallback((feature) => {
    const strategies = {
      intersectionObserver: 'Load all images immediately',
      requestAnimationFrame: 'Use setTimeout fallback',
      customElements: 'Use standard HTML elements',
      ariaLive: 'Use static text announcements',
      focusVisible: 'Use standard focus indicators',
      reducedMotion: 'Assume motion is preferred'
    };

    return strategies[feature] || 'Use basic functionality';
  }, []);

  // Cleanup enhanced elements on unmount
  useEffect(() => {
    return () => {
      enhancedElements.current.clear();
    };
  }, []);

  return {
    // Feature detection
    featureSupport: featureSupport.current,
    isFeatureSupported,
    getDegradationStrategy,
    
    // Enhanced component creators
    createEnhancedButton,
    createEnhancedNavigation,
    createEnhancedImage,
    createEnhancedForm,
    
    // Element enhancement
    enhanceElement,
    
    // Fallback utilities
    createNoScriptFallback,
    
    // Progressive enhancement wrapper
    progressiveEnhance: useCallback((enhanced, fallback, requiredFeatures) => 
      progressiveEnhance(enhanced, fallback, requiredFeatures), [])
  };
};

export default useProgressiveAccessibility;