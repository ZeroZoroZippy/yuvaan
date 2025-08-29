import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MetaManager from '../components/SEO/MetaManager';
import Navbar from '../components/Navbar';
import OptimizedImage from '../components/OptimizedImage';
import { useOptimizedAccessibility } from '../hooks/useOptimizedAccessibility';
import { AccessibilityPerformanceMonitor } from '../utils/accessibilityPerformance';

// Mock contexts and hooks
jest.mock('../hooks/usePageNavigation', () => ({
  usePageNavigation: () => ({
    navigateWithTransition: jest.fn()
  })
}));

jest.mock('../contexts/MobileMenuContext', () => ({
  useMobileMenu: () => ({
    isOpen: false,
    toggleMenu: jest.fn(),
    closeMenu: jest.fn()
  })
}));

jest.mock('../chatbot/context/ChatbotContext', () => ({
  useChatbot: () => ({
    openChatbot: jest.fn()
  })
}));

jest.mock('../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackCTA: jest.fn(),
    trackNavigation: jest.fn(),
    trackChatbot: jest.fn()
  })
}));

// Test component using optimized accessibility
const TestAccessibilityComponent = () => {
  const { setAriaAttributes, manageFocus, getFocusRingClasses } = useOptimizedAccessibility();
  const buttonRef = React.useRef(null);

  const handleClick = () => {
    if (buttonRef.current) {
      setAriaAttributes(buttonRef.current, {
        'aria-pressed': 'true',
        'aria-describedby': 'test-description'
      });
      manageFocus(buttonRef.current);
    }
  };

  return (
    <div>
      <button
        ref={buttonRef}
        onClick={handleClick}
        className={getFocusRingClasses()}
        data-testid="accessibility-test-button"
      >
        Test Button
      </button>
      <div id="test-description">Button description</div>
    </div>
  );
};

