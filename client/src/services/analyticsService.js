import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db, hasFirebaseConfig } from '../config/firebase';

class AnalyticsService {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.pageLoadTime = Date.now();
        this.interactions = [];

        // Disable Firebase writes temporarily to avoid 400 errors
        this.enableFirebaseWrites = false;

        // Initialize session tracking
        this.initializeSession();

        // Track page visibility changes
        this.setupVisibilityTracking();

        // Track scroll depth
        this.setupScrollTracking();

        // Batch upload interactions every 30 seconds
        this.setupBatchUpload();

        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Analytics Service initialized');
            console.log('🔥 Firebase writes disabled until security rules are configured');
            console.log('💡 To enable: Set up Firestore security rules and call analyticsService.enableFirebase()');
            console.log('📋 See FIRESTORE_SETUP.md for detailed instructions');
        }
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    getUserId() {
        let userId = localStorage.getItem('analytics_user_id');
        if (!userId) {
            userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('analytics_user_id', userId);
        }
        return userId;
    }

    async initializeSession() {
        // Always mark user as returning for local tracking
        localStorage.setItem('analytics_returning_user', 'true');

        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Analytics: Session initialized');
            console.log(`   Session ID: ${this.sessionId}`);
            console.log(`   User ID: ${this.userId}`);
        }

        // Skip Firebase operations until security rules are configured
        if (!this.enableFirebaseWrites || !hasFirebaseConfig || !db) {
            if (process.env.NODE_ENV === 'development') {
                console.log('🔥 Firebase writes disabled - session data not sent to Firebase');
            }
            return;
        }

        // This code will only run when Firebase writes are explicitly enabled
        try {
            const sessionData = {
                sessionId: this.sessionId,
                userId: this.userId,
                startTime: serverTimestamp(),
                userAgent: navigator.userAgent,
                screenResolution: `${window.screen.width}x${window.screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                referrer: document.referrer || 'direct',
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                url: window.location.href,
                path: window.location.pathname,
                isNewUser: !localStorage.getItem('analytics_returning_user')
            };

            await addDoc(collection(db, 'analytics_sessions'), sessionData);

            if (process.env.NODE_ENV === 'development') {
                console.log('✅ Analytics: Session saved to Firebase');
            }
        } catch (error) {
            console.error('❌ Firebase session error:', error.message);
        }
    }

    setupVisibilityTracking() {
        document.addEventListener('visibilitychange', () => {
            this.trackEvent('page_visibility', {
                action: document.hidden ? 'hidden' : 'visible',
                timestamp: Date.now()
            });
        });
    }

    setupScrollTracking() {
        let maxScrollDepth = 0;
        let scrollCheckpoints = [25, 50, 75, 90, 100];
        let triggeredCheckpoints = new Set();

        const trackScrollDepth = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);

            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
            }

            scrollCheckpoints.forEach(checkpoint => {
                if (scrollPercent >= checkpoint && !triggeredCheckpoints.has(checkpoint)) {
                    triggeredCheckpoints.add(checkpoint);
                    this.trackEvent('scroll_depth', {
                        depth: checkpoint,
                        maxDepth: maxScrollDepth,
                        page: window.location.pathname
                    });
                }
            });
        };

        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(trackScrollDepth, 100);
        });
    }

    setupBatchUpload() {
        setInterval(() => {
            if (this.interactions.length > 0) {
                this.uploadBatchInteractions();
            }
        }, 30000); // Upload every 30 seconds

        // Upload on page unload
        window.addEventListener('beforeunload', () => {
            if (this.interactions.length > 0) {
                this.uploadBatchInteractions(true);
            }
        });
    }

    async uploadBatchInteractions(isSync = false) {
        if (this.interactions.length === 0) return;

        const batch = [...this.interactions];
        this.interactions = [];

        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Analytics: Batch ready for upload', {
                batchSize: batch.length,
                events: batch.map(i => i.eventType),
                firebaseEnabled: this.enableFirebaseWrites
            });
        }

        // Skip Firebase operations until security rules are configured
        if (!this.enableFirebaseWrites || !hasFirebaseConfig || !db) {
            if (process.env.NODE_ENV === 'development') {
                console.log('🔥 Firebase writes disabled - batch data not sent to Firebase');
            }
            return;
        }

        try {
            const batchData = {
                sessionId: this.sessionId,
                userId: this.userId,
                interactions: batch,
                uploadTime: serverTimestamp(),
                batchSize: batch.length
            };

            if (isSync && navigator.sendBeacon) {
                navigator.sendBeacon(
                    '/api/analytics/batch',
                    JSON.stringify(batchData)
                );
            } else {
                await addDoc(collection(db, 'analytics_interactions'), batchData);

                if (process.env.NODE_ENV === 'development') {
                    console.log('✅ Analytics: Batch uploaded to Firebase');
                }
            }
        } catch (error) {
            console.error('❌ Firebase batch upload error:', error.message);
            // Re-add failed interactions back to queue
            this.interactions.unshift(...batch);
        }
    }

    // Core tracking method
    trackEvent(eventType, eventData = {}) {
        const interaction = {
            eventType,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userId: this.userId,
            url: window.location.href,
            path: window.location.pathname,
            userAgent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            ...eventData
        };

        this.interactions.push(interaction);

        // Log in development mode
        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Analytics Event:', eventType, eventData);
        }

        // For critical events, upload immediately
        if (this.isCriticalEvent(eventType)) {
            this.uploadBatchInteractions();
        }
    }

    isCriticalEvent(eventType) {
        const criticalEvents = [
            'form_submit',
            'contact_form_submit',
            'error',
            'conversion',
            'purchase'
        ];
        return criticalEvents.includes(eventType);
    }

    // CTA and Button Tracking
    trackCTAClick(ctaName, ctaType, additionalData = {}) {
        this.trackEvent('cta_click', {
            ctaName,
            ctaType,
            ...additionalData
        });

        // Also update CTA click counter
        this.updateClickCounter('cta_clicks', ctaName);
    }

    // Navigation Tracking
    trackNavigation(from, to, method = 'click') {
        this.trackEvent('navigation', {
            from,
            to,
            method,
            navigationTime: Date.now() - this.pageLoadTime
        });
    }

    // Form Interaction Tracking
    trackFormInteraction(formName, fieldName, action, value = null) {
        this.trackEvent('form_interaction', {
            formName,
            fieldName,
            action, // 'focus', 'blur', 'input', 'submit'
            value: action === 'input' ? (value ? value.length : 0) : null,
            hasValue: value && value.length > 0
        });
    }

    trackFormSubmit(formName, formData, success = true, errorMessage = null) {
        this.trackEvent('form_submit', {
            formName,
            success,
            errorMessage,
            fieldCount: Object.keys(formData).length,
            filledFields: Object.values(formData).filter(v => v && v.length > 0).length,
            formData: this.sanitizeFormData(formData)
        });

        if (success) {
            this.updateClickCounter('form_submissions', formName);
        }
    }

    sanitizeFormData(formData) {
        // Remove sensitive data but keep structure for analytics
        const sanitized = {};
        Object.keys(formData).forEach(key => {
            if (key.toLowerCase().includes('email')) {
                sanitized[key] = formData[key] ? 'provided' : 'empty';
            } else if (key.toLowerCase().includes('phone')) {
                sanitized[key] = formData[key] ? 'provided' : 'empty';
            } else {
                sanitized[key] = formData[key] ? `${formData[key].length}_chars` : 'empty';
            }
        });
        return sanitized;
    }

    // Project and Portfolio Tracking
    trackProjectView(projectName, projectId, viewType = 'expand') {
        this.trackEvent('project_view', {
            projectName,
            projectId,
            viewType // 'expand', 'collapse', 'external_link'
        });

        this.updateClickCounter('project_views', projectName);
    }

    // Social Media Tracking
    trackSocialClick(platform, url, context = 'footer') {
        this.trackEvent('social_click', {
            platform,
            url,
            context // 'footer', 'about', 'contact'
        });

        this.updateClickCounter('social_clicks', platform);
    }

    // Chatbot Tracking
    trackChatbotInteraction(action, messageCount = 0, context = null) {
        this.trackEvent('chatbot_interaction', {
            action, // 'open', 'close', 'message_sent', 'message_received'
            messageCount,
            context
        });

        if (action === 'open') {
            this.updateClickCounter('chatbot_opens', 'saarth');
        }
    }

    // Blog Tracking
    trackBlogInteraction(action, blogId = null, blogTitle = null) {
        this.trackEvent('blog_interaction', {
            action, // 'view_list', 'click_post', 'read_time'
            blogId,
            blogTitle
        });

        if (action === 'click_post') {
            this.updateClickCounter('blog_clicks', blogId);
        }
    }

    // Error Tracking
    trackError(errorType, errorMessage, context = null) {
        this.trackEvent('error', {
            errorType,
            errorMessage,
            context,
            stack: new Error().stack
        });
    }

    // Performance Tracking
    trackPerformance(metricName, value, context = null) {
        this.trackEvent('performance', {
            metricName,
            value,
            context,
            loadTime: Date.now() - this.pageLoadTime
        });
    }

    // Update click counters in Firestore
    async updateClickCounter(counterType, itemName) {
        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Analytics: Counter increment', { counterType, itemName });
        }

        // Skip Firebase operations until security rules are configured
        if (!this.enableFirebaseWrites || !hasFirebaseConfig || !db) {
            if (process.env.NODE_ENV === 'development') {
                console.log('🔥 Firebase writes disabled - counter not sent to Firebase');
            }
            return;
        }

        try {
            const counterRef = doc(db, 'analytics_counters', `${counterType}_${itemName}`);
            await updateDoc(counterRef, {
                count: increment(1),
                lastUpdated: serverTimestamp(),
                itemName,
                counterType
            }).catch(async (error) => {
                if (error.code === 'not-found') {
                    // Create new counter if it doesn't exist
                    await addDoc(collection(db, 'analytics_counters'), {
                        count: 1,
                        lastUpdated: serverTimestamp(),
                        itemName,
                        counterType,
                        createdAt: serverTimestamp()
                    });
                }
            });

            if (process.env.NODE_ENV === 'development') {
                console.log('✅ Analytics: Counter updated in Firebase');
            }
        } catch (error) {
            console.error('❌ Firebase counter error:', error.message);
        }
    }

    // Page timing tracking
    trackPageTiming() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
            const domContentLoadedTime = timing.domContentLoadedEventEnd - timing.navigationStart;

            this.trackEvent('page_timing', {
                pageLoadTime,
                domContentLoadedTime,
                dnsLookupTime: timing.domainLookupEnd - timing.domainLookupStart,
                serverResponseTime: timing.responseEnd - timing.requestStart,
                domRenderTime: timing.domComplete - timing.domLoading
            });
        }
    }

    // Heatmap data collection
    trackMouseClick(x, y, element, elementText = '') {
        this.trackEvent('mouse_click', {
            x,
            y,
            element: element.tagName,
            elementId: element.id,
            elementClass: element.className,
            elementText: elementText.substring(0, 100), // Limit text length
            viewport: `${window.innerWidth}x${window.innerHeight}`
        });
    }

    // A/B Testing support
    trackABTest(testName, variant, action = 'view') {
        this.trackEvent('ab_test', {
            testName,
            variant,
            action
        });
    }

    // Conversion funnel tracking
    trackFunnelStep(funnelName, stepName, stepNumber, additionalData = {}) {
        this.trackEvent('funnel_step', {
            funnelName,
            stepName,
            stepNumber,
            ...additionalData
        });
    }

    // Method to enable Firebase writes when security rules are configured
    enableFirebase() {
        this.enableFirebaseWrites = true;
        if (process.env.NODE_ENV === 'development') {
            console.log('🔥 Firebase writes enabled');
        }
    }

    // Method to disable Firebase writes
    disableFirebase() {
        this.enableFirebaseWrites = false;
        if (process.env.NODE_ENV === 'development') {
            console.log('🔥 Firebase writes disabled');
        }
    }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;