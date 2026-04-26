import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import analyticsService from '../services/analyticsService';
import { hasFirebaseConfig, db } from '../config/firebase';

const AnalyticsTest = () => {
  const { trackCTA, trackEvent } = useAnalytics();
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runTests = () => {
    setTestResults([]);
    
    // Test 1: Basic CTA tracking
    try {
      trackCTA('test_cta', 'test_button', { testData: 'analytics_test' });
      addTestResult('CTA Tracking', 'success', 'CTA event tracked successfully');
    } catch (error) {
      addTestResult('CTA Tracking', 'error', error.message);
    }

    // Test 2: Custom event tracking
    try {
      trackEvent('test_event', { 
        testType: 'analytics_verification',
        timestamp: Date.now(),
        userAgent: navigator.userAgent.substring(0, 50)
      });
      addTestResult('Custom Event', 'success', 'Custom event tracked successfully');
    } catch (error) {
      addTestResult('Custom Event', 'error', error.message);
    }

    // Test 3: Session tracking
    try {
      const sessionId = analyticsService.sessionId;
      const userId = analyticsService.userId;
      if (sessionId && userId) {
        addTestResult('Session Tracking', 'success', `Session: ${sessionId.substring(0, 20)}..., User: ${userId.substring(0, 20)}...`);
      } else {
        addTestResult('Session Tracking', 'error', 'Session or User ID not found');
      }
    } catch (error) {
      addTestResult('Session Tracking', 'error', error.message);
    }

    // Test 4: Firebase connection
    try {
      if (hasFirebaseConfig && db) {
        addTestResult('Firebase Connection', 'success', 'Firebase configured and connected');
      } else if (hasFirebaseConfig && !db) {
        addTestResult('Firebase Connection', 'error', 'Firebase configured but database not available');
      } else {
        addTestResult('Firebase Connection', 'warning', 'Firebase not configured - running in offline mode');
      }
    } catch (error) {
      addTestResult('Firebase Connection', 'error', error.message);
    }

    // Test 5: Environment
    try {
      if (typeof window !== 'undefined' && window.location) {
        addTestResult('Environment', 'success', `Running on: ${window.location.hostname}`);
      }
    } catch (error) {
      addTestResult('Environment', 'error', error.message);
    }
  };

  useEffect(() => {
    // Track that analytics test component was loaded
    trackEvent('analytics_test_loaded', {
      component: 'AnalyticsTest',
      timestamp: Date.now()
    });
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-[#45372B] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#161711] rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-[#A8977A] mb-6" style={{ fontFamily: 'var(--font-sans)' }}>
            Analytics Test Dashboard
          </h1>
          
          <div className="mb-6 flex gap-4">
            <button
              onClick={runTests}
              className="bg-[#A8977A] text-[#45372B] px-6 py-3 rounded-lg font-semibold hover:bg-[#9a8a6d] transition-colors"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Run Analytics Tests
            </button>
            
            {!analyticsService.enableFirebaseWrites && (
              <button
                onClick={() => {
                  analyticsService.enableFirebase();
                  addTestResult('Firebase Enable', 'success', 'Firebase writes enabled - set up security rules first!');
                }}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Enable Firebase (After Security Rules)
              </button>
            )}
            
            {analyticsService.enableFirebaseWrites && (
              <button
                onClick={() => {
                  analyticsService.disableFirebase();
                  addTestResult('Firebase Disable', 'warning', 'Firebase writes disabled - back to safe mode');
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Disable Firebase
              </button>
            )}
          </div>

          {testResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#A8977A] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
                Test Results
              </h2>
              
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    result.status === 'success' 
                      ? 'bg-green-900/20 border-green-500 text-green-300' 
                      : result.status === 'warning'
                      ? 'bg-yellow-900/20 border-yellow-500 text-yellow-300'
                      : 'bg-red-900/20 border-red-500 text-red-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{result.test}</h3>
                      <p className="text-sm opacity-80">{result.message}</p>
                    </div>
                    <span className="text-xs opacity-60">{result.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-[#A8977A]/10 rounded-lg">
            <h3 className="text-lg font-semibold text-[#A8977A] mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
              Analytics Information
            </h3>
            <div className="text-[#A8977A]/80 text-sm space-y-1" style={{ fontFamily: 'var(--font-sans)' }}>
              <p><strong>Firebase Status:</strong> {hasFirebaseConfig ? '✅ Configured' : '⚠️ Not configured'}</p>
              <p><strong>Database Status:</strong> {db ? '✅ Connected' : '❌ Not connected'}</p>
              <p><strong>Firebase Writes:</strong> {analyticsService.enableFirebaseWrites ? '✅ Enabled' : '🔥 Disabled (Safe Mode)'}</p>
              <p><strong>Session ID:</strong> {analyticsService.sessionId}</p>
              <p><strong>User ID:</strong> {analyticsService.userId}</p>
              <p><strong>Page Load Time:</strong> {new Date(analyticsService.pageLoadTime).toLocaleString()}</p>
              <p><strong>Interactions Queue:</strong> {analyticsService.interactions.length} pending</p>
              <p><strong>Mode:</strong> {analyticsService.enableFirebaseWrites ? '🔥 Live Firebase' : '💻 Safe Development Mode'}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">
              {hasFirebaseConfig && db ? 'System Status' : 'Setup Required'}
            </h3>
            {analyticsService.enableFirebaseWrites ? (
              <ul className="text-green-200 text-sm space-y-1">
                <li>✅ Firebase writes are enabled</li>
                <li>✅ Analytics data is being sent to Firestore</li>
                <li>✅ Check Firebase Console → Firestore for live data</li>
                <li>✅ All user interactions are being tracked and stored</li>
              </ul>
            ) : (
              <ul className="text-yellow-200 text-sm space-y-1">
                <li>🔥 Analytics running in Safe Mode (no Firebase errors)</li>
                <li>📊 All events tracked and logged to browser console</li>
                <li>🛡️ No 400 Bad Request errors from Firebase</li>
                <li>📋 To enable Firebase: Set up security rules (see FIRESTORE_SETUP.md)</li>
                <li>🚀 Call analyticsService.enableFirebase() when ready</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTest;