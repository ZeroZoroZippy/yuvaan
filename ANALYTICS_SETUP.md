# Google Firestore Analytics Implementation

## Overview
This implementation provides comprehensive analytics tracking for your portfolio website using Google Firestore. It tracks every user interaction, CTA click, form submission, and user behavior.

## Features Implemented

### 1. **Complete User Journey Tracking**
- Page views and navigation patterns
- Session duration and user engagement
- Scroll depth tracking
- Page visibility changes
- Performance metrics

### 2. **CTA and Button Analytics**
- All navbar links (Logo, About, Blog, Talk to Saarth)
- Mobile menu interactions
- Contact form triggers
- Project expansion/collapse
- External link clicks
- Social media clicks

### 3. **Form Analytics**
- Field-level interactions (focus, blur, input)
- Form submission tracking
- Success/failure rates
- Form abandonment analysis
- Both contact forms (modal and about page)

### 4. **Chatbot Analytics**
- Open/close events
- Message count tracking
- Session duration
- Context tracking (desktop/mobile)

### 5. **Project and Content Analytics**
- Project view tracking
- Blog post clicks
- External link tracking
- Content engagement metrics

### 6. **Advanced Features**
- Real-time data collection
- Batch upload for performance
- Error tracking and monitoring
- A/B testing support
- Conversion funnel tracking
- Heatmap data collection

## Setup Instructions

### 1. **Firebase Project Setup**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database
4. Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Analytics collections - allow read/write for authenticated users
    match /analytics_sessions/{document} {
      allow read, write: if true; // Adjust based on your security needs
    }
    match /analytics_interactions/{document} {
      allow read, write: if true;
    }
    match /analytics_counters/{document} {
      allow read, write: if true;
    }
  }
}
```

### 2. **Environment Variables**

Create a `.env` file in the `client` directory:

```bash
# Copy from .env.example
cp client/.env.example client/.env
```

Fill in your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. **Firestore Collections Structure**

The system creates these collections automatically:

#### `analytics_sessions`
```javascript
{
  sessionId: "session_timestamp_randomId",
  userId: "user_timestamp_randomId",
  startTime: Timestamp,
  userAgent: "browser info",
  screenResolution: "1920x1080",
  viewport: "1200x800",
  referrer: "https://google.com",
  language: "en-US",
  timezone: "America/New_York",
  url: "https://yoursite.com/",
  path: "/",
  isNewUser: true
}
```

#### `analytics_interactions`
```javascript
{
  sessionId: "session_id",
  userId: "user_id",
  interactions: [
    {
      eventType: "cta_click",
      timestamp: 1640995200000,
      ctaName: "navbar_logo",
      ctaType: "logo",
      url: "https://yoursite.com/",
      path: "/",
      // ... additional event data
    }
  ],
  uploadTime: Timestamp,
  batchSize: 10
}
```

#### `analytics_counters`
```javascript
{
  count: 42,
  lastUpdated: Timestamp,
  itemName: "navbar_logo",
  counterType: "cta_clicks",
  createdAt: Timestamp
}
```

### 4. **Analytics Dashboard Access**

To view analytics, you can:

1. **Use Firebase Console**: Go to Firestore in your Firebase project
2. **Create a dashboard route** (optional):

```javascript
// Add to your App.js routes
<Route path="/analytics" element={<AnalyticsDashboard />} />
```

3. **Query data programmatically**:

```javascript
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from './config/firebase';

const getAnalytics = async () => {
  const sessionsQuery = query(collection(db, 'analytics_sessions'));
  const snapshot = await getDocs(sessionsQuery);
  return snapshot.docs.map(doc => doc.data());
};
```

## Tracked Events

### Navigation Events
- `navbar_logo` - Logo clicks
- `navbar_about_desktop/mobile` - About page navigation
- `navbar_blog` - Blog page navigation
- `navbar_talk_to_saarth` - Chatbot trigger
- `navbar_mobile_menu` - Mobile menu toggle

### Contact Form Events
- `contact_arrow` - Contact modal trigger
- `contact_modal_open` - Modal opened
- `contact_modal_close` - Modal closed
- `contact_form_success` - Form submitted successfully
- `contact_modal_send_another` - Send another message

### Project Events
- `project_[name]_expand` - Project expanded
- `project_[name]_close` - Project collapsed
- `project_dental_external_link` - External project link

### Social Media Events
- `footer_linkedin/instagram` - Footer social links
- `about_linkedin/instagram_link` - About page social links

### Blog Events
- `blog_post_click` - Blog post clicked
- `blog_post_click_mobile` - Mobile blog post click

### Chatbot Events
- `chatbot_message_send` - Message sent
- `chatbot_close_desktop/mobile` - Chatbot closed

### Form Field Events
- Field focus, blur, and input events
- Form submission success/failure
- Form abandonment tracking

## Data Analysis

### Key Metrics to Monitor

1. **Conversion Rates**
   - Contact form submissions / Total sessions
   - Chatbot engagement rate
   - Social media click-through rate

2. **User Engagement**
   - Average session duration
   - Pages per session
   - Scroll depth percentages

3. **Content Performance**
   - Most clicked CTAs
   - Popular blog posts
   - Project engagement rates

4. **Technical Metrics**
   - Page load times
   - Error rates
   - Device/browser distribution

### Sample Queries

```javascript
// Get top CTAs
const getTopCTAs = async () => {
  const countersQuery = query(
    collection(db, 'analytics_counters'),
    where('counterType', '==', 'cta_clicks'),
    orderBy('count', 'desc'),
    limit(10)
  );
  return await getDocs(countersQuery);
};

