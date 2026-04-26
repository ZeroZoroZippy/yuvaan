import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../config/firebase';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalSessions: 0,
    totalInteractions: 0,
    topCTAs: [],
    topPages: [],
    recentSessions: [],
    formSubmissions: 0,
    chatbotInteractions: 0,
    socialClicks: 0,
    projectViews: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d'); // 1d, 7d, 30d
  const conversionRate = analytics.totalSessions > 0
    ? `${((analytics.formSubmissions / analytics.totalSessions) * 100).toFixed(1)}%`
    : '0.0%';

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const timeRanges = {
        '1d': new Date(now.getTime() - 24 * 60 * 60 * 1000),
        '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      };
      const startDate = timeRanges[timeRange];

      // Fetch sessions
      const sessionsQuery = query(
        collection(db, 'analytics_sessions'),
        where('startTime', '>=', startDate),
        orderBy('startTime', 'desc'),
        limit(100)
      );
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessions = sessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch interactions
      const interactionsQuery = query(
        collection(db, 'analytics_interactions'),
        where('uploadTime', '>=', startDate),
        orderBy('uploadTime', 'desc'),
        limit(1000)
      );
      const interactionsSnapshot = await getDocs(interactionsQuery);
      const interactions = interactionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch counters
      const countersQuery = query(collection(db, 'analytics_counters'));
      const countersSnapshot = await getDocs(countersQuery);
      const counters = countersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Process data
      const processedAnalytics = processAnalyticsData(sessions, interactions, counters);
      setAnalytics(processedAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (sessions, interactions, counters) => {
    // Count different types of interactions
    let formSubmissions = 0;
    let chatbotInteractions = 0;
    let socialClicks = 0;
    let projectViews = 0;
    const ctaCounts = {};
    const pageCounts = {};

    // Process interactions
    interactions.forEach(batch => {
      if (batch.interactions) {
        batch.interactions.forEach(interaction => {
          // Count by event type
          switch (interaction.eventType) {
            case 'form_submit':
              formSubmissions++;
              break;
            case 'chatbot_interaction':
              chatbotInteractions++;
              break;
            case 'social_click':
              socialClicks++;
              break;
            case 'project_view':
              projectViews++;
              break;
            case 'cta_click':
              ctaCounts[interaction.ctaName] = (ctaCounts[interaction.ctaName] || 0) + 1;
              break;
          }

          // Count by page
          if (interaction.path) {
            pageCounts[interaction.path] = (pageCounts[interaction.path] || 0) + 1;
          }
        });
      }
    });

    // Process counters
    counters.forEach(counter => {
      switch (counter.counterType) {
        case 'form_submissions':
          formSubmissions += counter.count || 0;
          break;
        case 'chatbot_opens':
          chatbotInteractions += counter.count || 0;
          break;
        case 'social_clicks':
          socialClicks += counter.count || 0;
          break;
        case 'project_views':
          projectViews += counter.count || 0;
          break;
        case 'cta_clicks':
          ctaCounts[counter.itemName] = (ctaCounts[counter.itemName] || 0) + (counter.count || 0);
          break;
      }
    });

    // Sort and get top items
    const topCTAs = Object.entries(ctaCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    const topPages = Object.entries(pageCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    return {
      totalSessions: sessions.length,
      totalInteractions: interactions.reduce((sum, batch) => sum + (batch.batchSize || 0), 0),
      topCTAs,
      topPages,
      recentSessions: sessions.slice(0, 10),
      formSubmissions,
      chatbotInteractions,
      socialClicks,
      projectViews
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#45372B] flex items-center justify-center">
        <div className="text-[#A8977A] text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#45372B] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#A8977A]" style={{ fontFamily: 'var(--font-sans)' }}>
            Analytics Dashboard
          </h1>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[#161711] text-[#A8977A] border border-[#A8977A]/20 rounded-lg px-4 py-2"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard title="Total Sessions" value={analytics.totalSessions} />
          <MetricCard title="Total Interactions" value={analytics.totalInteractions} />
          <MetricCard title="Form Submissions" value={analytics.formSubmissions} />
          <MetricCard title="Chatbot Opens" value={analytics.chatbotInteractions} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard title="Social Clicks" value={analytics.socialClicks} />
          <MetricCard title="Project Views" value={analytics.projectViews} />
          <MetricCard title="Conversion Rate" value={conversionRate} />
        </div>

        {/* Top CTAs and Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#161711] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
              Top CTAs
            </h2>
            <div className="space-y-3">
              {analytics.topCTAs.map((cta, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-[#A8977A]/80">{cta.name}</span>
                  <span className="text-[#A8977A] font-semibold">{cta.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#161711] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
              Top Pages
            </h2>
            <div className="space-y-3">
              {analytics.topPages.map((page, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-[#A8977A]/80">{page.path}</span>
                  <span className="text-[#A8977A] font-semibold">{page.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-[#161711] rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
            Recent Sessions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[#A8977A]">
              <thead>
                <tr className="border-b border-[#A8977A]/20">
                  <th className="text-left py-2">Session ID</th>
                  <th className="text-left py-2">Start Time</th>
                  <th className="text-left py-2">User Agent</th>
                  <th className="text-left py-2">Referrer</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentSessions.map((session) => (
                  <tr key={session.id} className="border-b border-[#A8977A]/10">
                    <td className="py-2 text-sm">{session.sessionId?.substring(0, 20)}...</td>
                    <td className="py-2 text-sm">
                      {session.startTime?.toDate?.()?.toLocaleString() || 'N/A'}
                    </td>
                    <td className="py-2 text-sm max-w-xs truncate">
                      {session.userAgent?.substring(0, 50)}...
                    </td>
                    <td className="py-2 text-sm">{session.referrer || 'Direct'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value }) => (
  <div className="bg-[#161711] rounded-2xl p-6">
    <h3 className="text-[#A8977A]/80 text-sm mb-2" style={{ fontFamily: 'var(--font-sans)' }}>
      {title}
    </h3>
    <p className="text-3xl font-bold text-[#A8977A]" style={{ fontFamily: 'var(--font-sans)' }}>
      {value}
    </p>
  </div>
);

export default AnalyticsDashboard;
