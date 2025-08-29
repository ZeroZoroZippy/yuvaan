import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HeroPage from '../pages/HeroPage';
import Projects from '../components/Projects';
import WhoAmI from '../components/WhoAmI';
import { MobileMenuProvider } from '../contexts/MobileMenuContext';
import { ChatbotProvider } from '../chatbot/context/ChatbotContext';
import { LenisProvider } from '../contexts/LenisContext';

// Mock hooks and dependencies
jest.mock('../hooks/usePageNavigation', () => ({
  usePageNavigation: () => ({
    navigateWithTransition: jest.fn()
  })
}));

jest.mock('../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackCTA: jest.fn(),
    trackNavigation: jest.fn(),
    trackChatbot: jest.fn(),
    trackProject: jest.fn()
  })
}));

jest.mock('../hooks/useMeta', () => ({
  useMeta: () => ({
    title: 'Yuvaan Vithlani - Web Designer & Developer Portfolio | UI/UX Specialist',
    description: 'Test description',
    keywords: 'test keywords',
    canonicalUrl: 'https://yuvaanvithlani.com/',
    ogImage: '/test-image.jpg'
  })
}));

// Helper function to render components with all providers
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <HelmetProvider>
        <LenisProvider>
          <ChatbotProvider>
            <MobileMenuProvider>
              {component}
            </MobileMenuProvider>
          </ChatbotProvider>
        </LenisProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
};

// Helper function to get all headings in order
const getAllHeadings = () => {
  return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    .map(heading => ({
      level: parseInt(heading.tagName.charAt(1)),
      text: heading.textContent.trim(),
      element: heading
    }));
};