// Get conversion rate
const getConversionRate = async () => {
  const sessions = await getDocs(collection(db, 'analytics_sessions'));
  const submissions = await getDocs(
    query(
      collection(db, 'analytics_counters'),
      where('counterType', '==', 'form_submissions')
    )
  );
  
  const totalSessions = sessions.size;
  const totalSubmissions = submissions.docs.reduce((sum, doc) => sum + doc.data().count, 0);
  
  return (totalSubmissions / totalSessions) * 100;
};
```

## Privacy and Compliance

### Data Collection
- No personally identifiable information (PII) is stored
- Email addresses are marked as "provided" or "empty"
- Form content is stored as character counts, not actual content
- IP addresses are not collected

### GDPR Compliance
- Users can be identified by anonymous user IDs
- Session data can be deleted by user ID
- No tracking cookies are used
- All data is stored securely in Firebase

### Data Retention
- Implement data retention policies in Firebase
- Consider automatic deletion of old analytics data
- Provide user data deletion endpoints if needed

## Performance Considerations

### Optimization Features
- Batch uploads every 30 seconds
- Critical events uploaded immediately
- Efficient data structure for queries
- Minimal impact on user experience

### Monitoring
- Track analytics service errors
- Monitor Firebase usage and costs
- Set up alerts for unusual patterns

## Testing Your Implementation

### Analytics Test Component

A test component has been created to verify your analytics setup. To access it:

**Option 1: Add a temporary route (recommended for testing)**
```javascript
// In your App.js, add this route temporarily
<Route path="/analytics-test" element={<AnalyticsTest />} />
```

**Option 2: Direct URL access**
Visit `http://localhost:3000/analytics-test` after adding the route.

The test component will:
- ✅ Verify all analytics functions work
- ✅ Show Firebase connection status  
- ✅ Display session and user information
- ✅ Test event tracking in real-time
- ✅ Provide setup guidance

### Manual Testing Checklist

Test these interactions to verify tracking:

**Navigation:**
- [ ] Click logo in navbar
- [ ] Click "About" link (desktop & mobile)
- [ ] Click "Blog" link
- [ ] Click "Talk to Saarth" button
- [ ] Toggle mobile menu

**Contact Forms:**
- [ ] Open contact modal (arrow click)
- [ ] Fill form fields (focus/blur/input events)
- [ ] Submit contact form
- [ ] Test about page contact form

**Content Engagement:**
- [ ] Expand/collapse projects
- [ ] Click external project links
- [ ] Click blog post cards
- [ ] Open/close chatbot
- [ ] Send chatbot messages

**Social Media:**
- [ ] Click LinkedIn/Instagram in footer
- [ ] Click social links on about page

## Troubleshooting

### Common Issues

1. **ESLint Errors**
   - Fixed: Use `window.screen` instead of global `screen`
   - All ESLint issues have been resolved

2. **Firebase Connection Errors**
   - Check environment variables in `.env`
   - Verify Firebase project settings
   - Ensure Firestore is enabled
   - Check browser console for Firebase errors

3. **Missing Analytics Data**
   - Check browser console for errors
   - Verify Firebase security rules
   - Test with Firebase emulator
   - Use Analytics Test component

4. **Performance Issues**
   - Monitor batch upload frequency (30 seconds)
   - Check for memory leaks
   - Optimize query patterns

### Debug Mode

Enable debug logging:

```javascript
// In analyticsService.js
const DEBUG = process.env.REACT_APP_ANALYTICS_DEBUG === 'true';

if (DEBUG) {
  console.log('Analytics event:', eventType, eventData);
}
```

### Verification Script

Use the verification utility:

```javascript
import { verifyAnalyticsImplementation, performHealthCheck } from './utils/analyticsVerification';

// Check implementation status
const verification = verifyAnalyticsImplementation();
console.log('Analytics Status:', verification);

// Perform health check
const health = performHealthCheck();
console.log('Health Check:', health);
```

## Next Steps

1. **Set up Firebase project and configure environment variables**
2. **Deploy and test the analytics implementation**
3. **Create custom dashboards for your specific needs**
4. **Set up automated reports and alerts**
5. **Implement A/B testing for optimization**

## Support

For issues or questions:
1. Check Firebase Console for errors
2. Review browser console logs
3. Test with Firebase emulator for development
4. Monitor Firestore usage in Firebase Console

This implementation provides enterprise-level analytics tracking for your portfolio website with comprehensive user behavior insights and conversion tracking.