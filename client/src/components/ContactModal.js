import React, { useState } from 'react';

function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const response = await fetch('http://localhost:8000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setShowThankYou(true);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSubmitStatus('');
    setShowThankYou(false);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleBackToForm = () => {
    setShowThankYou(false);
    setSubmitStatus('');
    setFormData({ name: '', email: '', message: '' });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto relative shadow-2xl transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200"
        >
          ×
        </button>

        {/* Thank You Screen */}
        {showThankYou ? (
          <div className="text-center py-8">
            {/* Success Icon */}
            <div className="mx-auto mb-6 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
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

            <h3 className="text-2xl font-bold text-[#45372B] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Thank You!</h3>
            
            <p className="text-gray-600 mb-6 leading-relaxed" style={{ fontFamily: 'Neuton, serif' }}>
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
                  <p className="text-sm font-medium text-blue-800 mb-1" style={{ fontFamily: 'Neuton, serif' }}>
                    Check your email
                  </p>
                  <p className="text-sm text-blue-600" style={{ fontFamily: 'Neuton, serif' }}>
                    You'll receive a confirmation email shortly with details about next steps.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBackToForm}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <span style={{ fontFamily: 'Neuton, serif' }}>Send Another</span>
              </button>
              <button
                onClick={handleClose}
                className="flex-1 bg-[#A8977A] text-white py-2 px-4 rounded-lg hover:bg-[#9a8a6d] transition-colors duration-200"
              >
                <span style={{ fontFamily: 'Neuton, serif' }}>Close</span>
              </button>
            </div>
          </div>
        ) : (
          /* Contact Form */
          <>
            <h3 className="text-2xl font-bold text-[#45372B] mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>Send me a message</h3>

            {submitStatus === 'error' && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                Failed to send message. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8977A]"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8977A]"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8977A] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#A8977A] text-white py-2 px-4 rounded-lg hover:bg-[#9a8a6d] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span style={{ fontFamily: 'Neuton, serif' }}>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ContactModal;