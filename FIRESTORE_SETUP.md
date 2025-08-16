# Firestore Security Rules Setup

## Quick Fix for 400 Bad Request Errors

The 400 Bad Request errors you're seeing are due to Firestore security rules not being configured. Here's how to fix it:

## Step 1: Configure Firestore Security Rules

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `yuvaan-vithlani`
3. **Navigate to Firestore Database**
4. **Click on "Rules" tab**
5. **Replace the default rules with these:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to analytics collections
    match /analytics_sessions/{document} {
      allow read, write: if true;
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

6. **Click "Publish"**

## Step 2: Enable Firebase Writes in Code

After setting up the security rules, enable Firebase writes:

```javascript
// In your browser console or temporarily in code:
import analyticsService from './services/analyticsService';
analyticsService.enableFirebase();
```

## Alternative: Test Mode (Temporary)

For quick testing, you can use test mode rules (⚠️ **NOT for production**):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // WARNING: These rules allow anyone to read/write. Use only for testing!
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Current Status

Right now, your analytics system is working in **safe mode**:
- ✅ All events are tracked and logged to console
- ✅ No Firebase errors or crashes
- ✅ All user interactions are captured
- ⚠️ Data is not saved to Firebase (until security rules are configured)

## Production-Ready Security Rules

For production, use more restrictive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Analytics collections - allow writes but restrict reads
    match /analytics_sessions/{document} {
      allow write: if true;
      allow read: if false; // Prevent public reading of analytics data
    }
    match /analytics_interactions/{document} {
      allow write: if true;
      allow read: if false;
    }
    match /analytics_counters/{document} {
      allow write: if true;
      allow read: if request.auth != null; // Only authenticated users can read counters
    }
  }
}
```

## Verification

After setting up the rules:

1. **Check browser console** - Should see "✅ Firebase writes enabled"
2. **Visit `/analytics-test`** - Should show Firebase as connected
3. **Check Firebase Console** - Should see data appearing in collections
4. **No more 400 errors** - Firebase operations should work smoothly

## Need Help?

If you're still seeing issues:
1. Check that the rules are published in Firebase Console
2. Wait 1-2 minutes for rules to propagate
3. Refresh your browser
4. Check browser console for any remaining errors

Your analytics system is robust and will work perfectly once the security rules are configured! 🚀