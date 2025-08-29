import React, { useState } from 'react';
import { useProgressiveAccessibility } from '../hooks/useProgressiveAccessibility';

/**
 * Demo component showing progressive enhancement for accessibility
 * Works with and without JavaScript enabled
 */
const ProgressiveAccessibilityDemo = () => {
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  const {
    createEnhancedButton,
    createEnhancedForm,
    createEnhancedImage,
    createEnhancedNavigation,
    isFeatureSupported,
    createNoScriptFallback
  } = useProgressiveAccessibility();

  // Enhanced button with progressive features
  const submitButtonProps = createEnhancedButton({
    onClick: () => setMessage('Form submitted successfully!'),
    ariaLabel: 'Submit the contact form',
    enhanceVisuals: true
  });

  // Enhanced form with validation
  const formProps = createEnhancedForm({
    onSubmit: (e) => {
      e.preventDefault();
      setMessage(`Hello ${formData.name}! We'll contact you at ${formData.email}`);
    },
    enableValidation: true
  });

  // Enhanced navigation
  const navProps = createEnhancedNavigation({
    ariaLabel: 'Demo navigation',
    enableKeyboardNav: true
  });

  // Enhanced image
  const imageProps = createEnhancedImage({
    src: '/assets/Hero/Hero.webp',
    alt: 'Progressive enhancement demo - hero image showing modern web development',
    lazy: true,
    webpFallback: true
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Feature Support Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">
          Progressive Enhancement Status
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <strong>JavaScript:</strong> {isFeatureSupported('javascript') ? '✅ Yes' : '❌ No'}
          </div>
          <div>
            <strong>Intersection Observer:</strong> {isFeatureSupported('intersectionObserver') ? '✅ Yes' : '❌ No'}
          </div>
          <div>
            <strong>Focus Visible:</strong> {isFeatureSupported('focusVisible') ? '✅ Yes' : '❌ No'}
          </div>
          <div>
            <strong>Reduced Motion:</strong> {isFeatureSupported('reducedMotion') ? '✅ Preferred' : '❌ No preference'}
          </div>
        </div>
      </div>

      {/* NoScript Fallback */}
      <div {...createNoScriptFallback('This demo works best with JavaScript enabled, but core functionality remains available without it.')} />

      {/* Enhanced Navigation */}
      <nav {...navProps} className="bg-gray-100 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-3">Demo Navigation</h3>
        <div className="flex flex-wrap gap-4">
          <a href="#basic" className="text-blue-600 hover:text-blue-800 underline">
            Basic Features
          </a>
          <a href="#enhanced" className="text-blue-600 hover:text-blue-800 underline">
            Enhanced Features
          </a>
          <a href="#accessibility" className="text-blue-600 hover:text-blue-800 underline">
            Accessibility
          </a>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Try using arrow keys to navigate between links (enhanced with JavaScript)
        </p>
      </nav>

      {/* Enhanced Image */}
      <div className="text-center">
        <h3 className="text-lg font-medium mb-3">Progressive Image Enhancement</h3>
        <img 
          {...imageProps}
          className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
          style={{ maxHeight: '300px' }}
        />
        <p className="text-sm text-gray-600 mt-2">
          This image uses WebP format with JPEG fallback and lazy loading when supported
        </p>
      </div>

      {/* Enhanced Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Progressive Form Enhancement</h3>
        
        <form {...formProps} className="space-y-4">
          <div>
            <label htmlFor="demo-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name (required)
            </label>
            <input
              id="demo-name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="demo-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email (required)
            </label>
            <input
              id="demo-email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <button
            {...submitButtonProps}
            className={`${submitButtonProps.className} bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors`}
          >
            Submit Form
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">{message}</p>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <h4 className="font-medium">Progressive Enhancement Features:</h4>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Basic HTML validation works without JavaScript</li>
            <li>Enhanced validation with ARIA attributes when JavaScript is available</li>
            <li>Visual feedback and focus management</li>
            <li>Keyboard navigation support</li>
          </ul>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Without JavaScript vs With JavaScript</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">✅ Works Without JavaScript</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Form submission to server</li>
              <li>• HTML5 form validation</li>
              <li>• Semantic HTML structure</li>
              <li>• Basic keyboard navigation</li>
              <li>• Screen reader compatibility</li>
              <li>• Image display with alt text</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">🚀 Enhanced With JavaScript</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Real-time form validation</li>
              <li>• ARIA live announcements</li>
              <li>• Enhanced keyboard navigation</li>
              <li>• Visual feedback and animations</li>
              <li>• Lazy loading for images</li>
              <li>• WebP format with fallbacks</li>
              <li>• Focus management</li>
              <li>• Performance optimizations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Accessibility Testing */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">
          Accessibility Testing
        </h3>
        <p className="text-sm text-yellow-700 mb-3">
          Try these accessibility features:
        </p>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Navigate using only the Tab key</li>
          <li>• Use a screen reader to hear announcements</li>
          <li>• Try keyboard shortcuts (Arrow keys in navigation)</li>
          <li>• Test with JavaScript disabled</li>
          <li>• Check color contrast and focus indicators</li>
        </ul>
      </div>
    </div>
  );
};

export default ProgressiveAccessibilityDemo;