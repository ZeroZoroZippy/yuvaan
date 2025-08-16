import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../config/firebase';

const ChatbotAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalConversations: 0,
    totalMessages: 0,
    averageConversationLength: 0,
    topTopics: [],
    topIntents: [],
    sentimentBreakdown: {},
    leadQualityBreakdown: {},
    recentConversations: [],
    conversionPotential: {},
    popularQuestions: [],
    responseEffectiveness: {}
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchChatbotAnalytics();
  }, [timeRange]);

  const fetchChatbotAnalytics = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const timeRanges = {
        '1d': new Date(now.getTime() - 24 * 60 * 60 * 1000),
        '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      };
      const startDate = timeRanges[timeRange];

      // Fetch chatbot interactions
      const interactionsQuery = query(
        collection(db, 'analytics_interactions'),
        where('uploadTime', '>=', startDate),
        orderBy('uploadTime', 'desc'),
        limit(1000)
      );
      const interactionsSnapshot = await getDocs(interactionsQuery);
      const interactions = interactionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Process chatbot-specific data
      const processedAnalytics = processChatbotData(interactions);
      setAnalytics(processedAnalytics);
    } catch (error) {
      console.error('Error fetching chatbot analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processChatbotData = (interactions) => {
    let totalConversations = 0;
    let totalMessages = 0;
    let conversationLengths = [];
    const topicCounts = {};
    const intentCounts = {};
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
    const leadQualityCounts = { high: 0, medium: 0, low: 0 };
    const conversionPotentialCounts = { high: 0, medium: 0, low: 0 };
    const recentConversations = [];
    const questionTypes = {};

    // Process interactions to extract chatbot data
    interactions.forEach(batch => {
      if (batch.interactions) {
        batch.interactions.forEach(interaction => {
          if (interaction.eventType === 'chatbot_session') {
            totalConversations++;
            conversationLengths.push(interaction.messageCount || 0);
            
            // Count topics
            if (interaction.topics) {
              interaction.topics.forEach(topic => {
                topicCounts[topic] = (topicCounts[topic] || 0) + 1;
              });
            }
            
            // Count intents
            if (interaction.intents) {
              interaction.intents.forEach(intent => {
                intentCounts[intent] = (intentCounts[intent] || 0) + 1;
              });
            }
            
            // Count sentiments
            if (interaction.sentiment) {
              sentimentCounts[interaction.sentiment] = (sentimentCounts[interaction.sentiment] || 0) + 1;
            }
            
            // Count lead quality
            if (interaction.leadQuality) {
              leadQualityCounts[interaction.leadQuality] = (leadQualityCounts[interaction.leadQuality] || 0) + 1;
            }
            
            // Count conversion potential
            if (interaction.conversionPotential) {
              conversionPotentialCounts[interaction.conversionPotential] = (conversionPotentialCounts[interaction.conversionPotential] || 0) + 1;
            }
            
            // Add to recent conversations
            if (recentConversations.length < 10) {
              recentConversations.push({
                id: interaction.conversationId,
                duration: interaction.duration,
                messageCount: interaction.messageCount,
                topics: interaction.topics || [],
                sentiment: interaction.sentiment,
                leadQuality: interaction.leadQuality,
                timestamp: interaction.timestamp
              });
            }
          }
          
          if (interaction.eventType === 'chatbot_message' && interaction.sender === 'user') {
            totalMessages++;
            
            // Count question types
            if (interaction.messageType) {
              questionTypes[interaction.messageType] = (questionTypes[interaction.messageType] || 0) + 1;
            }
          }
        });
      }
    });

    // Calculate averages and sort data
    const averageConversationLength = conversationLengths.length > 0 
      ? conversationLengths.reduce((a, b) => a + b, 0) / conversationLengths.length 
      : 0;

    const topTopics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));

    const topIntents = Object.entries(intentCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([intent, count]) => ({ intent, count }));

    const popularQuestions = Object.entries(questionTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([type, count]) => ({ type, count }));

    return {
      totalConversations,
      totalMessages,
      averageConversationLength: Math.round(averageConversationLength * 10) / 10,
      topTopics,
      topIntents,
      sentimentBreakdown: sentimentCounts,
      leadQualityBreakdown: leadQualityCounts,
      recentConversations,
      conversionPotential: conversionPotentialCounts,
      popularQuestions,
      responseEffectiveness: calculateResponseEffectiveness(interactions)
    };
  };

  const calculateResponseEffectiveness = (interactions) => {
    // Analyze how effective bot responses are based on user follow-up behavior
    let effectiveResponses = 0;
    let totalResponses = 0;
    
    interactions.forEach(batch => {
      if (batch.interactions) {
        batch.interactions.forEach(interaction => {
          if (interaction.eventType === 'chatbot_session') {
            totalResponses++;
            if (interaction.messageCount > 3 && interaction.sentiment === 'positive') {
              effectiveResponses++;
            }
          }
        });
      }
    });
    
    return {
      effectivenessRate: totalResponses > 0 ? Math.round((effectiveResponses / totalResponses) * 100) : 0,
      totalResponses,
      effectiveResponses
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#45372B] flex items-center justify-center">
        <div className="text-[#A8977A] text-xl">Loading chatbot analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#45372B] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#A8977A]" style={{ fontFamily: 'Syne, sans-serif' }}>
            Saarth Chatbot Analytics
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
          <MetricCard title="Total Conversations" value={analytics.totalConversations} />
          <MetricCard title="Total Messages" value={analytics.totalMessages} />
          <MetricCard title="Avg. Conversation Length" value={`${analytics.averageConversationLength} msgs`} />
          <MetricCard title="Response Effectiveness" value={`${analytics.responseEffectiveness.effectivenessRate}%`} />
        </div>

        {/* Sentiment and Lead Quality */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#161711] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Conversation Sentiment
            </h2>
            <div className="space-y-3">
              {Object.entries(analytics.sentimentBreakdown).map(([sentiment, count]) => (
                <div key={sentiment} className="flex justify-between items-center">
                  <span className="text-[#A8977A]/80 capitalize">{sentiment}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${
                      sentiment === 'positive' ? 'bg-green-500' :
                      sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-[#A8977A] font-semibold">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#161711] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Lead Quality
            </h2>
            <div className="space-y-3">
              {Object.entries(analytics.leadQualityBreakdown).map(([quality, count]) => (
                <div key={quality} className="flex justify-between items-center">
                  <span className="text-[#A8977A]/80 capitalize">{quality}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${
                      quality === 'high' ? 'bg-green-500' :
                      quality === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-[#A8977A] font-semibold">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Topics and Intents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#161711] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Popular Topics
            </h2>
            <div className="space-y-3">
              {analytics.topTopics.map((topic, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-[#A8977A]/80 capitalize">{topic.topic.replace('_', ' ')}</span>
                  <span className="text-[#A8977A] font-semibold">{topic.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#161711] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              User Intents
            </h2>
            <div className="space-y-3">
              {analytics.topIntents.map((intent, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-[#A8977A]/80 capitalize">{intent.intent.replace('_', ' ')}</span>
                  <span className="text-[#A8977A] font-semibold">{intent.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Question Types and Recent Conversations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#161711] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Popular Question Types
            </h2>
            <div className="space-y-3">
              {analytics.popularQuestions.map((question, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-[#A8977A]/80 capitalize">{question.type.replace('_', ' ')}</span>
                  <span className="text-[#A8977A] font-semibold">{question.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#161711] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              Conversion Potential
            </h2>
            <div className="space-y-3">
              {Object.entries(analytics.conversionPotential).map(([potential, count]) => (
                <div key={potential} className="flex justify-between items-center">
                  <span className="text-[#A8977A]/80 capitalize">{potential}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${
                      potential === 'high' ? 'bg-green-500' :
                      potential === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-[#A8977A] font-semibold">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="bg-[#161711] rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Recent Conversations
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[#A8977A]">
              <thead>
                <tr className="border-b border-[#A8977A]/20">
                  <th className="text-left py-2">Conversation ID</th>
                  <th className="text-left py-2">Messages</th>
                  <th className="text-left py-2">Duration</th>
                  <th className="text-left py-2">Topics</th>
                  <th className="text-left py-2">Sentiment</th>
                  <th className="text-left py-2">Lead Quality</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentConversations.map((conversation) => (
                  <tr key={conversation.id} className="border-b border-[#A8977A]/10">
                    <td className="py-2 text-sm">{conversation.id?.substring(0, 15)}...</td>
                    <td className="py-2 text-sm">{conversation.messageCount}</td>
                    <td className="py-2 text-sm">{Math.round(conversation.duration / 1000)}s</td>
                    <td className="py-2 text-sm">{conversation.topics?.slice(0, 2).join(', ')}</td>
                    <td className="py-2 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        conversation.sentiment === 'positive' ? 'bg-green-500/20 text-green-300' :
                        conversation.sentiment === 'negative' ? 'bg-red-500/20 text-red-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {conversation.sentiment}
                      </span>
                    </td>
                    <td className="py-2 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        conversation.leadQuality === 'high' ? 'bg-green-500/20 text-green-300' :
                        conversation.leadQuality === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {conversation.leadQuality}
                      </span>
                    </td>
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
    <h3 className="text-[#A8977A]/80 text-sm mb-2" style={{ fontFamily: 'Neuton, serif' }}>
      {title}
    </h3>
    <p className="text-3xl font-bold text-[#A8977A]" style={{ fontFamily: 'Syne, sans-serif' }}>
      {value}
    </p>
  </div>
);

export default ChatbotAnalyticsDashboard;