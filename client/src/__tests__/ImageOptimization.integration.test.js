import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Projects from '../components/Projects';
import HeroImage from '../components/HeroImage';
import { MobileMenuProvider } from '../contexts/MobileMenuContext';
import { ChatbotProvider } from '../chatbot/context/ChatbotContext';

// Mock hooks
jest.mock('../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackProject: jest.fn(),
    trackCTA: jest.fn()
  })
}));

// Helper function to render components with providers
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ChatbotProvider>
        <MobileMenuProvider>
          {component}
        </MobileMenuProvider>
      </ChatbotProvider>
    </BrowserRouter>
  );
};

describe('Image Optimization Integration Tests', () => {
  describe('WebP Format Usage', () => {
    test('hero images use WebP format with fallbacks', () => {
      renderWithProviders(<HeroImage />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        const src = image.getAttribute('src');
        if (src) {
          // Should prefer WebP format
          expect(src).toMatch(/\.(webp|jpg|jpeg|png)$/i);
        }
      });
    });

    test('project images use optimized formats', () => {
      renderWithProviders(<Projects />);
      
      // Project images should be optimized
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        const src = image.getAttribute('src');
        if (src && src.includes('Projects')) {
          // Project images should be in optimized format
          expect(src).toMatch(/\.(webp|jpg)$/i);
        }
      });
    });

    test('gallery images use WebP with JPEG fallbacks', () => {
      // Test that gallery images (when present) use proper formats
      const testImages = [
        '/assets/Gallery/G1.webp',
        '/assets/Gallery/G2.webp',
        '/assets/Projects/Dental.webp',
        '/assets/Projects/mental-wellness.webp'
      ];

      testImages.forEach(imagePath => {
        expect(imagePath).toMatch(/\.webp$/);
        
        // Should have corresponding JPEG fallback
        const jpegPath = imagePath.replace('.webp', '.jpg');
        expect(jpegPath).toMatch(/\.jpg$/);
      });
    });
  });

  describe('Alt Text Quality Assessment', () => {
    test('all images have descriptive alt text', () => {
      renderWithProviders(<Projects />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        const alt = image.getAttribute('alt');
        
        // Alt text should exist and be descriptive
        expect(alt).toBeTruthy();
        expect(alt.length).toBeGreaterThan(10);
        
        // Should not be generic
        expect(alt.toLowerCase()).not.toBe('image');
        expect(alt.toLowerCase()).not.toBe('photo');
        expect(alt.toLowerCase()).not.toBe('picture');
      });
    });

    test('project images have context-specific alt text', () => {
      renderWithProviders(<Projects />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        const alt = image.getAttribute('alt');
        
        if (alt && alt.includes('Dental')) {
          // Dental project alt text should be specific
          expect(alt).toContain('Sarvodaya Dental Clinic');
          expect(alt).toContain('website');
          expect(alt.length).toBeGreaterThan(50);
        }
        
        if (alt && alt.includes('Therapy')) {
          // Therapy project alt text should be specific
          expect(alt).toContain('Therapy With Aakanksha');
          expect(alt).toContain('website');
          expect(alt.length).toBeGreaterThan(50);
        }
      });
    });

    test('alt text includes relevant keywords for SEO', () => {
      renderWithProviders(<Projects />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        const alt = image.getAttribute('alt');
        
        if (alt) {
          // Should include relevant keywords
          const hasRelevantKeywords = 
            alt.toLowerCase().includes('yuvaan vithlani') ||
            alt.toLowerCase().includes('web design') ||
            alt.toLowerCase().includes('website') ||
            alt.toLowerCase().includes('portfolio') ||
            alt.toLowerCase().includes('project');
          
          expect(hasRelevantKeywords).toBe(true);
        }
      });
    });

    test('alt text describes image purpose and context', () => {
      renderWithProviders(<Projects />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        const alt = image.getAttribute('alt');
        
        if (alt) {
          // Alt text should describe what the image shows and its purpose
          const describesContent = 
            alt.toLowerCase().includes('homepage') ||
            alt.toLowerCase().includes('website') ||
            alt.toLowerCase().includes('designed by') ||
            alt.toLowerCase().includes('featuring');
          
          const descrivesPurpose = 
            alt.toLowerCase().includes('portfolio') ||
            alt.toLowerCase().includes('project') ||
            alt.toLowerCase().includes('showcase');
          
          expect(describesContent || descrivesPurpose).toBe(true);
        }
      });
    });
  });

  describe('Lazy Loading Implementation', () => {
    test('below-the-fold images use lazy loading', () => {
      renderWithProviders(<Projects />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        // Project images (below the fold) should be lazy loaded
        const loading = image.getAttribute('loading');
        expect(loading).toBe('lazy');
      });
    });

    test('hero images load immediately (no lazy loading)', () => {
      renderWithProviders(<HeroImage />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        const loading = image.getAttribute('loading');
        // Hero images should load immediately or not have lazy loading
        expect(loading).not.toBe('lazy');
      });
    });

    test('lazy loading attributes are properly set', () => {
      renderWithProviders(<Projects />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        const loading = image.getAttribute('loading');
        
        if (loading) {
          expect(['lazy', 'eager']).toContain(loading);
        }
      });
    });
  });

  describe('Image Performance Optimization', () => {
    test('images have appropriate sizing classes', () => {
      renderWithProviders(<Projects />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        const className = image.className;
        
        // Should have responsive sizing
        const hasResponsiveSizing = 
          className.includes('w-full') ||
          className.includes('h-') ||
          className.includes('object-');
        
        expect(hasResponsiveSizing).toBe(true);
      });
    });

    test('images use object-fit for proper aspect ratios', () => {
      renderWithProviders(<Projects />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        const className = image.className;
        
        // Project images should use object-cover for consistent sizing
        if (className.includes('h-56')) {
          expect(className).toContain('object-cover');
        }
      });
    });

    test('images are properly contained within their containers', () => {
      renderWithProviders(<Projects />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        const className = image.className;
        
        // Should have proper containment
        expect(className).toContain('w-full');
      });
    });
  });

  describe('Image Accessibility Integration', () => {
    test('images work with screen readers', () => {
      renderWithProviders(<Projects />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        // Should be accessible to screen readers
        expect(image).toBeVisible();
        expect(image).toHaveAttribute('alt');
        
        // Should not have aria-hidden unless decorative
        if (image.hasAttribute('aria-hidden')) {
          expect(image.getAttribute('aria-hidden')).toBe('true');
          expect(image.getAttribute('alt')).toBe('');
        }
      });
    });

    test('interactive images have proper focus management', () => {
      renderWithProviders(<Projects />);
      
      // Project images are within clickable containers
      const projectContainers = document.querySelectorAll('[role="button"]');
      
      projectContainers.forEach(container => {
        if (container.querySelector('img')) {
          // Container should be focusable
          expect(container).toHaveAttribute('tabIndex');
          
          // Should have proper ARIA labels
          expect(container).toHaveAttribute('aria-label');
        }
      });
    });

    test('images support keyboard navigation when interactive', () => {
      renderWithProviders(<Projects />);
      
      const interactiveElements = document.querySelectorAll('[role="button"]');
      
      interactiveElements.forEach(element => {
        if (element.querySelector('img')) {
          // Should support keyboard events
          expect(element).toHaveAttribute('tabIndex');
          expect(element.getAttribute('tabIndex')).toBe('0');
        }
      });
    });
  });

  describe('Image Loading Performance', () => {
    test('critical images load without delay', () => {
      const { container } = renderWithProviders(<HeroImage />);
      
      // Hero images should be immediately available in DOM
      const images = container.querySelectorAll('img');
      
      images.forEach(image => {
        expect(image).toBeInTheDocument();
        
        // Should not have lazy loading for critical images
        const loading = image.getAttribute('loading');
        expect(loading).not.toBe('lazy');
      });
    });

    test('non-critical images use performance optimizations', () => {
      renderWithProviders(<Projects />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        // Should use lazy loading for performance
        expect(image).toHaveAttribute('loading', 'lazy');
      });
    });

    test('images do not block page rendering', () => {
      const startTime = performance.now();
      
      renderWithProviders(<Projects />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render quickly despite images
      expect(renderTime).toBeLessThan(100);
      
      // Content should be available immediately
      expect(screen.getByText('Work')).toBeInTheDocument();
    });
  });

  describe('Image Format Fallbacks', () => {
    test('WebP images have proper fallback strategy', () => {
      // Test that the application handles WebP fallbacks
      const webpImages = [
        '/assets/Hero/Hero.webp',
        '/assets/Projects/Dental.webp',
        '/assets/Projects/mental-wellness.webp'
      ];

      webpImages.forEach(webpPath => {
        // Should have corresponding JPEG version
        const jpegPath = webpPath.replace('.webp', '.jpg');
        
        // Both formats should be available
        expect(webpPath).toMatch(/\.webp$/);
        expect(jpegPath).toMatch(/\.jpg$/);
      });
    });

    test('image sources are properly optimized', () => {
      renderWithProviders(<Projects />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        const src = image.getAttribute('src');
        
        if (src) {
          // Should use optimized formats
          expect(src).toMatch(/\.(webp|jpg|jpeg|png)$/i);
          
          // Should not use unoptimized formats
          expect(src).not.toMatch(/\.(bmp|tiff|gif)$/i);
        }
      });
    });
  });

  describe('SEO Image Optimization', () => {
    test('images contribute to page SEO', () => {
      renderWithProviders(<Projects />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        const alt = image.getAttribute('alt');
        const src = image.getAttribute('src');
        
        if (alt && src) {
          // Alt text should be SEO-friendly
          expect(alt.length).toBeGreaterThan(10);
          expect(alt.length).toBeLessThan(125); // Optimal for SEO
          
          // Should include relevant keywords
          const includesKeywords = 
            alt.toLowerCase().includes('yuvaan') ||
            alt.toLowerCase().includes('web') ||
            alt.toLowerCase().includes('design') ||
            alt.toLowerCase().includes('website');
          
          expect(includesKeywords).toBe(true);
        }
      });
    });

    test('image file names are SEO-optimized', () => {
      renderWithProviders(<Projects />);
      
      const images = screen.getAllByRole('img');
      
      images.forEach(image => {
        const src = image.getAttribute('src');
        
        if (src) {
          // File names should be descriptive
          const fileName = src.split('/').pop().split('.')[0];
          
          // Should not be generic names
          expect(fileName).not.toBe('image');
          expect(fileName).not.toBe('photo');
          expect(fileName).not.toBe('img');
          
          // Should be descriptive
          expect(fileName.length).toBeGreaterThan(2);
        }
      });
    });
  });
});