import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

function ContactModal({ isOpen, onClose }) {
  const { trackFormField, trackFormSubmit, trackCTA, trackEvent } = useAnalytics();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Track form field interaction
    trackFormField('contact_modal', name, 'input', value);
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    // Track form submission attempt
    trackFormSubmit('contact_modal', formData, false, null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setShowThankYou(true);
        
        // Track successful form submission
        trackFormSubmit('contact_modal', formData, true, null);
        trackCTA('contact_form_success', 'form_completion', {
          formName: 'contact_modal',
          fieldsCompleted: Object.keys(formData).length,
          currentPage: window.location.pathname
        });
      } else {
        setSubmitStatus('error');
        trackFormSubmit('contact_modal', formData, false, `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
      trackFormSubmit('contact_modal', formData, false, error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Track modal close
    trackCTA('contact_modal_close', 'modal_close', {
      formCompleted: showThankYou,
      fieldsFilledCount: Object.values(formData).filter(v => v && v.length > 0).length,
      totalFields: Object.keys(formData).length,
      currentPage: window.location.pathname
    });
    
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setSubmitStatus('');
      setShowThankYou(false);
      setFormData({ name: '', email: '', message: '' });
      setIsClosing(false);
      setIsVisible(false);
    }, 300); // Match the animation duration
  };

  const handleBackToForm = () => {
    trackCTA('contact_modal_send_another', 'form_restart', {
      context: 'thank_you_screen',
      currentPage: window.location.pathname
    });
    
    setShowThankYou(false);
    setSubmitStatus('');
    setFormData({ name: '', email: '', message: '' });
  };

  // Handle modal visibility animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Track modal open
      trackEvent('contact_modal_open', {
        currentPage: window.location.pathname,
        timestamp: Date.now()
      });
    }
  }, [isOpen, trackEvent]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out ${isVisible && !isClosing
          ? 'bg-black bg-opacity-50'
          : 'bg-black bg-opacity-0'
        }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-2xl p-6 w-full max-w-md mx-auto relative shadow-2xl transition-all duration-300 ease-out ${isVisible && !isClosing
            ? 'transform scale-100 translate-y-0 opacity-100'
            : 'transform scale-95 translate-y-4 opacity-0'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-all duration-200 ease-out transform hover:scale-110 hover:rotate-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-md"
          aria-label="Close contact form"
        >
          ×
        </button>

        {/* Thank You Screen */}
        {showThankYou ? (
          <div className={`text-center py-8 transition-all duration-500 ease-out ${showThankYou ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}>
            {/* Success Icon */}
            <div className="mx-auto mb-6 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center transform transition-all duration-700 ease-out animate-bounce">
              <svg
                className="w-8 h-8 text-green-600 transition-all duration-500 ease-out"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-[#45372B] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>Thank You!</h3>

            <p className="text-gray-600 mb-6 leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
              Your message has been sent successfully. I'll get back to you as soon as possible!
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-800 mb-1" style={{ fontFamily: 'var(--font-sans)' }}>
                    Check your email
                  </p>
                  <p className="text-sm text-blue-600" style={{ fontFamily: 'var(--font-sans)' }}>
                    You'll receive a confirmation email shortly with details about next steps.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 transition-all duration-300 ease-out delay-500">
              <button
                onClick={handleBackToForm}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 ease-out transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                <span style={{ fontFamily: 'var(--font-sans)' }}>Send Another</span>
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-[#A8977A] text-white py-2 px-4 rounded-lg hover:bg-[#9a8a6d] transition-all duration-200 ease-out transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:ring-offset-2"
              >
                <span style={{ fontFamily: 'var(--font-sans)' }}>Close</span>
              </button>
            </div>
          </div>
        ) : (
          /* Contact Form */
          <div className={`transition-all duration-500 ease-out ${!showThankYou ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}>
            <h3 className="text-2xl font-bold text-[#45372B] mb-6 transition-all duration-300 ease-out delay-100" style={{ fontFamily: 'var(--font-sans)' }}>Send me a message</h3>

            {submitStatus === 'error' && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 transition-all duration-300 ease-out transform animate-pulse">
                Failed to send message. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="transition-all duration-300 ease-out delay-150 transform">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-200 ease-out">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => trackFormField('contact_modal', 'name', 'focus')}
                  onBlur={() => trackFormField('contact_modal', 'name', 'blur', formData.name)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:border-[#A8977A] transition-all duration-200 ease-out transform focus:scale-[1.02]"
                />
              </div>

              <div className="transition-all duration-300 ease-out delay-200 transform">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-200 ease-out">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => trackFormField('contact_modal', 'email', 'focus')}
                  onBlur={() => trackFormField('contact_modal', 'email', 'blur', formData.email)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:border-[#A8977A] transition-all duration-200 ease-out transform focus:scale-[1.02]"
                />
              </div>

              <div className="transition-all duration-300 ease-out delay-300 transform">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-200 ease-out">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => trackFormField('contact_modal', 'message', 'focus')}
                  onBlur={() => trackFormField('contact_modal', 'message', 'blur', formData.message)}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:border-[#A8977A] resize-none transition-all duration-200 ease-out transform focus:scale-[1.02]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#A8977A] text-white py-2 px-4 rounded-lg hover:bg-[#9a8a6d] transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] delay-400 focus:outline-none focus:ring-2 focus:ring-[#A8977A] focus:ring-offset-2"
              >
                <span style={{ fontFamily: 'var(--font-sans)' }} className="transition-all duration-200 ease-out">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : 'Send Message'}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactModal;