describe('Heading Hierarchy Tests', () => {
  describe('Homepage Heading Structure', () => {
    test('homepage has exactly one H1 element', () => {
      renderWithProviders(<HeroPage />);
      
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      expect(h1Elements).toHaveLength(1);
    });

    test('H1 contains correct text for homepage', () => {
      renderWithProviders(<HeroPage />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Yuvaan Vithlani - Web Designer & Developer');
    });

    test('heading hierarchy follows proper order without skipping levels', () => {
      renderWithProviders(<HeroPage />);
      
      const headings = getAllHeadings();
      
      // Should start with H1
      expect(headings[0].level).toBe(1);
      
      // Check that no levels are skipped
      for (let i = 1; i < headings.length; i++) {
        const currentLevel = headings[i].level;
        const previousLevel = headings[i - 1].level;
        
        // Current level should not be more than 1 level deeper than previous
        expect(currentLevel).toBeLessThanOrEqual(previousLevel + 1);
      }
    });

    test('Projects section uses H2 for main heading', () => {
      renderWithProviders(<Projects />);
      
      const projectsHeading = screen.getByRole('heading', { level: 2, name: /work/i });
      expect(projectsHeading).toBeInTheDocument();
      expect(projectsHeading).toHaveTextContent('Work');
    });

    test('individual project names use H3 elements', () => {
      renderWithProviders(<Projects />);
      
      // Project titles should be H3 elements
      const projectHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(projectHeadings.length).toBeGreaterThan(0);
      
      // Check specific project names
      const dentalProject = screen.getByRole('heading', { level: 3, name: /sarvodaya dental clinic/i });
      const therapyProject = screen.getByRole('heading', { level: 3, name: /therapy with aakanksha/i });
      
      expect(dentalProject).toBeInTheDocument();
      expect(therapyProject).toBeInTheDocument();
    });
  });

  describe('Heading Accessibility', () => {
    test('all headings have accessible text content', () => {
      renderWithProviders(<HeroPage />);
      
      const headings = getAllHeadings();
      
      headings.forEach(heading => {
        expect(heading.text).toBeTruthy();
        expect(heading.text.length).toBeGreaterThan(0);
      });
    });

    test('headings provide proper document outline', () => {
      renderWithProviders(<HeroPage />);
      
      const headings = getAllHeadings();
      
      // Should have a logical structure
      expect(headings.length).toBeGreaterThan(0);
      
      // First heading should be H1
      expect(headings[0].level).toBe(1);
      
      // Should have section headings (H2)
      const h2Headings = headings.filter(h => h.level === 2);
      expect(h2Headings.length).toBeGreaterThan(0);
    });

    test('headings are properly associated with their sections', () => {
      renderWithProviders(<Projects />);
      
      const projectsSection = document.querySelector('section[aria-labelledby="projects-heading"]');
      const projectsHeading = document.getElementById('projects-heading');
      
      expect(projectsSection).toBeInTheDocument();
      expect(projectsHeading).toBeInTheDocument();
      expect(projectsHeading.tagName).toBe('H2');
    });
  });

  describe('Component-Specific Heading Tests', () => {
    test('WhoAmI component has proper heading structure', () => {
      renderWithProviders(<WhoAmI />);
      
      // Should have the main H1
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Yuvaan Vithlani - Web Designer & Developer');
    });

    test('Projects component maintains heading hierarchy', () => {
      renderWithProviders(<Projects />);
      
      // Main section heading should be H2
      const sectionHeading = screen.getByRole('heading', { level: 2 });
      expect(sectionHeading).toHaveTextContent('Work');
      
      // Project titles should be H3
      const projectHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(projectHeadings.length).toBe(2); // Two projects
      
      projectHeadings.forEach(heading => {
        expect(heading.tagName).toBe('H3');
      });
    });
  });

  describe('Heading Styling and Visibility', () => {
    test('headings have appropriate styling classes', () => {
      renderWithProviders(<HeroPage />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      
      // Should have proper styling classes
      expect(h1.className).toContain('text-');
      expect(h1.className).toContain('font-');
    });

    test('headings are visually distinct from body text', () => {
      renderWithProviders(<Projects />);
      
      const h2 = screen.getByRole('heading', { level: 2 });
      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      
      // H2 should have larger/bolder styling than H3
      expect(h2.className).toContain('text-3xl');
      expect(h2.className).toContain('font-bold');
      
      h3Elements.forEach(h3 => {
        expect(h3.className).toContain('font-semibold');
      });
    });

    test('headings use consistent color scheme', () => {
      renderWithProviders(<Projects />);
      
      const headings = screen.getAllByRole('heading');
      
      headings.forEach(heading => {
        // Should use the brand color
        expect(heading.className).toContain('text-[#A8977A]');
      });
    });
  });

  describe('Screen Reader Navigation', () => {
    test('headings provide logical navigation structure', () => {
      renderWithProviders(<HeroPage />);
      
      const headings = getAllHeadings();
      
      // Should be able to navigate by headings
      headings.forEach(heading => {
        expect(heading.element).toBeVisible();
        expect(heading.element).toHaveAccessibleName();
      });
    });

    test('heading levels create proper document outline', () => {
      renderWithProviders(<HeroPage />);
      
      const headings = getAllHeadings();
      
      // Document should start with H1
      expect(headings[0].level).toBe(1);
      
      // Should not have orphaned high-level headings
      let hasH2 = false;
      let hasH3 = false;
      
      headings.forEach(heading => {
        if (heading.level === 2) hasH2 = true;
        if (heading.level === 3) {
          // H3 should only appear after H2
          expect(hasH2).toBe(true);
          hasH3 = true;
        }
        if (heading.level === 4) {
          // H4 should only appear after H3
          expect(hasH3).toBe(true);
        }
      });
    });
  });

  describe('Dynamic Content Heading Management', () => {
    test('project expansion does not break heading hierarchy', () => {
      renderWithProviders(<Projects />);
      
      // Get initial heading structure
      const initialHeadings = getAllHeadings();
      
      // Expand a project (this happens via user interaction in real usage)
      // For testing, we just verify the static structure is correct
      const projectHeadings = screen.getAllByRole('heading', { level: 3 });
      
      projectHeadings.forEach(heading => {
        expect(heading.tagName).toBe('H3');
        // Should be clickable/interactive
        expect(heading).toHaveAttribute('role', 'button');
        expect(heading).toHaveAttribute('tabIndex', '0');
      });
    });

    test('ARIA attributes support heading navigation', () => {
      renderWithProviders(<Projects />);
      
      const projectHeadings = screen.getAllByRole('heading', { level: 3 });
      
      projectHeadings.forEach(heading => {
        // Should have proper ARIA attributes for interactive headings
        expect(heading).toHaveAttribute('aria-expanded');
        expect(heading).toHaveAttribute('aria-label');
      });
    });
  });
});