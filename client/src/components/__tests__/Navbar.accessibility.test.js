import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';
import { MobileMenuProvider } from '../../contexts/MobileMenuContext';
import { ChatbotProvider } from '../../chatbot/context/ChatbotContext';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock hooks
jest.mock('../../hooks/usePageNavigation', () => ({
  usePageNavigation: () => ({
    navigateWithTransition: jest.fn()
  })
}));

jest.mock('../../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackCTA: jest.fn(),
    trackNavigation: jest.fn(),
    trackChatbot: jest.fn()
  })
}));

// Helper function to render Navbar with all required providers
const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <ChatbotProvider>
        <MobileMenuProvider>
          <Navbar />
        </MobileMenuProvider>
      </ChatbotProvider>
    </BrowserRouter>
  );
};

describe('Navbar Accessibility Tests', () => {
  describe('ARIA Labels and Attributes', () => {
    test('navigation has proper aria-label', () => {
      renderNavbar();
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });

    test('header has proper role', () => {
      renderNavbar();
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    test('mobile menu button has proper aria-label', () => {
      renderNavbar();
      
      const menuButton = screen.getByLabelText('Open navigation menu');
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveAttribute('aria-label', 'Open navigation menu');
    });

    test('mobile menu button has aria-expanded attribute', () => {
      renderNavbar();
      
      const menuButton = screen.getByLabelText('Open navigation menu');
      expect(menuButton).toHaveAttribute('aria-expanded');
    });

    test('Talk to Saarth button has proper aria-label', () => {
      renderNavbar();
      
      const chatButtons = screen.getAllByLabelText('Open Saarth chatbot for assistance');
      expect(chatButtons.length).toBeGreaterThan(0);
      
      chatButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-label', 'Open Saarth chatbot for assistance');
      });
    });

    test('logo button is accessible', () => {
      renderNavbar();
      
      const logoButton = screen.getByRole('button', { name: /yuvaan vithlani/i });
      expect(logoButton).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    test('all interactive elements are focusable', () => {
      renderNavbar();
      
      const interactiveElements = [
        screen.getByRole('button', { name: /yuvaan vithlani/i }), // Logo
        screen.getByLabelText('Open navigation menu'), // Mobile menu button
      ];

      // Desktop navigation links
      const aboutLinks = screen.getAllByText('About');
      const blogButtons = screen.getAllByText('Blogs');
      const chatButtons = screen.getAllByLabelText('Open Saarth chatbot for assistance');

      const allElements = [
        ...interactiveElements,
        ...aboutLinks,
        ...blogButtons,
        ...chatButtons
      ];

      allElements.forEach(element => {
        expect(element).not.toHaveAttribute('tabindex', '-1');
      });
    });

    test('mobile menu button responds to keyboard events', () => {
      renderNavbar();
      
      const menuButton = screen.getByLabelText('Open navigation menu');
      
      // Test Enter key
      fireEvent.keyDown(menuButton, { key: 'Enter', code: 'Enter' });
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      
      // Test Space key
      fireEvent.keyDown(menuButton, { key: ' ', code: 'Space' });
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('buttons respond to Enter and Space keys', () => {
      renderNavbar();
      
      const logoButton = screen.getByRole('button', { name: /yuvaan vithlani/i });
      
      // Should not throw errors when keyboard events are fired
      expect(() => {
        fireEvent.keyDown(logoButton, { key: 'Enter', code: 'Enter' });
        fireEvent.keyDown(logoButton, { key: ' ', code: 'Space' });
      }).not.toThrow();
    });
  });

  describe('Focus Management', () => {
    test('focus indicators are present on interactive elements', () => {
      renderNavbar();
      
      const logoButton = screen.getByRole('button', { name: /yuvaan vithlani/i });
      const menuButton = screen.getByLabelText('Open navigation menu');
      
      // Check for focus ring classes
      expect(logoButton.className).toContain('focus:outline-none');
      expect(logoButton.className).toContain('focus:ring-2');
      expect(logoButton.className).toContain('focus:ring-[#A8977A]');
      
      expect(menuButton.className).toContain('focus:outline-none');
      expect(menuButton.className).toContain('focus:ring-2');
      expect(menuButton.className).toContain('focus:ring-[#A8977A]');
    });

    test('focus indicators meet contrast requirements', () => {
      renderNavbar();
      
      const interactiveElements = [
        screen.getByRole('button', { name: /yuvaan vithlani/i }),
        screen.getByLabelText('Open navigation menu')
      ];

      interactiveElements.forEach(element => {
        // Check for ring offset to ensure contrast
        expect(element.className).toContain('focus:ring-offset-2');
        expect(element.className).toContain('focus:ring-offset-[#161711]');
      });
    });

    test('mobile menu focus management', () => {
      renderNavbar();
      
      const menuButton = screen.getByLabelText('Open navigation menu');
      
      // Open menu
      fireEvent.click(menuButton);
      
      // Check that menu items are accessible
      const mobileAboutLink = screen.getAllByText('About').find(link => 
        link.closest('.md\\:hidden')
      );
      
      if (mobileAboutLink) {
        expect(mobileAboutLink).toHaveClass('focus:outline-none');
        expect(mobileAboutLink).toHaveClass('focus:ring-2');
      }
    });
  });

  describe('Screen Reader Support', () => {
    test('navigation structure is semantic', () => {
      renderNavbar();
      
      // Should have proper semantic structure
      const header = screen.getByRole('banner');
      const nav = screen.getByRole('navigation');
      
      expect(header).toContainElement(nav);
    });

    test('button roles are properly defined', () => {
      renderNavbar();
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        // Each button should have accessible text
        expect(button).toHaveAccessibleName();
      });
    });

    test('links have proper roles and accessible names', () => {
      renderNavbar();
      
      const aboutLinks = screen.getAllByText('About');
      
      aboutLinks.forEach(link => {
        if (link.tagName === 'A') {
          expect(link).toHaveAccessibleName();
        }
      });
    });
  });

  describe('Mobile Menu Accessibility', () => {
    test('mobile menu toggle updates aria-expanded', () => {
      renderNavbar();
      
      const menuButton = screen.getByLabelText('Open navigation menu');
      
      // Initially closed
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      
      // Open menu
      fireEvent.click(menuButton);
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      
      // Close menu
      fireEvent.click(menuButton);
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('mobile menu items are accessible when open', () => {
      renderNavbar();
      
      const menuButton = screen.getByLabelText('Open navigation menu');
      fireEvent.click(menuButton);
      
      // Check mobile-specific elements
      const mobileContainer = document.querySelector('.md\\:hidden');
      if (mobileContainer) {
        const focusableElements = mobileContainer.querySelectorAll(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(element => {
          expect(element).not.toHaveAttribute('tabindex', '-1');
        });
      }
    });

    test('overlay is properly labeled for screen readers', () => {
      renderNavbar();
      
      const menuButton = screen.getByLabelText('Open navigation menu');
      fireEvent.click(menuButton);
      
      // The blur overlay should not interfere with screen readers
      const overlay = document.querySelector('.backdrop-blur-sm');
      if (overlay) {
        // Overlay should not have conflicting accessibility attributes
        expect(overlay).not.toHaveAttribute('role');
        expect(overlay).not.toHaveAttribute('aria-label');
      }
    });
  });

  describe('Automated Accessibility Testing', () => {
    test('navbar has no accessibility violations', async () => {
      const { container } = renderNavbar();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('navbar with open mobile menu has no accessibility violations', async () => {
      const { container } = renderNavbar();
      
      const menuButton = screen.getByLabelText('Open navigation menu');
      fireEvent.click(menuButton);
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    test('interactive elements have sufficient color contrast classes', () => {
      renderNavbar();
      
      const logoButton = screen.getByRole('button', { name: /yuvaan vithlani/i });
      
      // Check for proper color classes that should provide sufficient contrast
      expect(logoButton.className).toContain('text-[#A8977A]');
      expect(logoButton.className).toContain('hover:text-white');
    });

    test('Talk to Saarth button has proper contrast', () => {
      renderNavbar();
      
      const chatButtons = screen.getAllByLabelText('Open Saarth chatbot for assistance');
      
      chatButtons.forEach(button => {
        // Desktop version should have proper background/text contrast
        if (button.className.includes('bg-[#A8977A]')) {
          expect(button.className).toContain('text-[#161711]');
        }
      });
    });
  });
});