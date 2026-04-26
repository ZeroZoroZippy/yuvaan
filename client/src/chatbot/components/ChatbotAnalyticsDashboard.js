import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

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
    responseEffectiveness: {},
    recentMessages: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);

  const processChatbotData = useCallback((interactions, conversations, messages) => {
    // Process analytics data
    const totalConversations = conversations.length;
    const totalMessages = messages.length;
    const averageConversationLength = totalConversations > 0 ? totalMessages / totalConversations : 0;
    
    return {
      totalConversations,
      totalMessages,
      averageConversationLength,
      topTopics: [],
      topIntents: [],
      sentimentBreakdown: {},
      leadQualityBreakdown: {},
      recentConversations: conversations.slice(0, 10),
      conversionPotential: {},
      popularQuestions: [],
      responseEffectiveness: {},
      recentMessages: messages.slice(0, 20)
    };
  }, []);

  const fetchChatbotAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const timeRanges = {
        '1d': new Date(now.getTime() - 24 * 60 * 60 * 1000),
        '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      };
      const startDate = timeRanges[timeRange];

      console.log('🔍 Fetching chatbot analytics for time range:', timeRange, 'since:', startDate);

      // Fetch chatbot interactions (legacy support)
      let interactions = [];
      try {
        const interactionsQuery = query(
          collection(db, 'analytics_interactions'),
          where('uploadTime', '>=', startDate),
          orderBy('uploadTime', 'desc'),
          limit(1000)
        );
        const interactionsSnapshot = await getDocs(interactionsQuery);
        interactions = interactionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('📊 Found', interactions.length, 'analytics interactions');
      } catch (error) {
        console.warn('⚠️ Error fetching analytics_interactions:', error.message);
      }

      // Fetch chatbot conversations
      let conversations = [];
      try {
        const conversationsQuery = query(
          collection(db, 'chatbot_conversations'),
          where('timestamp', '>=', startDate),
          orderBy('timestamp', 'desc'),
          limit(100)
        );
        const conversationsSnapshot = await getDocs(conversationsQuery);
        conversations = conversationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('💬 Found', conversations.length, 'chatbot conversations');
      } catch (error) {
        console.warn('⚠️ Error fetching chatbot_conversations:', error.message);
      }

      // Fetch recent messages
      let messages = [];
      try {
        const messagesQuery = query(
          collection(db, 'chatbot_messages'),
          where('timestamp', '>=', startDate),
          orderBy('timestamp', 'desc'),
          limit(200)
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        messages = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('📝 Found', messages.length, 'chatbot messages');
      } catch (error) {
        console.warn('⚠️ Error fetching chatbot_messages:', error.message);
      }

      // Fallback: Try to get messages from analytics_interactions if chatbot_messages is empty
      if (messages.length === 0) {
        console.log('🔄 Attempting fallback to analytics_interactions for messages...');
        try {
          const fallbackMessages = [];
          interactions.forEach(batch => {
            if (batch.interactions) {
              batch.interactions.forEach(interaction => {
                if (interaction.eventType === 'chatbot_message') {
                  fallbackMessages.push({
                    id: interaction.timestamp || Date.now(),
                    conversationId: interaction.conversationId || 'unknown',
                    sender: interaction.sender || 'unknown',
                    content: interaction.content || '[No content]',
                    messageType: interaction.messageType,
                    sentiment: interaction.sentiment,
                    topics: interaction.topics || [],
                    intent: interaction.intent,
                    containsContact: interaction.containsContact,
                    timestamp: new Date(interaction.timestamp || Date.now()),
                    wordCount: interaction.wordCount,
                    responseTime: interaction.responseTime
                  });
                }
              });
            }
          });
          messages = fallbackMessages;
          console.log('🔄 Found', messages.length, 'messages in fallback source');
        } catch (error) {
          console.warn('⚠️ Fallback message extraction failed:', error.message);
        }
      }

      // Fallback: Try to get conversations from analytics_interactions if chatbot_conversations is empty
      if (conversations.length === 0) {
        console.log('🔄 Attempting fallback to analytics_interactions for conversations...');
        try {
          const fallbackConversations = [];
          interactions.forEach(batch => {
            if (batch.interactions) {
              batch.interactions.forEach(interaction => {
                if (interaction.eventType === 'chatbot_session_end') {
                  fallbackConversations.push({
                    id: interaction.conversationId || interaction.sessionId,
                    conversationId: interaction.conversationId,
                    sessionId: interaction.sessionId,
                    duration: interaction.duration,
                    messageCount: interaction.messageCount,
                    topics: interaction.topics || [],
                    overallSentiment: interaction.overallSentiment || interaction.sentiment,
                    leadQuality: interaction.leadQuality,
                    conversionPotential: interaction.conversionPotential,
                    outcome: interaction.outcome,
                    timestamp: new Date(interaction.timestamp || Date.now()),
                    startTime: new Date((interaction.timestamp || Date.now()) - (interaction.duration || 0)),
                    endTime: new Date(interaction.timestamp || Date.now())
                  });
                }
              });
            }
          });
          conversations = fallbackConversations;
          console.log('🔄 Found', conversations.length, 'conversations in fallback source');
        } catch (error) {
          console.warn('⚠️ Fallback conversation extraction failed:', error.message);
        }
      }

      // Process all data
      const processedAnalytics = processChatbotData(interactions, conversations, messages);
      setAnalytics(processedAnalytics);
      
      console.log('✅ Analytics processing complete:', {
        totalConversations: processedAnalytics.totalConversations,
        totalMessages: processedAnalytics.totalMessages,
        recentMessages: processedAnalytics.recentMessages.length
      });
      
    } catch (error) {
      console.error('❌ Error fetching chatbot analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange, processChatbotData]);

  useEffect(() => {
    fetchChatbotAnalytics();
  }, [fetchChatbotAnalytics]);

  const fetchConversationMessages = async (conversationId) => {
    try {
      const messagesQuery = query(
        collection(db, 'chatbot_messages'),
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'asc')
      );
      const messagesSnapshot = await getDocs(messagesQuery);
      const messages = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setConversationMessages(messages);
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
    }
  };



  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleString();
  };

  const formatDuration = (duration) => {
    if (!duration) return '0s';
    const seconds = Math.floor(duration / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#A8977A]" style={{ fontFamily: 'var(--font-sans)' }}>
            Saarth Chatbot Analytics
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchChatbotAnalytics}
              className="bg-[#A8977A] text-[#45372B] px-4 py-2 rounded-lg hover:bg-[#A8977A]/80 transition-colors"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Refresh Data
            </button>
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
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-[#161711] rounded-lg p-1">
          {['overview', 'conversations', 'messages'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-[#A8977A] text-[#45372B]'
                  : 'text-[#A8977A] hover:text-white hover:bg-[#A8977A]/10'
              }`}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
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
                <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
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
                <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
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
                <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
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
                <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
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
          </>
        )}

        {activeTab === 'conversations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Conversations List */}
            <div className="bg-[#161711] rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
                Recent Conversations
              </h2>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#A8977A]/30 scrollbar-track-transparent hover:scrollbar-thumb-[#A8977A]/50">
                {analytics.recentConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => {
                      setSelectedConversation(conversation);
                      fetchConversationMessages(conversation.id);
                    }}
                    className="p-4 border border-[#A8977A]/20 rounded-lg hover:bg-[#A8977A]/5 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[#A8977A] text-sm font-mono">
                        {conversation.id?.substring(0, 20)}...
                      </span>
                      <span className="text-[#A8977A]/60 text-xs">
                        {formatTime(conversation.startTime)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[#A8977A]/60">Messages: </span>
                        <span className="text-[#A8977A]">{conversation.messageCount}</span>
                      </div>
                      <div>
                        <span className="text-[#A8977A]/60">Duration: </span>
                        <span className="text-[#A8977A]">{formatDuration(conversation.duration)}</span>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          conversation.leadQuality === 'high' ? 'bg-green-500/20 text-green-300' :
                          conversation.leadQuality === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {conversation.leadQuality}
                        </span>
                      </div>
                    </div>
                    {conversation.topics?.length > 0 && (
                      <div className="mt-2">
                        <span className="text-[#A8977A]/60 text-xs">Topics: </span>
                        <span className="text-[#A8977A] text-xs">
                          {conversation.topics.slice(0, 3).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Conversation Details */}
            <div className="bg-[#161711] rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
                Conversation Details
              </h2>
              {selectedConversation ? (
                <div>
                  <div className="mb-4 p-4 bg-[#45372B]/30 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[#A8977A]/60">Session ID: </span>
                        <span className="text-[#A8977A] font-mono text-xs">
                          {selectedConversation.sessionId?.substring(0, 15)}...
                        </span>
                      </div>
                      <div>
                        <span className="text-[#A8977A]/60">Outcome: </span>
                        <span className="text-[#A8977A]">{selectedConversation.outcome}</span>
                      </div>
                      <div>
                        <span className="text-[#A8977A]/60">Sentiment: </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          selectedConversation.sentiment === 'positive' ? 'bg-green-500/20 text-green-300' :
                          selectedConversation.sentiment === 'negative' ? 'bg-red-500/20 text-red-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {selectedConversation.sentiment}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#A8977A]/60">Conversion: </span>
                        <span className="text-[#A8977A]">{selectedConversation.conversionPotential}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#A8977A]/30 scrollbar-track-transparent hover:scrollbar-thumb-[#A8977A]/50">
                    {conversationMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-[#A8977A]/10 ml-4'
                            : 'bg-[#45372B]/30 mr-4'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`font-semibold text-sm ${
                            message.sender === 'user' ? 'text-[#A8977A]' : 'text-blue-300'
                          }`}>
                            {message.sender === 'user' ? 'User' : 'Saarth'}
                          </span>
                          <span className="text-[#A8977A]/60 text-xs">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-[#A8977A] text-sm mb-2">{message.content}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {message.messageType && (
                            <span className="px-2 py-1 bg-[#A8977A]/20 text-[#A8977A] rounded">
                              {message.messageType}
                            </span>
                          )}
                          {message.sentiment && (
                            <span className={`px-2 py-1 rounded ${
                              message.sentiment === 'positive' ? 'bg-green-500/20 text-green-300' :
                              message.sentiment === 'negative' ? 'bg-red-500/20 text-red-300' :
                              'bg-yellow-500/20 text-yellow-300'
                            }`}>
                              {message.sentiment}
                            </span>
                          )}
                          {message.containsContact && (
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded">
                              Contact Info
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-[#A8977A]/60 py-8">
                  Select a conversation to view details and messages
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-[#161711] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#A8977A] mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
              Recent Messages ({analytics.recentMessages.length})
            </h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#A8977A]/30 scrollbar-track-transparent hover:scrollbar-thumb-[#A8977A]/50">
              {analytics.recentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    message.sender === 'user'
                      ? 'bg-[#A8977A]/5 border-[#A8977A]'
                      : 'bg-blue-500/5 border-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${
                        message.sender === 'user' ? 'text-[#A8977A]' : 'text-blue-300'
                      }`}>
                        {message.sender === 'user' ? 'User' : 'Saarth'}
                      </span>
                      <span className="text-[#A8977A]/60 text-sm font-mono">
                        {message.conversationId?.substring(0, 10)}...
                      </span>
                    </div>
                    <span className="text-[#A8977A]/60 text-sm">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-[#A8977A] mb-3">{message.content}</p>
                  
                  <div className="flex flex-wrap gap-2 text-xs">
                    {message.messageType && (
                      <span className="px-2 py-1 bg-[#A8977A]/20 text-[#A8977A] rounded">
                        {message.messageType.replace('_', ' ')}
                      </span>
                    )}
                    {message.sentiment && (
                      <span className={`px-2 py-1 rounded ${
                        message.sentiment === 'positive' ? 'bg-green-500/20 text-green-300' :
                        message.sentiment === 'negative' ? 'bg-red-500/20 text-red-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {message.sentiment}
                      </span>
                    )}
                    {message.intent && message.intent !== 'unknown' && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                        {message.intent.replace('_', ' ')}
                      </span>
                    )}
                    {message.topics?.length > 0 && (
                      <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded">
                        {message.topics.slice(0, 2).join(', ')}
                      </span>
                    )}
                    {message.containsContact && (
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded">
                        Contact Info
                      </span>
                    )}
                    {message.wordCount && (
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded">
                        {message.wordCount} words
                      </span>
                    )}
                    {message.responseTime && message.sender === 'bot' && (
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded">
                        {(message.responseTime / 1000).toFixed(1)}s response
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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

export default ChatbotAnalyticsDashboard;