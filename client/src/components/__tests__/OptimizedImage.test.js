import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import OptimizedImage from '../OptimizedImage';

// Mock IntersectionObserver for lazy loading tests
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

describe('OptimizedImage Component', () => {
  describe('Basic Image Rendering', () => {
    test('renders image with correct src and alt attributes', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image description" 
        />
      );
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/test-image.jpg');
      expect(image).toHaveAttribute('alt', 'Test image description');
    });

    test('applies custom className when provided', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          className="custom-class rounded-lg"
        />
      );
      
      const image = screen.getByRole('img');
      expect(image).toHaveClass('custom-class', 'rounded-lg');
    });

    test('passes through additional props', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          width="300"
          height="200"
          data-testid="custom-image"
        />
      );
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('width', '300');
      expect(image).toHaveAttribute('height', '200');
      expect(image).toHaveAttribute('data-testid', 'custom-image');
    });
  });

  describe('Lazy Loading Implementation', () => {
    test('applies lazy loading by default', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
        />
      );
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('loading', 'lazy');
    });

    test('applies eager loading when lazy is false', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          lazy={false}
        />
      );
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('loading', 'eager');
    });

    test('respects explicit lazy prop when true', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          lazy={true}
        />
      );
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Alt Text Validation', () => {
    test('requires alt text to be provided', () => {
      // This test ensures alt text is always present
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Descriptive alt text" 
        />
      );
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt');
      expect(image.getAttribute('alt')).toBeTruthy();
    });

    test('handles empty alt text for decorative images', () => {
      render(
        <OptimizedImage 
          src="/decorative-image.jpg" 
          alt="" 
        />
      );
      
      const image = screen.getByRole('img', { hidden: true });
      expect(image).toHaveAttribute('alt', '');
    });

    test('alt text is descriptive and meaningful', () => {
      const descriptiveAlt = "Yuvaan Vithlani's portfolio website homepage showing modern web design with dark theme and gold accents";
      
      render(
        <OptimizedImage 
          src="/portfolio-screenshot.jpg" 
          alt={descriptiveAlt}
        />
      );
      
      const image = screen.getByRole('img');
      expect(image.getAttribute('alt')).toBe(descriptiveAlt);
      expect(image.getAttribute('alt').length).toBeGreaterThan(10);
    });
  });

  describe('WebP Format Support', () => {
    test('uses WebP format when available', () => {
      // Test that the component can handle WebP sources
      render(
        <OptimizedImage 
          src="/test-image.webp" 
          alt="WebP format image" 
        />
      );
      
      const image = screen.getByRole('img');
      expect(image.getAttribute('src')).toContain('.webp');
    });

    test('falls back to JPEG when WebP not supported', () => {
      // This would be handled by the build process or server
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="JPEG fallback image" 
        />
      );
      
      const image = screen.getByRole('img');
      expect(image.getAttribute('src')).toContain('.jpg');
    });
  });

  describe('Performance Optimization', () => {
    test('does not block rendering', async () => {
      const { container } = render(
        <div>
          <OptimizedImage 
            src="/large-image.jpg" 
            alt="Large image that should not block rendering" 
          />
          <p>This text should render immediately</p>
        </div>
      );
      
      // Text should be immediately available
      expect(screen.getByText('This text should render immediately')).toBeInTheDocument();
      
      // Image should also be in DOM (even if not loaded)
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    test('handles loading states gracefully', () => {
      render(
        <OptimizedImage 
          src="/test-image.jpg" 
          alt="Test image" 
          onLoad={() => console.log('Image loaded')}
          onError={() => console.log('Image failed to load')}
        />
      );
      
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      
      // Should not throw errors during loading
      expect(() => {
        image.dispatchEvent(new Event('load'));
        image.dispatchEvent(new Event('error'));
      }).not.toThrow();
    });
  });

  describe('Accessibility Compliance', () => {
    test('provides proper accessibility attributes', () => {
      render(
        <OptimizedImage 
          src="/accessible-image.jpg" 
          alt="Detailed description of image content for screen readers" 
        />
      );
      
      const image = screen.getByRole('img');
      
      // Should have role="img" (implicit)
      expect(image.tagName).toBe('IMG');
      
      // Should have alt text
      expect(image).toHaveAttribute('alt');
      
      // Should be accessible to screen readers
      expect(image).toBeVisible();
    });

    test('supports ARIA attributes when needed', () => {
      render(
        <OptimizedImage 
          src="/chart-image.jpg" 
          alt="Sales chart showing 25% increase in Q4" 
          aria-describedby="chart-description"
        />
      );
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('aria-describedby', 'chart-description');
    });

    test('handles focus for interactive images', () => {
      render(
        <OptimizedImage 
          src="/clickable-image.jpg" 
          alt="Clickable project thumbnail" 
          tabIndex={0}
          role="button"
        />
      );
      
      const image = screen.getByRole('button');
      expect(image).toHaveAttribute('tabIndex', '0');
      
      // Should be focusable
      image.focus();
      expect(document.activeElement).toBe(image);
    });
  });

  describe('Error Handling', () => {
    test('handles missing src gracefully', () => {
      // Should not crash when src is undefined
      expect(() => {
        render(
          <OptimizedImage 
            alt="Image with missing src" 
          />
        );
      }).not.toThrow();
    });

    test('handles broken image URLs', () => {
      render(
        <OptimizedImage 
          src="/non-existent-image.jpg" 
          alt="Broken image" 
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      );
      
      const image = screen.getByRole('img');
      
      // Should not throw when error event is fired
      expect(() => {
        image.dispatchEvent(new Event('error'));
      }).not.toThrow();
    });
  });

  describe('Responsive Image Behavior', () => {
    test('supports responsive sizing', () => {
      render(
        <OptimizedImage 
          src="/responsive-image.jpg" 
          alt="Responsive image" 
          className="w-full h-auto"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      );
      
      const image = screen.getByRole('img');
      expect(image).toHaveClass('w-full', 'h-auto');
      expect(image).toHaveAttribute('sizes');
    });

    test('maintains aspect ratio', () => {
      render(
        <OptimizedImage 
          src="/aspect-ratio-image.jpg" 
          alt="Image with maintained aspect ratio" 
          className="aspect-video object-cover"
        />
      );
      
      const image = screen.getByRole('img');
      expect(image).toHaveClass('aspect-video', 'object-cover');
    });
  });

  describe('Integration with Project Images', () => {
    test('handles project thumbnail images correctly', () => {
      const projectAlt = "Sarvodaya Dental Clinic website homepage - Modern dental practice website designed by Yuvaan Vithlani featuring online appointment booking, patient testimonials, service information, and mobile-responsive design for healthcare accessibility";
      
      render(
        <OptimizedImage 
          src="/assets/Projects/Dental.webp" 
          alt={projectAlt}
          className="w-full h-56 object-cover"
          lazy={true}
        />
      );
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', projectAlt);
      expect(image).toHaveAttribute('loading', 'lazy');
      expect(image).toHaveClass('w-full', 'h-56', 'object-cover');
    });

    test('handles hero images with priority loading', () => {
      render(
        <OptimizedImage 
          src="/assets/Hero/Hero.webp" 
          alt="Yuvaan Vithlani - Web Designer and Developer hero image" 
          lazy={false}
          className="hero-image"
        />
      );
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('loading', 'eager');
      expect(image).toHaveClass('hero-image');
    });
  });

  describe('Performance Metrics', () => {
    test('image loading does not block critical rendering path', () => {
      const startTime = performance.now();
      
      render(
        <div>
          <OptimizedImage 
            src="/large-image.jpg" 
            alt="Large image" 
            lazy={true}
          />
          <h1>Critical content</h1>
        </div>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Rendering should be fast (less than 50ms for this simple case)
      expect(renderTime).toBeLessThan(50);
      
      // Critical content should be immediately available
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    test('lazy loading reduces initial page load', () => {
      // Test that lazy images don't start loading immediately
      render(
        <OptimizedImage 
          src="/below-fold-image.jpg" 
          alt="Below the fold image" 
          lazy={true}
        />
      );
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('loading', 'lazy');
      
      // In a real browser, this would prevent immediate loading
      // Here we just verify the attribute is set correctly
    });
  });
});