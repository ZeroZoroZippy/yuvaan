/**
 * Progressive Enhancement utilities for accessibility features
 * Ensures core functionality works without JavaScript and accessibility features enhance the experience
 */

/**
 * Check if JavaScript is enabled and browser supports modern features
 * @returns {Object} Feature support information
 */
export const getFeatureSupport = () => {
  const support = {
    javascript: true, // If this runs, JS is enabled
    intersectionObserver: typeof IntersectionObserver !== 'undefined',
    requestAnimationFrame: typeof requestAnimationFrame !== 'undefined',
    customElements: typeof customElements !== 'undefined',
    ariaLive: typeof document !== 'undefined' && 'setAttribute' in document.createElement('div'),
    focusVisible: typeof document !== 'undefined' && CSS.supports && CSS.supports('selector(:focus-visible)'),
    reducedMotion: typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  return support;
};

/**
 * Progressive enhancement wrapper for accessibility features
 * @param {Function} enhancedCallback - Enhanced functionality with JS
 * @param {Function} fallbackCallback - Fallback functionality without JS
 * @param {Array} requiredFeatures - Required browser features
 * @returns {Function} Enhanced or fallback function
 */
export const progressiveEnhance = (enhancedCallback, fallbackCallback = () => {}, requiredFeatures = []) => {
  const support = getFeatureSupport();
  
  // Check if all required features are supported
  const hasRequiredSupport = requiredFeatures.every(feature => support[feature]);
  
  if (hasRequiredSupport) {
    return enhancedCallback;
  } else {
    console.warn('Falling back to basic functionality due to missing browser support:', 
      requiredFeatures.filter(feature => !support[feature]));
    return fallbackCallback;
  }
};

/**
 * Create accessible button with progressive enhancement
 * @param {HTMLElement} element - Button element
 * @param {Object} options - Enhancement options
 */
export const enhanceButton = (element, options = {}) => {
  if (!element) return;

  const {
    ariaLabel,
    ariaDescribedBy,
    onClick,
    onKeyDown,
    enableFocusRing = true,
    enableRippleEffect = false
  } = options;

  // Basic accessibility (works without JS)
  if (ariaLabel) {
    element.setAttribute('aria-label', ariaLabel);
  }
  if (ariaDescribedBy) {
    element.setAttribute('aria-describedby', ariaDescribedBy);
  }

  // Ensure button is keyboard accessible
  if (!element.hasAttribute('tabindex') && element.tagName !== 'BUTTON') {
    element.setAttribute('tabindex', '0');
    element.setAttribute('role', 'button');
  }

  // Progressive enhancements (require JS)
  const support = getFeatureSupport();

  if (support.javascript) {
    // Enhanced click handling
    if (onClick) {
      element.addEventListener('click', onClick);
    }

    // Enhanced keyboard handling
    const keyHandler = onKeyDown || ((event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (onClick) onClick(event);
      }
    });
    element.addEventListener('keydown', keyHandler);

    // Enhanced focus ring (if supported)
    if (enableFocusRing && support.focusVisible) {
      element.classList.add('focus-visible-enhanced');
    }

    // Enhanced visual feedback (if supported and user prefers motion)
    if (enableRippleEffect && support.requestAnimationFrame && !support.reducedMotion) {
      element.addEventListener('click', createRippleEffect);
    }
  }
};

/**
 * Create ripple effect for enhanced button feedback
 * @param {Event} event - Click event
 */