describe('Accessibility Performance Tests', () => {
  beforeEach(() => {
    // Clear performance measurements
    AccessibilityPerformanceMonitor.clear();
    
    // Mock performance API
    global.performance = {
      ...global.performance,
      now: jest.fn(() => Date.now()),
      mark: jest.fn(),
      measure: jest.fn(),
      clearMarks: jest.fn(),
      clearMeasures: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('MetaManager Performance', () => {
    it('should render meta tags without blocking', async () => {
      const startTime = performance.now();
      
      render(
        <HelmetProvider>
          <MemoryRouter>
            <MetaManager
              title="Test Page"
              description="Test description for performance testing"
              keywords="test, performance, accessibility"
            >
              <div>Test content</div>
            </MetaManager>
          </MemoryRouter>
        </HelmetProvider>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Meta tag injection should be fast (under 50ms)
      expect(renderTime).toBeLessThan(50);
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should memoize expensive computations', () => {
      const TestComponent = () => {
        const [count, setCount] = React.useState(0);
        return (
          <HelmetProvider>
            <MemoryRouter>
              <MetaManager
                title="Test Page"
                description="Test description"
              >
                <div>
                  <span data-testid="count">{count}</span>
                  <button onClick={() => setCount(c => c + 1)}>Increment</button>
                </div>
              </MetaManager>
            </MemoryRouter>
          </HelmetProvider>
        );
      };

      render(<TestComponent />);
      
      const button = screen.getByText('Increment');
      const startTime = performance.now();
      
      // Multiple re-renders should not cause expensive recalculations
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      const endTime = performance.now();
      const rerenderTime = endTime - startTime;

      // Re-renders should be fast due to memoization
      expect(rerenderTime).toBeLessThan(20);
      expect(screen.getByTestId('count')).toHaveTextContent('3');
    });
  });

  describe('ARIA Attribute Performance', () => {
    it('should batch ARIA attribute updates', async () => {
      render(<TestAccessibilityComponent />);
      
      const button = screen.getByTestId('accessibility-test-button');
      const startTime = performance.now();
      
      // Multiple rapid clicks should be batched
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(button).toHaveAttribute('aria-pressed', 'true');
      });
      
      const endTime = performance.now();
      const updateTime = endTime - startTime;

      // Batched updates should be efficient (more lenient in test environment)
      expect(updateTime).toBeLessThan(50);
    });

    it('should not block rendering during ARIA updates', async () => {
      const { rerender } = render(<TestAccessibilityComponent />);
      
      const button = screen.getByTestId('accessibility-test-button');
      
      // Measure rendering performance during ARIA updates
      const startTime = performance.now();
      
      fireEvent.click(button);
      rerender(<TestAccessibilityComponent />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Rendering should not be blocked by ARIA updates
      expect(renderTime).toBeLessThan(25);
      expect(button).toBeInTheDocument();
    });
  });

  describe('Focus Management Performance', () => {
    it('should manage focus without blocking rendering', async () => {
      render(<TestAccessibilityComponent />);
      
      const button = screen.getByTestId('accessibility-test-button');
      const startTime = performance.now();
      
      // Focus management should be non-blocking
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(document.activeElement).toBe(button);
      });
      
      const endTime = performance.now();
      const focusTime = endTime - startTime;

      // Focus management should be fast (more lenient in test environment)
      expect(focusTime).toBeLessThan(40);
    });

    it('should handle rapid focus changes efficiently', async () => {
      render(
        <div>
          <TestAccessibilityComponent />
          <button data-testid="second-button">Second Button</button>
        </div>
      );
      
      const firstButton = screen.getByTestId('accessibility-test-button');
      const secondButton = screen.getByTestId('second-button');
      
      const startTime = performance.now();
      
      // Rapid focus changes
      fireEvent.click(firstButton);
      fireEvent.click(secondButton);
      fireEvent.click(firstButton);
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Multiple focus changes should be handled efficiently
      expect(totalTime).toBeLessThan(40);
    });
  });

  describe('Navbar Accessibility Performance', () => {
    it('should render navbar with accessibility features without performance impact', () => {
      const startTime = performance.now();
      
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Navbar with accessibility features should render quickly
      expect(renderTime).toBeLessThan(100);
      
      // Verify accessibility features are present
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
      
      const menuButton = screen.getByLabelText(/open navigation menu/i);
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should handle keyboard interactions without performance degradation', async () => {
      render(
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      );
      
      const menuButton = screen.getByLabelText(/open navigation menu/i);
      const startTime = performance.now();
      
      // Simulate keyboard interactions
      fireEvent.keyDown(menuButton, { key: 'Enter' });
      fireEvent.keyDown(menuButton, { key: ' ' });
      fireEvent.keyDown(menuButton, { key: 'Escape' });
      
      const endTime = performance.now();
      const interactionTime = endTime - startTime;

      // Keyboard interactions should be responsive
      expect(interactionTime).toBeLessThan(30);
    });
  });

  describe('Image Optimization Performance', () => {
    it('should render optimized images without blocking', () => {
      const startTime = performance.now();
      
      render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image for performance testing"
          lazy={true}
        />
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Image rendering should be fast
      expect(renderTime).toBeLessThan(20);
      
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('loading', 'lazy');
      expect(img).toHaveAttribute('alt', 'Test image for performance testing');
    });

    it('should handle multiple images efficiently', () => {
      const startTime = performance.now();
      
      render(
        <div>
          {Array.from({ length: 10 }, (_, i) => (
            <OptimizedImage
              key={i}
              src={`/test-image-${i}.jpg`}
              alt={`Test image ${i}`}
              lazy={true}
            />
          ))}
        </div>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Multiple images should render efficiently
      expect(renderTime).toBeLessThan(50);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(10);
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });
  });

  describe('Performance Monitoring', () => {
    it('should track accessibility performance metrics', () => {
      const label = 'test-accessibility-feature';
      
      AccessibilityPerformanceMonitor.start(label);
      
      // Simulate some work
      const start = Date.now();
      while (Date.now() - start < 10) {
        // Busy wait for 10ms
      }
      
      const duration = AccessibilityPerformanceMonitor.end(label);
      
      expect(duration).toBeGreaterThan(0);
      expect(duration).toBeLessThan(50); // Should complete quickly
    });

    it('should clear performance measurements', () => {
      AccessibilityPerformanceMonitor.start('test1');
      AccessibilityPerformanceMonitor.start('test2');
      
      expect(AccessibilityPerformanceMonitor.measurements.size).toBe(2);
      
      AccessibilityPerformanceMonitor.clear();
      
      expect(AccessibilityPerformanceMonitor.measurements.size).toBe(0);
    });
  });

  describe('Memory Usage', () => {
    it('should not create memory leaks with accessibility features', () => {
      const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      // Render and unmount multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<TestAccessibilityComponent />);
        unmount();
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      // Memory usage should not grow significantly
      if (performance.memory) {
        const memoryGrowth = finalMemory - initialMemory;
        expect(memoryGrowth).toBeLessThan(1024 * 1024); // Less than 1MB growth
      }
    });
  });
});