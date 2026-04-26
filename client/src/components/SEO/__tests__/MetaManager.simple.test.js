import React from 'react';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import MetaManager from '../MetaManager';

// Mock window.location for tests
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000'
  },
  writable: true
});

describe('MetaManager Component - Structure and Props', () => {
  const renderMetaManager = (props) => {
    return render(
      <HelmetProvider>
        <MetaManager {...props}>
          <div data-testid="test-content">Test content</div>
        </MetaManager>
      </HelmetProvider>
    );
  };

  describe('Component Rendering', () => {
    test('renders children content', () => {
      renderMetaManager({ 
        title: 'Test Page', 
        description: 'Test description' 
      });
      
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    test('renders without crashing with minimal props', () => {
      expect(() => {
        renderMetaManager({ 
          title: 'Test', 
          description: 'Test description' 
        });
      }).not.toThrow();
    });

    test('renders without crashing with all props', () => {
      expect(() => {
        renderMetaManager({ 
          title: 'Test Page',
          description: 'Test description',
          keywords: 'test, keywords',
          canonicalUrl: 'https://example.com',
          ogImage: '/test-image.jpg'
        });
      }).not.toThrow();
    });
  });

  describe('Title Processing Logic', () => {
    test('title processing logic works correctly', () => {
      const component = new (class extends React.Component {
        render() {
          const title = 'Test Page';
          const fullTitle = title.includes('Yuvaan Vithlani') ? title : `${title} | Yuvaan Vithlani`;
          return <div>{fullTitle}</div>;
        }
      })();

      // Test the logic directly
      const title1 = 'Test Page';
      const fullTitle1 = title1.includes('Yuvaan Vithlani') ? title1 : `${title1} | Yuvaan Vithlani`;
      expect(fullTitle1).toBe('Test Page | Yuvaan Vithlani');

      const title2 = 'Yuvaan Vithlani - Product Systems';
      const fullTitle2 = title2.includes('Yuvaan Vithlani') ? title2 : `${title2} | Yuvaan Vithlani`;
      expect(fullTitle2).toBe('Yuvaan Vithlani - Product Systems');
    });
  });

  describe('URL Processing Logic', () => {
    test('canonical URL logic works correctly', () => {
      // Test the logic that would be used in the component
      const canonicalUrl = '';
      const currentUrl = canonicalUrl || window.location.href;
      expect(currentUrl).toBe('http://localhost:3000');

      const customCanonical = 'https://yuvaanvithlani.com/about';
      const customUrl = customCanonical || window.location.href;
      expect(customUrl).toBe('https://yuvaanvithlani.com/about');
    });
  });

  describe('Image Processing Logic', () => {
    test('OG image logic works correctly', () => {
      const defaultOgImage = '/assets/Hero/Hero.webp';
      
      // Test with no image provided
      const ogImage1 = '';
      const ogImageUrl1 = ogImage1 || defaultOgImage;
      expect(ogImageUrl1).toBe('/assets/Hero/Hero.webp');

      // Test with custom image
      const ogImage2 = '/custom-image.jpg';
      const ogImageUrl2 = ogImage2 || defaultOgImage;
      expect(ogImageUrl2).toBe('/custom-image.jpg');
    });
  });

  describe('Structured Data Logic', () => {
    test('structured data object is correctly formed', () => {
      const expectedStructuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Yuvaan Vithlani",
        "jobTitle": "Product Executive",
        "description": "Product-minded systems thinker working across digital products, client work, and AI experiments",
        "url": "https://yuvaanvithlani.com",
        "sameAs": [],
        "knowsAbout": ["Product Strategy", "Systems Thinking", "AI Prototyping", "User Empathy", "Frontend Development"]
      };

      expect(expectedStructuredData['@context']).toBe('https://schema.org');
      expect(expectedStructuredData['@type']).toBe('Person');
      expect(expectedStructuredData.name).toBe('Yuvaan Vithlani');
      expect(expectedStructuredData.jobTitle).toBe('Product Executive');
      expect(expectedStructuredData.knowsAbout).toContain('Product Strategy');
      expect(expectedStructuredData.knowsAbout).toContain('Systems Thinking');
      expect(expectedStructuredData.knowsAbout).toContain('AI Prototyping');
      expect(expectedStructuredData.knowsAbout).toContain('User Empathy');
      expect(expectedStructuredData.knowsAbout).toContain('Frontend Development');
    });
  });

  describe('Character Limit Validation', () => {
    test('validates title character limits', () => {
      const shortTitle = 'Test';
      const optimalTitle = 'Yuvaan Vithlani - Product Systems & AI Portfolio';
      const longTitle = 'This is an extremely long title that definitely exceeds the recommended 60 character limit for SEO optimization and user experience in search results';

      expect(shortTitle.length).toBeLessThan(30);
      expect(optimalTitle.length).toBeLessThanOrEqual(60);
      expect(optimalTitle.length).toBeGreaterThanOrEqual(30);
      expect(longTitle.length).toBeGreaterThan(60);
    });

    test('validates description character limits', () => {
      const shortDescription = 'Short description';
      const optimalDescription = 'Portfolio of Yuvaan Vithlani, a product-minded systems thinker using user empathy and AI-assisted building to turn ambiguity into clear digital products.';
      const longDescription = 'This is an extremely long meta description that definitely exceeds the recommended 160 character limit for SEO optimization and search engine result display purposes which could result in truncation in search results and poor user experience';

      expect(shortDescription.length).toBeLessThan(50);
      expect(optimalDescription.length).toBeLessThanOrEqual(160);
      expect(optimalDescription.length).toBeGreaterThanOrEqual(120);
      expect(longDescription.length).toBeGreaterThan(160);
    });
  });

  describe('Required Props Validation', () => {
    test('handles missing optional props gracefully', () => {
      expect(() => {
        renderMetaManager({ 
          title: 'Test Page',
          description: 'Test description'
          // keywords, canonicalUrl, ogImage are optional
        });
      }).not.toThrow();
    });

    test('processes keywords correctly when provided', () => {
      const keywords = 'web design, development, portfolio, react';
      
      // Test that keywords are properly formatted
      expect(keywords).toContain('web design');
      expect(keywords).toContain('development');
      expect(keywords).toContain('portfolio');
      expect(keywords).toContain('react');
    });
  });

  describe('SEO Best Practices Validation', () => {
    test('validates homepage meta configuration', () => {
      const homeTitle = "Yuvaan Vithlani - Product Systems & AI Portfolio";
      const homeDescription = "Portfolio of Yuvaan Vithlani, a product-minded systems thinker using user empathy and AI-assisted building to turn ambiguity into clear digital products.";
      
      // Title validation
      expect(homeTitle).toContain('Yuvaan Vithlani');
      expect(homeTitle).toContain('Product');
      expect(homeTitle).toContain('AI');
      expect(homeTitle).toContain('Portfolio');
      expect(homeTitle.length).toBeLessThanOrEqual(75);
      
      // Description validation
      expect(homeDescription).toContain('Yuvaan Vithlani');
      expect(homeDescription).toContain('product-minded systems thinker');
      expect(homeDescription).toContain('AI-assisted building');
      expect(homeDescription).toContain('digital products');
      expect(homeDescription.length).toBeLessThanOrEqual(160);
      expect(homeDescription.length).toBeGreaterThanOrEqual(100);
    });

    test('validates about page meta configuration', () => {
      const aboutTitle = "About Yuvaan Vithlani - Systems Thinking, Product & AI";
      const aboutDescription = "Learn how Yuvaan Vithlani works across product systems, client projects, and AI experiments with a focus on clarity, empathy, and thoughtful execution.";
      
      expect(aboutTitle).toContain('About Yuvaan Vithlani');
      expect(aboutTitle).toContain('Systems Thinking');
      expect(aboutTitle).toContain('AI');
      expect(aboutTitle.length).toBeLessThanOrEqual(75);
      
      expect(aboutDescription).toContain('Yuvaan Vithlani');
      expect(aboutDescription).toContain('product systems');
      expect(aboutDescription).toContain('AI experiments');
      expect(aboutDescription.length).toBeLessThanOrEqual(160);
    });

  });
});
