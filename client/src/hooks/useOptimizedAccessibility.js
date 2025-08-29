import { useCallback, useRef, useEffect } from 'react';
import { 
  debounceAriaUpdates, 
  batchAriaUpdates, 
  optimizedFocus,
  createKeyboardHandler,
  AccessibilityPerformanceMonitor
} from '../utils/accessibilityPerformance';

/**
 * Optimized accessibility hook that ensures features don't impact performance
 * @param {Object} options - Configuration options
 * @returns {Object} Accessibility utilities
 */
export const useOptimizedAccessibility = (options = {}) => {
  const {
    enablePerformanceMonitoring = process.env.NODE_ENV === 'development',
    debounceDelay = 16,
    batchUpdates = true
  } = options;

  const pendingUpdates = useRef([]);
  const updateTimeoutRef = useRef(null);

  // Optimized ARIA attribute setter
  const setAriaAttributes = useCallback((element, attributes) => {
    if (!element || !attributes) return;

    if (enablePerformanceMonitoring) {
      AccessibilityPerformanceMonitor.start('aria-update');
    }

    if (batchUpdates) {
      // Add to pending updates
      pendingUpdates.current.push({ element, attributes });
      
      // Clear existing timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      // Batch updates using requestAnimationFrame
      updateTimeoutRef.current = setTimeout(() => {
        batchAriaUpdates(pendingUpdates.current);
        pendingUpdates.current = [];
        
        if (enablePerformanceMonitoring) {
          AccessibilityPerformanceMonitor.end('aria-update');
        }
      }, debounceDelay);
    } else {
      // Direct update for critical accessibility features
      Object.entries(attributes).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          element.setAttribute(key, value);
        }
      });
      
      if (enablePerformanceMonitoring) {
        AccessibilityPerformanceMonitor.end('aria-update');
      }
    }
  }, [batchUpdates, debounceDelay, enablePerformanceMonitoring]);

  // Optimized focus management
  const manageFocus = useCallback((element, options = {}) => {
    if (enablePerformanceMonitoring) {
      AccessibilityPerformanceMonitor.start('focus-management');
    }

    optimizedFocus(element, options);

    if (enablePerformanceMonitoring) {
      AccessibilityPerformanceMonitor.end('focus-management');
    }
  }, [enablePerformanceMonitoring]);

  // Performance-aware keyboard handler creator
  const createOptimizedKeyboardHandler = useCallback((keyMap, handlerOptions = {}) => {
    return createKeyboardHandler(keyMap, {
      ...handlerOptions,
      onPerformanceIssue: enablePerformanceMonitoring ? (duration) => {
        console.warn(`Keyboard handler took ${duration}ms to execute`);
      } : undefined
    });
  }, [enablePerformanceMonitoring]);

  // Debounced ARIA live announcements
  const announceToScreenReader = useCallback(
    debounceAriaUpdates((message, priority = 'polite') => {
      if (!message) return;

      if (enablePerformanceMonitoring) {
        AccessibilityPerformanceMonitor.start('screen-reader-announcement');
      }

      // Create or get existing live region
      let liveRegion = document.getElementById('accessibility-live-region');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'accessibility-live-region';
        liveRegion.setAttribute('aria-live', priority);
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

      // Update priority if different
      if (liveRegion.getAttribute('aria-live') !== priority) {
        liveRegion.setAttribute('aria-live', priority);
      }

      // Clear and set message
      liveRegion.textContent = '';
      requestAnimationFrame(() => {
        liveRegion.textContent = message;
        
        if (enablePerformanceMonitoring) {
          AccessibilityPerformanceMonitor.end('screen-reader-announcement');
        }
      });
    }, debounceDelay),
    [debounceDelay, enablePerformanceMonitoring]
  );

  // Enhanced focus ring utility with performance optimization
  const getFocusRingClasses = useCallback(() => {
    return 'focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:ring-offset-2 focus:ring-offset-[#161711] focus:ring-opacity-75 transition-shadow duration-150 ease-in-out';
  }, []);

  // Optimized semantic element wrapper
  const createSemanticElement = useCallback((tag, props = {}) => {
    const { children, className = '', ariaLabel, role, ...otherProps } = props;
    
    const semanticProps = {
      className: `${className} ${getFocusRingClasses()}`.trim(),
      ...otherProps
    };

    // Only add ARIA attributes if they provide value
    if (ariaLabel) semanticProps['aria-label'] = ariaLabel;
    if (role) semanticProps.role = role;

    return { tag, props: semanticProps };
  }, [getFocusRingClasses]);

  // Performance monitoring utilities
  const performanceUtils = enablePerformanceMonitoring ? {
    startMeasurement: AccessibilityPerformanceMonitor.start,
    endMeasurement: AccessibilityPerformanceMonitor.end,
    clearMeasurements: AccessibilityPerformanceMonitor.clear,
    measureImpact: async (callback, label) => {
      AccessibilityPerformanceMonitor.start(label);
      const result = await callback();
      const duration = AccessibilityPerformanceMonitor.end(label);
      
      // Log performance impact in development
      if (duration > 16) {
        console.warn(`Accessibility operation "${label}" took ${duration.toFixed(2)}ms`);
      }
      
      return { result, duration };
    }
  } : {
    startMeasurement: () => {},
    endMeasurement: () => {},
    clearMeasurements: () => {},
    measureImpact: async (callback) => ({ result: await callback(), duration: 0 })
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      pendingUpdates.current = [];
      
      if (enablePerformanceMonitoring) {
        AccessibilityPerformanceMonitor.clear();
      }
    };
  }, [enablePerformanceMonitoring]);

  return {
    setAriaAttributes,
    manageFocus,
    createOptimizedKeyboardHandler,
    announceToScreenReader,
    getFocusRingClasses,
    createSemanticElement,
    performanceUtils
  };
};

export default useOptimizedAccessibility;