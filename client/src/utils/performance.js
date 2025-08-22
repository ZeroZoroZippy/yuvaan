// Performance monitoring utilities

export const measurePerformance = () => {
  if (!window.performance) return;

  // Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log(`LCP: ${entry.startTime.toFixed(1)}ms`);
      }
      
      if (entry.entryType === 'first-input') {
        console.log(`FID: ${entry.processingStart - entry.startTime}ms`);
      }
    }
  });

  // Observe Web Vitals
  try {
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
  } catch (e) {
    // Browser doesn't support some metrics
  }

  // Measure CLS (Cumulative Layout Shift)
  let clsValue = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        console.log(`CLS: ${clsValue.toFixed(4)}`);
      }
    }
  }).observe({ entryTypes: ['layout-shift'] });
};

export const trackResourceTiming = () => {
  if (!window.performance || !window.performance.getEntriesByType) return;

  const resources = performance.getEntriesByType('resource');
  const largeResources = resources
    .filter(resource => resource.transferSize > 100000) // > 100KB
    .sort((a, b) => b.transferSize - a.transferSize)
    .slice(0, 5);

  console.group('📊 Largest Resources:');
  largeResources.forEach(resource => {
    console.log(`${resource.name}: ${(resource.transferSize / 1024).toFixed(1)}KB`);
  });
  console.groupEnd();
};

export const measureTTI = () => {
  if (!window.performance) return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        console.log(`FCP: ${entry.startTime.toFixed(1)}ms`);
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['paint'] });
  } catch (e) {
    // Browser doesn't support paint timing
  }
};

// Initialize performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      measurePerformance();
      trackResourceTiming();
      measureTTI();
    }, 1000);
  });
}