const createRippleEffect = (event) => {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  `;

  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
};

/**
 * Progressive enhancement for navigation menus
 * @param {HTMLElement} nav - Navigation element
 * @param {Object} options - Enhancement options
 */
export const enhanceNavigation = (nav, options = {}) => {
  if (!nav) return;

  const {
    enableKeyboardNavigation = true,
    enableMobileMenu = true,
    enableSkipLinks = true
  } = options;

  const support = getFeatureSupport();

  // Basic semantic structure (works without JS)
  if (!nav.hasAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }
  if (!nav.hasAttribute('aria-label')) {
    nav.setAttribute('aria-label', 'Main navigation');
  }

  // Progressive enhancements
  if (support.javascript) {
    // Enhanced keyboard navigation
    if (enableKeyboardNavigation) {
      addKeyboardNavigation(nav);
    }

    // Enhanced mobile menu (if supported)
    if (enableMobileMenu && support.intersectionObserver) {
      addMobileMenuEnhancements(nav);
    }

    // Enhanced skip links
    if (enableSkipLinks) {
      addSkipLinks(nav);
    }
  }
};

/**
 * Add keyboard navigation to menu
 * @param {HTMLElement} nav - Navigation element
 */
const addKeyboardNavigation = (nav) => {
  const links = nav.querySelectorAll('a, button');
  
  nav.addEventListener('keydown', (event) => {
    const currentIndex = Array.from(links).indexOf(event.target);
    let nextIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % links.length;
        links[nextIndex].focus();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = (currentIndex - 1 + links.length) % links.length;
        links[nextIndex].focus();
        break;
      case 'Home':
        event.preventDefault();
        links[0].focus();
        break;
      case 'End':
        event.preventDefault();
        links[links.length - 1].focus();
        break;
    }
  });
};

/**
 * Add mobile menu enhancements
 * @param {HTMLElement} nav - Navigation element
 */
const addMobileMenuEnhancements = (nav) => {
  const menuButton = nav.querySelector('[aria-expanded]');
  if (!menuButton) return;

  // Enhanced mobile menu behavior
  menuButton.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', !isExpanded);
    
    // Focus management
    if (!isExpanded) {
      const firstLink = nav.querySelector('a');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }
    }
  });

  // Close menu on escape
  nav.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.focus();
    }
  });
};

/**
 * Add skip links for better accessibility
 * @param {HTMLElement} nav - Navigation element
 */
const addSkipLinks = (nav) => {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded';
  
  // Insert skip link at the beginning of the page
  document.body.insertBefore(skipLink, document.body.firstChild);
};

/**
 * Progressive enhancement for images
 * @param {HTMLElement} img - Image element
 * @param {Object} options - Enhancement options
 */
export const enhanceImage = (img, options = {}) => {
  if (!img) return;

  const {
    enableLazyLoading = true,
    enableWebP = true,
    enableResponsive = true
  } = options;

  const support = getFeatureSupport();

  // Basic accessibility (works without JS)
  if (!img.hasAttribute('alt')) {
    console.warn('Image missing alt text:', img.src);
    img.setAttribute('alt', ''); // Decorative image fallback
  }

  // Progressive enhancements
  if (support.javascript) {
    // Enhanced lazy loading (if supported)
    if (enableLazyLoading && support.intersectionObserver) {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    }

    // Enhanced format support (WebP with fallback)
    if (enableWebP && img.src.includes('.jpg') || img.src.includes('.png')) {
      const webpSrc = img.src.replace(/\.(jpg|png)$/i, '.webp');
      
      // Test WebP support
      const webpTest = new Image();
      webpTest.onload = () => {
        img.src = webpSrc;
      };
      webpTest.onerror = () => {
        // Keep original format
      };
      webpTest.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
    }

    // Enhanced responsive behavior
    if (enableResponsive && !img.hasAttribute('sizes')) {
      img.setAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
    }
  }
};

/**
 * Progressive enhancement for forms
 * @param {HTMLElement} form - Form element
 * @param {Object} options - Enhancement options
 */
export const enhanceForm = (form, options = {}) => {
  if (!form) return;

  const {
    enableValidation = true,
    enableAutoSave = false,
    enableProgressIndicator = false
  } = options;

  const support = getFeatureSupport();

  // Basic accessibility (works without JS)
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    const label = form.querySelector(`label[for="${input.id}"]`);
    if (!label && !input.hasAttribute('aria-label')) {
      console.warn('Form input missing label:', input);
    }
  });

  // Progressive enhancements
  if (support.javascript) {
    // Enhanced validation
    if (enableValidation) {
      addFormValidation(form);
    }

    // Enhanced auto-save (if supported)
    if (enableAutoSave && typeof localStorage !== 'undefined') {
      addAutoSave(form);
    }

    // Enhanced progress indicator
    if (enableProgressIndicator) {
      addProgressIndicator(form);
    }
  }
};

/**
 * Add enhanced form validation
 * @param {HTMLElement} form - Form element
 */
const addFormValidation = (form) => {
  const inputs = form.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    
    input.addEventListener('input', () => {
      // Clear error state on input
      clearFieldError(input);
    });
  });

  form.addEventListener('submit', (event) => {
    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      event.preventDefault();
      // Focus first invalid field
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });
};

/**
 * Validate individual form field
 * @param {HTMLElement} field - Form field
 * @returns {boolean} Is valid
 */
const validateField = (field) => {
  const isValid = field.checkValidity();
  
  if (!isValid) {
    field.setAttribute('aria-invalid', 'true');
    showFieldError(field, field.validationMessage);
  } else {
    field.setAttribute('aria-invalid', 'false');
    clearFieldError(field);
  }
  
  return isValid;
};

/**
 * Show field error message
 * @param {HTMLElement} field - Form field
 * @param {string} message - Error message
 */
const showFieldError = (field, message) => {
  let errorElement = document.getElementById(`${field.id}-error`);
  
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.id = `${field.id}-error`;
    errorElement.className = 'field-error text-red-600 text-sm mt-1';
    errorElement.setAttribute('role', 'alert');
    field.parentNode.appendChild(errorElement);
  }
  
  errorElement.textContent = message;
  field.setAttribute('aria-describedby', errorElement.id);
};

/**
 * Clear field error message
 * @param {HTMLElement} field - Form field
 */
const clearFieldError = (field) => {
  const errorElement = document.getElementById(`${field.id}-error`);
  if (errorElement) {
    errorElement.remove();
  }
  field.removeAttribute('aria-describedby');
};

/**
 * Add auto-save functionality
 * @param {HTMLElement} form - Form element
 */
const addAutoSave = (form) => {
  const formId = form.id || 'form-autosave';
  let saveTimeout;

  const saveFormData = () => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    localStorage.setItem(formId, JSON.stringify(data));
  };

  const loadFormData = () => {
    const savedData = localStorage.getItem(formId);
    if (savedData) {
      const data = JSON.parse(savedData);
      Object.entries(data).forEach(([name, value]) => {
        const field = form.querySelector(`[name="${name}"]`);
        if (field) {
          field.value = value;
        }
      });
    }
  };

  // Load saved data on page load
  loadFormData();

  // Save data on input
  form.addEventListener('input', () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveFormData, 1000);
  });

  // Clear saved data on successful submit
  form.addEventListener('submit', () => {
    localStorage.removeItem(formId);
  });
};

/**
 * Add progress indicator to form
 * @param {HTMLElement} form - Form element
 */
const addProgressIndicator = (form) => {
  const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
  const progressBar = document.createElement('div');
  progressBar.className = 'form-progress bg-gray-200 h-2 rounded mb-4';
  progressBar.innerHTML = '<div class="form-progress-fill bg-blue-600 h-full rounded transition-all duration-300" style="width: 0%"></div>';
  
  form.insertBefore(progressBar, form.firstChild);
  
  const updateProgress = () => {
    const completedFields = Array.from(fields).filter(field => field.value.trim() !== '').length;
    const progress = (completedFields / fields.length) * 100;
    const progressFill = progressBar.querySelector('.form-progress-fill');
    progressFill.style.width = `${progress}%`;
  };

  fields.forEach(field => {
    field.addEventListener('input', updateProgress);
  });

  updateProgress();
};

/**
 * Initialize progressive enhancement for the entire page
 * @param {Object} options - Global enhancement options
 */
export const initializeProgressiveEnhancement = (options = {}) => {
  const {
    enhanceButtons = true,
    enhanceNavigation: shouldEnhanceNavigation = true,
    enhanceImages = true,
    enhanceForms = true
  } = options;

  const support = getFeatureSupport();
  
  console.log('Browser feature support:', support);

  // Only enhance if JavaScript is available
  if (support.javascript) {
    if (enhanceButtons) {
      document.querySelectorAll('button, [role="button"]').forEach(button => {
        enhanceButton(button);
      });
    }

    if (shouldEnhanceNavigation) {
      document.querySelectorAll('nav').forEach(nav => {
        enhanceNavigation(nav);
      });
    }

    if (enhanceImages) {
      document.querySelectorAll('img').forEach(img => {
        enhanceImage(img);
      });
    }

    if (enhanceForms) {
      document.querySelectorAll('form').forEach(form => {
        enhanceForm(form);
      });
    }
  }
};

export default {
  getFeatureSupport,
  progressiveEnhance,
  enhanceButton,
  enhanceNavigation,
  enhanceImage,
  enhanceForm,
  initializeProgressiveEnhancement
};