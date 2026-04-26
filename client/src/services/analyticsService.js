import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { db, hasFirebaseConfig } from '../config/firebase';

class AnalyticsService {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.pageLoadTime = Date.now();
        this.interactions = [];

        // Chatbot-specific tracking
        this.currentChatbotSession = null;
        this.chatbotMessages = [];

        this.enableFirebaseWrites = true;

        this.initializeSession();
        this.setupVisibilityTracking();
        this.setupScrollTracking();
        this.setupBatchUpload();

        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Analytics Service initialized with enhanced chatbot tracking');
        }
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }

    generateChatbotSessionId() {
        return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }

    getUserId() {
        let userId = localStorage.getItem('analytics_user_id');
        if (!userId) {
            userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
            localStorage.setItem('analytics_user_id', userId);
        }
        return userId;
    }

    async initializeSession() {
        localStorage.setItem('analytics_returning_user', 'true');

        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Analytics: Session initialized');
            console.log(`   Session ID: ${this.sessionId}`);
            console.log(`   User ID: ${this.userId}`);
        }

        if (!this.enableFirebaseWrites || !hasFirebaseConfig || !db) {
            if (process.env.NODE_ENV === 'development') {
                console.log('🔥 Firebase writes disabled - session data not sent to Firebase');
            }
            return;
        }

        try {
            const sessionData = this.sanitizeData({
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
            });

            await addDoc(collection(db, 'analytics_sessions'), sessionData);

            if (process.env.NODE_ENV === 'development') {
                console.log('✅ Analytics: Session saved to Firebase');
            }
        } catch (error) {
            console.error('❌ Firebase session error:', error.message);
            this.handleFirebaseError(error);
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
        }, 30000);

        window.addEventListener('beforeunload', () => {
            if (this.interactions.length > 0) {
                this.uploadBatchInteractions(true);
            }
            // Also close any active chatbot session
            if (this.currentChatbotSession) {
                this.endChatbotSession();
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

        if (!this.enableFirebaseWrites || !hasFirebaseConfig || !db) {
            if (process.env.NODE_ENV === 'development') {
                console.log('🔥 Firebase writes disabled - batch data not sent to Firebase');
            }
            return;
        }

        try {
            // Sanitize batch data to ensure no undefined values
            const sanitizedBatch = batch.map(interaction => this.sanitizeData(interaction));

            const batchData = {
                sessionId: this.sessionId || 'unknown',
                userId: this.userId || 'unknown',
                interactions: sanitizedBatch,
                uploadTime: serverTimestamp(),
                batchSize: sanitizedBatch.length
            };

            // Final sanitization of the entire batch data
            const finalBatchData = this.sanitizeData(batchData);

            if (isSync && navigator.sendBeacon) {
                navigator.sendBeacon('/api/analytics/batch', JSON.stringify(finalBatchData));
            } else {
                await addDoc(collection(db, 'analytics_interactions'), finalBatchData);
                if (process.env.NODE_ENV === 'development') {
                    console.log('✅ Analytics: Batch uploaded to Firebase');
                }
            }
        } catch (error) {
            console.error('❌ Firebase batch upload error:', error.message);
            this.handleFirebaseError(error);
            this.interactions.unshift(...batch);
        }
    }

    handleFirebaseError(error) {
        if (process.env.NODE_ENV === 'development') {
            console.error('🔥 Firebase Error Details:', {
                code: error.code,
                message: error.message,
                enableFirebaseWrites: this.enableFirebaseWrites,
                hasFirebaseConfig,
                dbExists: !!db
            });

            if (error.message.includes('Missing or insufficient permissions')) {
                console.error('🔧 Fix: Update Firestore security rules');
            } else if (error.message.includes('not-found')) {
                console.error('🔧 Fix: Enable Firestore in Firebase Console');
            } else if (error.code === 'failed-precondition') {
                console.error('🔧 Fix: Check Firestore indexes and collection setup');
            }
        }
    }

    trackEvent(eventType, eventData = {}) {
        // Sanitize eventData to remove undefined values
        const sanitizedEventData = this.sanitizeData(eventData);

        const interaction = {
            eventType: eventType || 'unknown',
            timestamp: Date.now(),
            sessionId: this.sessionId || 'unknown',
            userId: this.userId || 'unknown',
            url: window.location.href,
            path: window.location.pathname,
            userAgent: navigator.userAgent || 'unknown',
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            ...sanitizedEventData
        };

        // Final sanitization of the entire interaction object
        const sanitizedInteraction = this.sanitizeData(interaction);
        this.interactions.push(sanitizedInteraction);

        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Analytics Event:', eventType, sanitizedEventData);
        }

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
            'purchase',
            'chatbot_session_end'
        ];
        return criticalEvents.includes(eventType);
    }

    // Sanitize data to remove undefined values and ensure Firebase compatibility
    sanitizeData(data) {
        if (data === null || data === undefined) {
            return null;
        }

        if (Array.isArray(data)) {
            return data.map(item => this.sanitizeData(item)).filter(item => item !== undefined);
        }

        if (typeof data === 'object') {
            const sanitized = {};
            for (const [key, value] of Object.entries(data)) {
                if (value !== undefined) {
                    const sanitizedValue = this.sanitizeData(value);
                    if (sanitizedValue !== undefined) {
                        sanitized[key] = sanitizedValue;
                    }
                }
            }
            return sanitized;
        }

        return data;
    }

    // ENHANCED CHATBOT ANALYTICS METHODS

    // Start a new chatbot session
    async startChatbotSession() {
        const chatbotSessionId = this.generateChatbotSessionId();

        this.currentChatbotSession = {
            sessionId: chatbotSessionId,
            conversationId: `conv_${Date.now()}`,
            startTime: Date.now(),
            messages: [],
            userMessages: 0,
            botMessages: 0,
            topics: new Set(),
            intents: new Set(),
            sentiments: [],
            isActive: true
        };

        this.chatbotMessages = [];

        // Track in analytics_interactions
        this.trackEvent('chatbot_session_start', {
            chatbotSessionId,
            conversationId: this.currentChatbotSession.conversationId
        });

        // Save to dedicated chatbot_sessions collection using setDoc with custom ID
        if (this.enableFirebaseWrites && hasFirebaseConfig && db) {
            try {
                const sessionData = this.sanitizeData({
                    sessionId: chatbotSessionId,
                    conversationId: this.currentChatbotSession?.conversationId,
                    userId: this.userId,
                    webSessionId: this.sessionId,
                    startTime: serverTimestamp(),
                    status: 'active',
                    userAgent: navigator.userAgent,
                    page: window.location.pathname
                });

                // Use setDoc with custom document ID instead of addDoc
                const sessionRef = doc(db, 'chatbot_sessions', chatbotSessionId);
                await setDoc(sessionRef, sessionData);

                if (process.env.NODE_ENV === 'development') {
                    console.log('✅ Chatbot session started in Firebase with ID:', chatbotSessionId);
                }
            } catch (error) {
                console.error('❌ Failed to save chatbot session:', error.message);
            }
        }

        return chatbotSessionId;
    }

    // Track individual chatbot message with enhanced analytics
    async trackChatbotMessage(messageData) {
        if (!messageData || typeof messageData !== 'object') {
            console.warn('Analytics: Invalid messageData provided');
            return;
        }

        const content = messageData.content || messageData.text || '';
        const sender = messageData.sender || 'unknown';
        const messageId = messageData.id || `msg_${Date.now()}`;

        // Enhanced message analysis
        const messageAnalysis = this.sanitizeData({
            id: messageId,
            conversationId: this.currentChatbotSession?.conversationId || 'unknown',
            sender,
            content: this.sanitizeChatbotMessage(content),
            originalLength: content.length,
            wordCount: content.split(' ').filter(word => word.length > 0).length,
            messageType: this.detectMessageType(content),
            sentiment: this.detectSentiment(content),
            topics: this.extractTopics(content),
            intent: this.detectUserIntent(content),
            containsQuestion: content.includes('?'),
            containsContact: this.containsContactInfo(content),
            timestamp: messageData.timestamp || Date.now(),
            responseTime: null // Will be calculated for bot messages
        });

        // Update current session if active
        if (this.currentChatbotSession) {
            this.currentChatbotSession.messages.push(messageAnalysis);

            if (sender === 'user') {
                this.currentChatbotSession.userMessages++;
            } else if (sender === 'bot') {
                this.currentChatbotSession.botMessages++;
                // Calculate response time if there's a previous user message
                const lastUserMessage = [...this.currentChatbotSession.messages]
                    .reverse()
                    .find(msg => msg.sender === 'user');
                if (lastUserMessage) {
                    messageAnalysis.responseTime = messageAnalysis.timestamp - lastUserMessage.timestamp;
                }
            }

            // Collect analytics data
            messageAnalysis.topics.forEach(topic => this.currentChatbotSession.topics.add(topic));
            if (messageAnalysis.intent !== 'unknown') {
                this.currentChatbotSession.intents.add(messageAnalysis.intent);
            }
            this.currentChatbotSession.sentiments.push(messageAnalysis.sentiment);
        }

        // Track in general analytics
        this.trackEvent('chatbot_message', messageAnalysis);

        // Save to dedicated chatbot_messages collection
        if (this.enableFirebaseWrites && hasFirebaseConfig && db) {
            try {
                const messageData = this.sanitizeData({
                    ...messageAnalysis,
                    userId: this.userId,
                    webSessionId: this.sessionId,
                    chatbotSessionId: this.currentChatbotSession?.sessionId,
                    timestamp: serverTimestamp()
                });

                await addDoc(collection(db, 'chatbot_messages'), messageData);

                if (process.env.NODE_ENV === 'development') {
                    console.log('✅ Chatbot message saved to Firebase');
                }
            } catch (error) {
                console.error('❌ Failed to save chatbot message:', error.message);
            }
        }

        return messageAnalysis;
    }

    // End chatbot session with comprehensive analytics
    async endChatbotSession(reason = 'user_close') {
        if (!this.currentChatbotSession) return;

        const session = this.currentChatbotSession;
        const endTime = Date.now();
        const duration = endTime - session.startTime;

        // Calculate session analytics
        const sessionAnalytics = {
            sessionId: session.sessionId,
            conversationId: session.conversationId,
            duration,
            messageCount: session.messages.length,
            userMessageCount: session.userMessages,
            botMessageCount: session.botMessages,
            topics: Array.from(session.topics),
            intents: Array.from(session.intents),
            overallSentiment: this.calculateOverallSentiment(session.sentiments),
            averageResponseTime: this.calculateAverageResponseTime(session.messages),
            leadQuality: this.assessLeadQuality(session),
            conversionPotential: this.assessConversionPotential(session),
            endReason: reason,
            outcome: this.determineConversationOutcome(session)
        };

        // Track session end
        this.trackEvent('chatbot_session_end', sessionAnalytics);

        // Save to chatbot_conversations collection
        if (this.enableFirebaseWrites && hasFirebaseConfig && db) {
            try {
                const conversationData = this.sanitizeData({
                    ...sessionAnalytics,
                    userId: this.userId,
                    webSessionId: this.sessionId,
                    startTime: new Date(session.startTime),
                    endTime: new Date(endTime),
                    timestamp: serverTimestamp(),
                    messages: session.messages.map(msg => this.sanitizeData({
                        id: msg.id,
                        sender: msg.sender,
                        messageType: msg.messageType,
                        sentiment: msg.sentiment,
                        topics: msg.topics,
                        intent: msg.intent,
                        timestamp: new Date(msg.timestamp)
                    }))
                });

                await addDoc(collection(db, 'chatbot_conversations'), conversationData);

                // Update session status using the same document ID we created earlier
                const sessionRef = doc(db, 'chatbot_sessions', session.sessionId);
                await updateDoc(sessionRef, {
                    status: 'completed',
                    endTime: serverTimestamp(),
                    duration,
                    messageCount: session.messages.length,
                    ...sessionAnalytics
                });

                if (process.env.NODE_ENV === 'development') {
                    console.log('✅ Chatbot conversation saved and session updated in Firebase');
                }
            } catch (error) {
                console.error('❌ Failed to save chatbot conversation:', error.message);
            }
        }

        // Clear current session
        this.currentChatbotSession = null;
        this.chatbotMessages = [];

        return sessionAnalytics;
    }

    // Calculate overall sentiment from message sentiments
    calculateOverallSentiment(sentiments) {
        if (sentiments.length === 0) return 'neutral';

        const counts = sentiments.reduce((acc, sentiment) => {
            acc[sentiment] = (acc[sentiment] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).reduce((a, b) => counts[a[0]] > counts[b[0]] ? a : b)[0];
    }

    // Calculate average response time for bot messages
    calculateAverageResponseTime(messages) {
        const responseTimes = messages
            .filter(msg => msg.sender === 'bot' && msg.responseTime)
            .map(msg => msg.responseTime);

        return responseTimes.length > 0
            ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
            : null;
    }

    // Assess lead quality based on conversation data
    assessLeadQuality(session) {
        let score = 0;

        // High engagement (many messages)
        if (session.messages.length >= 8) score += 3;
        else if (session.messages.length >= 4) score += 2;
        else if (session.messages.length >= 2) score += 1;

        // Contains contact information
        if (session.messages.some(msg => msg.containsContact)) score += 3;

        // Shows business intent
        const businessIntents = ['hire_intent', 'pricing_request', 'contact_request'];
        const intentsArray = Array.from(session.intents);
        if (intentsArray.some(intent => businessIntents.includes(intent))) score += 2;

        // Positive sentiment
        if (session.sentiments.filter(s => s === 'positive').length > session.sentiments.length / 2) score += 1;

        // Long session duration (more than 2 minutes)
        if ((Date.now() - session.startTime) > 120000) score += 1;

        if (score >= 7) return 'high';
        if (score >= 4) return 'medium';
        return 'low';
    }

    // Assess conversion potential
    assessConversionPotential(session) {
        const intentsArray = Array.from(session.intents);
        const topicsArray = Array.from(session.topics);

        const conversionIndicators = [
            intentsArray.includes('hire_intent'),
            intentsArray.includes('pricing_request'),
            intentsArray.includes('contact_request'),
            session.messages.some(msg => msg.containsContact),
            session.messages.length >= 5,
            topicsArray.includes('pricing') || topicsArray.includes('contact')
        ];

        const indicatorCount = conversionIndicators.filter(Boolean).length;

        if (indicatorCount >= 4) return 'high';
        if (indicatorCount >= 2) return 'medium';
        return 'low';
    }

    // Determine conversation outcome
    determineConversationOutcome(session) {
        const intentsArray = Array.from(session.intents);

        if (session.messages.some(msg => msg.containsContact)) return 'contact_provided';
        if (intentsArray.includes('hire_intent')) return 'hire_interest';
        if (intentsArray.includes('pricing_request')) return 'pricing_inquiry';
        if (session.messages.length >= 5) return 'engaged_conversation';
        if (session.messages.length >= 2) return 'brief_interaction';
        return 'minimal_engagement';
    }

    // Legacy method for backward compatibility
    trackChatbotInteraction(action, messageCount = 0, context = null, additionalData = {}) {
        try {
            if (action === 'open') {
                return this.startChatbotSession();
            } else if (action === 'close') {
                return this.endChatbotSession('user_close');
            } else if (action === 'message' && additionalData.messageData) {
                // Handle message tracking - call the dedicated message tracking method
                return this.trackChatbotMessage(additionalData.messageData);
            }

            if (action === 'open') {
                this.updateClickCounter('chatbot_opens', 'saarth');
            }

            this.trackEvent('chatbot_interaction', {
                action,
                messageCount,
                context,
                ...additionalData
            });
        } catch (error) {
            console.error('Chatbot interaction tracking failed:', error.message);
        }
    }

    // CTA and Button Tracking
    trackCTAClick(ctaName, ctaType, additionalData = {}) {
        this.trackEvent('cta_click', {
            ctaName,
            ctaType,
            ...additionalData
        });

        this.updateClickCounter('cta_clicks', ctaName);
    }

    // Enhanced updateClickCounter with proper error handling
    async updateClickCounter(counterType, itemName) {
        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Analytics: Counter increment', { counterType, itemName });
        }

        if (!this.enableFirebaseWrites || !hasFirebaseConfig || !db) {
            if (process.env.NODE_ENV === 'development') {
                console.log('🔥 Firebase writes disabled - counter not sent to Firebase');
            }
            return;
        }

        try {
            if (!counterType || !itemName) {
                throw new Error('counterType and itemName are required');
            }

            const safeDocId = `${counterType}_${itemName}`.replace(/[/[\]#]/g, '_');
            const counterRef = doc(db, 'analytics_counters', safeDocId);

            const counterData = this.sanitizeData({
                count: increment(1),
                lastUpdated: serverTimestamp(),
                itemName: String(itemName || 'unknown'),
                counterType: String(counterType || 'unknown')
            });

            await setDoc(counterRef, counterData, { merge: true });

            if (process.env.NODE_ENV === 'development') {
                console.log('✅ Analytics: Counter updated in Firebase');
            }

            return true;

        } catch (error) {
            console.error('❌ Firebase counter error:', error.message);
            this.handleFirebaseError(error);
            return false;
        }
    }

    // Message analysis methods
    sanitizeChatbotMessage(content) {
        if (!content || typeof content !== 'string') {
            return '[EMPTY_MESSAGE]';
        }

        let sanitized = content.toLowerCase();
        sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
        sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');
        sanitized = sanitized.replace(/\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g, '[NAME]');
        sanitized = sanitized.replace(/https?:\/\/[^\s]+/g, '[URL]');
        return sanitized.substring(0, 200);
    }

    detectMessageType(content) {
        if (!content || typeof content !== 'string') return 'empty';
        const lowerContent = content.toLowerCase();

        if (lowerContent.includes('?')) return 'question';
        if (lowerContent.includes('hello') || lowerContent.includes('hi ') || lowerContent.includes('hey')) return 'greeting';
        if (lowerContent.includes('thank') || lowerContent.includes('thanks')) return 'gratitude';
        if (lowerContent.includes('help') || lowerContent.includes('support')) return 'help_request';
        if (lowerContent.includes('contact') || lowerContent.includes('email') || lowerContent.includes('phone')) return 'contact_inquiry';
        if (lowerContent.includes('price') || lowerContent.includes('cost') || lowerContent.includes('quote')) return 'pricing_inquiry';
        if (lowerContent.includes('project') || lowerContent.includes('work') || lowerContent.includes('service')) return 'service_inquiry';
        if (lowerContent.includes('bye') || lowerContent.includes('goodbye')) return 'farewell';

        return 'general';
    }

    detectSentiment(content) {
        if (!content || typeof content !== 'string') return 'neutral';
        const lowerContent = content.toLowerCase();

        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'like', 'happy', 'satisfied', 'perfect', 'awesome'];
        const negativeWords = ['bad', 'terrible', 'hate', 'dislike', 'angry', 'frustrated', 'disappointed', 'awful', 'horrible'];

        const positiveCount = positiveWords.filter(word => lowerContent.includes(word)).length;
        const negativeCount = negativeWords.filter(word => lowerContent.includes(word)).length;

        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }

    containsContactInfo(content) {
        if (!content || typeof content !== 'string') return false;
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
        const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
        return emailRegex.test(content) || phoneRegex.test(content);
    }

    extractTopics(content) {
        if (!content || typeof content !== 'string') return ['general'];
        const lowerContent = content.toLowerCase();
        const topics = [];

        if (lowerContent.includes('website') || lowerContent.includes('web') || lowerContent.includes('site')) topics.push('web_development');
        if (lowerContent.includes('design') || lowerContent.includes('ui') || lowerContent.includes('ux')) topics.push('design');
        if (lowerContent.includes('react') || lowerContent.includes('javascript') || lowerContent.includes('frontend')) topics.push('frontend');
        if (lowerContent.includes('backend') || lowerContent.includes('server') || lowerContent.includes('database')) topics.push('backend');
        if (lowerContent.includes('mobile') || lowerContent.includes('app') || lowerContent.includes('ios') || lowerContent.includes('android')) topics.push('mobile');
        if (lowerContent.includes('price') || lowerContent.includes('cost') || lowerContent.includes('budget')) topics.push('pricing');
        if (lowerContent.includes('timeline') || lowerContent.includes('deadline') || lowerContent.includes('when')) topics.push('timeline');
        if (lowerContent.includes('portfolio') || lowerContent.includes('work') || lowerContent.includes('example')) topics.push('portfolio');
        if (lowerContent.includes('contact') || lowerContent.includes('meeting') || lowerContent.includes('call')) topics.push('contact');

        return topics.length > 0 ? topics : ['general'];
    }

    detectUserIntent(content) {
        if (!content || typeof content !== 'string') return 'unknown';
        const lowerContent = content.toLowerCase();

        if (lowerContent.includes('hire') || lowerContent.includes('work with') || lowerContent.includes('collaborate')) return 'hire_intent';
        if (lowerContent.includes('quote') || lowerContent.includes('estimate') || lowerContent.includes('how much')) return 'pricing_request';
        if (lowerContent.includes('portfolio') || lowerContent.includes('examples') || lowerContent.includes('previous work')) return 'portfolio_request';
        if (lowerContent.includes('contact') || lowerContent.includes('reach') || lowerContent.includes('get in touch')) return 'contact_request';
        if (lowerContent.includes('help') || lowerContent.includes('support') || lowerContent.includes('question')) return 'support_request';
        if (lowerContent.includes('learn') || lowerContent.includes('know more') || lowerContent.includes('tell me')) return 'information_seeking';

        return 'general_inquiry';
    }

    // Utility methods
    checkFirebaseConnection() {
        const status = {
            hasConfig: !!hasFirebaseConfig,
            hasDb: !!db,
            writesEnabled: this.enableFirebaseWrites,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'Not set',
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? 'Set' : 'Missing',
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'Not set'
        };

        console.log('🔥 Firebase Connection Status:', status);
        return status;
    }

    enableFirebase() {
        this.enableFirebaseWrites = true;
        if (process.env.NODE_ENV === 'development') {
            console.log('🔥 Firebase writes enabled');
        }
    }

    disableFirebase() {
        this.enableFirebaseWrites = false;
        if (process.env.NODE_ENV === 'development') {
            console.log('🔥 Firebase writes disabled');
        }
    }

    // Additional tracking methods for completeness
    trackNavigation(from, to, method = 'click') {
        this.trackEvent('navigation', { from, to, method, navigationTime: Date.now() - this.pageLoadTime });
    }

    trackFormInteraction(formName, fieldName, action, value = null) {
        this.trackEvent('form_interaction', {
            formName, fieldName, action,
            value: action === 'input' ? (value ? value.length : 0) : null,
            hasValue: value && value.length > 0
        });
    }

    trackError(errorType, errorMessage, context = null) {
        this.trackEvent('error', { errorType, errorMessage, context, stack: new Error().stack });
    }

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

    // Social Media Tracking
    trackSocialClick(platform, url, context = 'footer') {
        this.trackEvent('social_click', {
            platform,
            url,
            context // 'footer', 'about', 'contact'
        });

        this.updateClickCounter('social_clicks', platform);
    }

    // Form Tracking
    trackFormSubmit(formName, formData, success = true, errorMessage = null) {
        this.trackEvent('form_submit', {
            formName,
            success,
            errorMessage,
            fieldCount: formData ? Object.keys(formData).length : 0
        });

        if (success) {
            this.updateClickCounter('form_submissions', formName);
        }
    }

    // Project Tracking
    trackProjectView(projectName, projectId, viewType = 'expand') {
        this.trackEvent('project_view', {
            projectName,
            projectId,
            viewType
        });

        this.updateClickCounter('project_views', projectId);
    }

    // Mouse Click Tracking for heatmaps
    trackMouseClick(x, y, target, elementName = '') {
        this.trackEvent('mouse_click', {
            x,
            y,
            elementName,
            tagName: target.tagName,
            className: target.className,
            id: target.id
        });
    }

    // Funnel Tracking
    trackFunnelStep(funnelName, stepName, stepNumber, additionalData = {}) {
        this.trackEvent('funnel_step', {
            funnelName,
            stepName,
            stepNumber,
            ...additionalData
        });
    }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;
