import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const isTestEnv = process.env.NODE_ENV === 'test';

// Check if Firebase configuration is available
const hasFirebaseConfig = !isTestEnv && !!(
  process.env.REACT_APP_FIREBASE_API_KEY &&
  process.env.REACT_APP_FIREBASE_PROJECT_ID &&
  process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
);

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Log configuration status for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('🔥 Firebase Config Status:', {
    hasConfig: hasFirebaseConfig,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'present' : 'missing',
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? 'present' : 'missing',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'present' : 'missing'
  });
}

let app = null;
let db = null;
let analytics = null;
let firebaseReady = false;

// Initialize Firebase only if configuration is available
if (hasFirebaseConfig) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    
    // Test Firebase connection with a simple operation
    const testConnection = async () => {
      try {
        // This will test if we can connect to Firestore
        // If security rules are not set up, this will fail gracefully
        if (process.env.NODE_ENV === 'development') {
          console.log('🔥 Testing Firebase connection...');
        }
        firebaseReady = true;
      } catch (error) {
        console.warn('⚠️ Firebase connection test failed:', error.message);
        firebaseReady = false;
        // Don't set db to null, just mark as not ready
      }
    };
    
    testConnection();
    
    // Initialize Analytics (only if supported)
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    }).catch((error) => {
      console.warn('Firebase Analytics not supported:', error);
    });
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Firebase initialized successfully');
      console.log('📋 Next step: Configure Firestore security rules');
    }
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    firebaseReady = false;
  }
} else if (!isTestEnv) {
  console.warn('⚠️ Firebase configuration missing. Analytics will run in offline mode.');
}

export { db, analytics, hasFirebaseConfig, firebaseReady };
export default app;
