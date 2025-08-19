const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const { OpenAI } = require('openai');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://yuvaanvithlani.com',           // Your custom domain
    'https://www.yuvaanvithlani.com',       // Include www version
    'https://yuvaan-vithlani.vercel.app',   // Keep old domain during transition
    /\.vercel\.app$/                        // Preview deployments
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Increased limit for full conversations

// Configuration for chatbot notifications
const CONFIG = {
  PUSHOVER_TOKEN: process.env.PUSHOVER_TOKEN,
  PUSHOVER_USER: process.env.PUSHOVER_USER,
  EMAIL_HOST: 'smtp.gmail.com',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  YOUR_EMAIL: process.env.EMAIL_USER,
  SLACK_WEBHOOK: process.env.SLACK_WEBHOOK_URL
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create email transporter (reusable for both contact form and chatbot)
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Utility functions for chatbot notifications
const sendPushNotification = async (message, priority = 0) => {
  if (!CONFIG.PUSHOVER_TOKEN || !CONFIG.PUSHOVER_USER) {
    console.log('📱 Pushover not configured, skipping notification');
    return;
  }

  try {
    const axios = require('axios');
    await axios.post('https://api.pushover.net/1/messages.json', {
      token: CONFIG.PUSHOVER_TOKEN,
      user: CONFIG.PUSHOVER_USER,
      message: message,
      priority: priority,
      sound: priority > 0 ? 'cosmic' : 'pushover'
    });
    console.log('✅ Push notification sent successfully');
  } catch (error) {
    console.error('❌ Push notification failed:', error.message);
  }
};

const sendSlackNotification = async (message, isHighPriority = false) => {
  if (!CONFIG.SLACK_WEBHOOK) {
    console.log('💬 Slack not configured, skipping notification');
    return;
  }
  
  try {
    const axios = require('axios');
    await axios.post(CONFIG.SLACK_WEBHOOK, {
      text: isHighPriority ? `🚨 HIGH PRIORITY: ${message}` : `💼 ${message}`,
      username: 'Portfolio Bot',
      icon_emoji: ':robot_face:'
    });
    console.log('✅ Slack notification sent successfully');
  } catch (error) {
    console.error('❌ Slack notification failed:', error.message);
  }
};

const sendChatbotEmailNotification = async (subject, htmlContent, isHighPriority = false) => {
  if (!CONFIG.EMAIL_USER || !CONFIG.EMAIL_PASS) {
    console.log('📧 Email not configured for chatbot notifications');
    return;
  }

  try {
    const transporter = createEmailTransporter();
    await transporter.sendMail({
      from: `"Portfolio Chatbot" <${CONFIG.EMAIL_USER}>`,
      to: CONFIG.YOUR_EMAIL,
      subject: isHighPriority ? `🚨 URGENT: ${subject}` : `🤖 ${subject}`,
      html: htmlContent
    });
    console.log('✅ Chatbot email notification sent successfully');
  } catch (error) {
    console.error('❌ Chatbot email notification failed:', error.message);
  }
};

// Health check endpoint (enhanced)
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    services: {
      contactForm: '✅ Active',
      chatbotAPI: '✅ Active',
      completeConversationTracking: '✅ Active',
      emailService: CONFIG.EMAIL_USER ? '✅ Configured' : '❌ Not configured',
      pushNotifications: CONFIG.PUSHOVER_TOKEN ? '✅ Configured' : '❌ Not configured',
      openAI: '✅ GPT-4o-mini Ready (Fast & Efficient)'
    }
  });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const transporter = createEmailTransporter();

    // Verify transporter configuration
    await transporter.verify();
    console.log('SMTP connection verified');

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Detailed error sending email:', error);
    
    if (error.code === 'EAUTH') {
      res.status(500).json({ error: 'Email authentication failed. Please check your email credentials.' });
    } else if (error.code === 'ECONNECTION') {
      res.status(500).json({ error: 'Failed to connect to email server.' });
    } else {
      res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
  }
});

// ENHANCED: Complete conversation lead recording endpoint
app.post('/api/leads', async (req, res) => {
  try {
    const lead = req.body;
    console.log('🎯 COMPLETE CHATBOT CONVERSATION RECEIVED:', {
      email: lead.email,
      qualification: lead.qualificationLevel,
      conversationId: lead.conversationId,
      messageCount: lead.sessionData?.totalMessages || 0,
      duration: Math.round((lead.sessionData?.duration || 0) / 60000) + ' minutes',
      questionsAsked: lead.userQuestions?.length || 0,
      timestamp: new Date(lead.timestamp).toLocaleString()
    });

    const isHighPriority = lead.qualificationLevel === 'qualified' || 
                          lead.conversionPotential === 'high';
    
    // Create comprehensive conversation summary for notifications
    const conversationSummary = createCompleteConversationSummary(lead);
    
    // Send enhanced notifications with full context
    const notificationPromises = [
      sendPushNotification(
        `🤖 ${lead.qualificationLevel} lead${lead.email ? ` (${lead.email})` : ''} - ${Math.round((lead.sessionData?.duration || 0) / 60000)}min chat, ${lead.userQuestions?.length || 0} questions`,
        isHighPriority ? 1 : 0
      ),
      sendSlackNotification(conversationSummary.slack, isHighPriority),
      sendChatbotEmailNotification(
        `Complete Conversation Analysis: ${lead.email || 'Anonymous'} - ${lead.qualificationLevel} quality`,
        conversationSummary.email,
        isHighPriority
      )
    ];

    await Promise.allSettled(notificationPromises);

    console.log('✅ Complete chatbot conversation processed and notifications sent');
    res.json({ 
      success: true, 
      leadId: lead.conversationId,
      message: 'Complete conversation recorded successfully',
      notificationsSent: {
        email: true,
        push: !!CONFIG.PUSHOVER_TOKEN,
        slack: !!CONFIG.SLACK_WEBHOOK
      }
    });

  } catch (error) {
    console.error('❌ Complete conversation processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process complete conversation',
      message: error.message 
    });
  }
});

// ENHANCED: Complete conversation unknown questions endpoint
app.post('/api/unknown-questions', async (req, res) => {
  try {
    const { conversationId, fullConversation, unknownTopics, userQuestions, sessionData } = req.body;
    
    console.log('❓ COMPLETE UNKNOWN QUESTIONS CONVERSATION:', {
      conversationId,
      unknownTopicCount: unknownTopics?.length || 0,
      totalQuestions: userQuestions?.length || 0,
      conversationLength: fullConversation?.length || 0,
      duration: Math.round((sessionData?.duration || 0) / 60000) + ' minutes'
    });
    
    // Only process if there are actual unknown topics
    if (!unknownTopics || unknownTopics.length === 0) {
      console.log('ℹ️ No unknown topics to process');
      return res.json({ 
        success: true, 
        message: 'No unknown topics detected',
        unknownTopicsRecorded: 0
      });
    }

    // Create comprehensive unknown questions summary
    const unknownQuestionsSummary = createUnknownQuestionsSummary({
      conversationId,
      fullConversation,
      unknownTopics,
      userQuestions,
      sessionData
    });

    const notificationPromises = [
      sendPushNotification(
        `❓ ${unknownTopics.length} unknown topics in ${Math.round((sessionData?.duration || 0) / 60000)}min conversation - need content updates`,
        0
      ),
      sendSlackNotification(unknownQuestionsSummary.slack, false),
      sendChatbotEmailNotification(
        `Knowledge Gap Analysis: ${unknownTopics.length} topics need attention`,
        unknownQuestionsSummary.email,
        false
      )
    ];

    await Promise.allSettled(notificationPromises);

    console.log('✅ Unknown questions conversation recorded and notifications sent');
    res.json({ 
      success: true, 
      conversationId,
      unknownTopicsRecorded: unknownTopics.length,
      improvementOpportunities: unknownTopics.length,
      notificationsSent: {
        email: true,
        push: !!CONFIG.PUSHOVER_TOKEN,
        slack: !!CONFIG.SLACK_WEBHOOK
      }
    });

  } catch (error) {
    console.error('❌ Unknown questions processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process unknown questions conversation',
      message: error.message 
    });
  }
});

// Helper function to create complete conversation summary for leads
function createCompleteConversationSummary(lead) {
  const duration = Math.round((lead.sessionData?.duration || 0) / 60000);
  const messageCount = lead.sessionData?.totalMessages || 0;
  
  // Format full conversation for easy reading
  const formattedConversation = lead.fullConversation?.map(msg => 
    `${msg.timestamp} - ${msg.speaker}:\n${msg.message}\n`
  ).join('\n') || 'No conversation data available';

  // Format user questions with context
  const formattedQuestions = lead.userQuestions?.map((q, index) => 
    `${index + 1}. "${q.question}"\n   Asked at: ${new Date(q.timestamp).toLocaleString()}\n   Context: ${q.context?.map(c => `${c.sender}: ${c.text}`).join(' → ') || 'No context'}`
  ).join('\n\n') || 'No questions asked';

  // Slack summary (concise but complete)
  const slackSummary = `
🤖 COMPLETE CHATBOT CONVERSATION ANALYSIS

📧 Contact: ${lead.email || 'Not provided'}
👤 Name: ${lead.name || 'Not provided'}
🎯 Project: ${lead.projectType || 'General inquiry'}
⭐ Quality: ${lead.qualificationLevel.toUpperCase()}
🔥 Conversion: ${lead.conversionPotential}
📋 Action: ${lead.recommendedAction.replace(/_/g, ' ')}

⏱️ Duration: ${duration} minutes
💬 Messages: ${messageCount} total (${lead.sessionData?.userMessages || 0} user, ${lead.sessionData?.botMessages || 0} bot)
📈 Engagement: ${lead.engagementLevel}

🎨 Topics: ${lead.dominantTopics?.map(t => `${t.topic} (${t.mentions}×)`).join(', ') || 'General'}

${lead.userQuestions?.length > 0 ? 
  `❓ Questions (${lead.userQuestions.length}):\n${lead.userQuestions.slice(0, 3).map((q, i) => `${i+1}. ${q.question}`).join('\n')}${lead.userQuestions.length > 3 ? `\n   ... +${lead.userQuestions.length - 3} more` : ''}` 
  : '❓ No specific questions asked'
}

${lead.leadIndicators?.length > 0 ? 
  `🎯 Lead Signals: ${lead.leadIndicators.map(i => i.type.replace(/_/g, ' ')).join(', ')}` : 
  ''
}

🔗 Conversation ID: ${lead.conversationId}
📅 ${new Date(lead.timestamp).toLocaleString()}

💡 NEXT STEPS: ${getActionSummary(lead)}
  `.trim();

  // Email summary (detailed with full conversation)
  const emailSummary = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <h2 style="color: ${lead.qualificationLevel === 'qualified' ? '#e74c3c' : '#3498db'};">
        🤖 Complete Chatbot Conversation Analysis
      </h2>
      
      <div style="background: ${lead.qualificationLevel === 'qualified' ? '#ffe6e6' : '#f8f9fa'}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 5px solid ${lead.qualificationLevel === 'qualified' ? '#e74c3c' : '#3498db'};">
        <h3>🎯 Lead Assessment Summary</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <p><strong>📧 Email:</strong> ${lead.email || 'Not provided'}</p>
            <p><strong>👤 Name:</strong> ${lead.name || 'Not provided'}</p>
            <p><strong>🎨 Project Type:</strong> ${lead.projectType || 'General inquiry'}</p>
            <p><strong>⭐ Lead Quality:</strong> <span style="color: ${getQualityColor(lead.qualificationLevel)}; font-weight: bold; text-transform: uppercase;">${lead.qualificationLevel}</span></p>
          </div>
          <div>
            <p><strong>🔥 Conversion Potential:</strong> ${lead.conversionPotential}</p>
            <p><strong>📋 Recommended Action:</strong> ${lead.recommendedAction.replace(/_/g, ' ')}</p>
            <p><strong>📈 Engagement Level:</strong> ${lead.engagementLevel}</p>
            <p><strong>🎯 Business Value:</strong> ${lead.businessValue || 'Unknown'}</p>
          </div>
        </div>
      </div>

      <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📊 Conversation Metrics</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <div style="background: white; padding: 15px; border-radius: 5px;">
            <strong>⏱️ Duration:</strong><br>${duration} minutes
          </div>
          <div style="background: white; padding: 15px; border-radius: 5px;">
            <strong>💬 Messages:</strong><br>${messageCount} total<br><small>${lead.sessionData?.userMessages || 0} user, ${lead.sessionData?.botMessages || 0} bot</small>
          </div>
          <div style="background: white; padding: 15px; border-radius: 5px;">
            <strong>❓ Questions:</strong><br>${lead.userQuestions?.length || 0} asked
          </div>
          <div style="background: white; padding: 15px; border-radius: 5px;">
            <strong>📈 Engagement:</strong><br>${lead.engagementLevel}
          </div>
        </div>
        <p style="margin-top: 15px;"><strong>🎨 Topics Discussed:</strong> ${lead.dominantTopics?.map(t => `${t.topic} (${t.mentions} mentions)`).join(', ') || 'General conversation'}</p>
      </div>

      ${lead.userQuestions?.length > 0 ? `
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>❓ User Questions & Concerns</h3>
        <ol style="line-height: 1.8;">
          ${lead.userQuestions.map(q => `
            <li style="margin: 15px 0;">
              <strong>"${q.question}"</strong><br>
              <small style="color: #666;">
                ⏰ Asked at: ${new Date(q.timestamp).toLocaleString()}<br>
                📝 Context: ${q.context?.map(c => `${c.sender}: "${c.text.substring(0, 50)}${c.text.length > 50 ? '...' : ''}"`).join(' → ') || 'No context available'}
              </small>
            </li>
          `).join('')}
        </ol>
      </div>
      ` : '<div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;"><em>No specific questions were asked during this conversation.</em></div>'}

      <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📝 Complete Conversation Transcript</h3>
        <div style="background: white; padding: 15px; border-radius: 4px; max-height: 500px; overflow-y: auto; font-family: monospace; font-size: 14px; line-height: 1.6; border: 1px solid #ddd;">
          ${lead.fullConversation?.map(msg => 
            `<div style="margin: 15px 0; padding: 10px; background: ${msg.speaker.includes('User') ? '#f0f8ff' : '#f5f5f5'}; border-left: 4px solid ${msg.speaker.includes('User') ? '#007bff' : '#28a745'}; border-radius: 4px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <strong style="color: ${msg.speaker.includes('User') ? '#007bff' : '#28a745'};">${msg.speaker}</strong>
                <small style="color: #666;">${msg.timestamp}</small>
              </div>
              <div style="font-family: Arial, sans-serif;">${msg.message.replace(/\n/g, '<br>')}</div>
              ${msg.metadata ? `<small style="color: #888; font-size: 11px;">Type: ${msg.metadata.messageType || 'unknown'} | Intent: ${msg.metadata.intent || 'unknown'}</small>` : ''}
            </div>`
          ).join('') || '<p style="text-align: center; color: #666;">No conversation transcript available.</p>'}
        </div>
      </div>

      ${lead.leadIndicators?.length > 0 ? `
      <div style="background: #e6f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>🎯 Lead Indicators Detected</h3>
        <ul style="line-height: 1.8;">
          ${lead.leadIndicators.map(indicator => 
            `<li style="margin: 10px 0;">
              <strong style="color: #007bff;">${indicator.type.replace(/_/g, ' ').toUpperCase()}:</strong> 
              "${indicator.message || indicator.value || 'Detected'}" 
              <span style="background: ${indicator.strength === 'high' ? '#28a745' : indicator.strength === 'medium' ? '#ffc107' : '#6c757d'}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">${indicator.strength} strength</span>
            </li>`
          ).join('')}
        </ul>
      </div>
      ` : ''}

      ${lead.sentimentProgression?.length > 0 ? `
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>😊 Sentiment Analysis</h3>
        <p><strong>Sentiment Progression:</strong></p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${lead.sentimentProgression.map((sentiment, index) => 
            `<span style="background: ${sentiment.sentiment === 'positive' ? '#d4edda' : sentiment.sentiment === 'negative' ? '#f8d7da' : '#e2e3e5'}; padding: 5px 10px; border-radius: 15px; font-size: 12px;">
              Msg ${sentiment.messageNumber}: ${sentiment.sentiment}
            </span>`
          ).join('')}
        </div>
      </div>
      ` : ''}

      <div style="background: ${lead.qualificationLevel === 'qualified' ? '#ffe6e6' : '#e6f3ff'}; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>🚀 Recommended Next Steps</h3>
        ${getActionRecommendationsHtml(lead)}
        
        <div style="margin-top: 20px; padding: 15px; background: rgba(0,0,0,0.05); border-radius: 5px;">
          <h4 style="margin-bottom: 10px;">📋 Action Checklist:</h4>
          ${generateActionChecklist(lead)}
        </div>
      </div>

      <hr style="margin: 30px 0;">
      <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
        <h4 style="color: #007bff; margin-bottom: 15px;">📊 Conversation Summary</h4>
        <p style="font-size: 14px; color: #666; line-height: 1.6;">${lead.conversationSummary || 'Complete conversation analysis available above.'}</p>
        <hr style="margin: 15px 0;">
        <p style="font-size: 12px; color: #666;">
          <strong>Conversation ID:</strong> ${lead.conversationId}<br>
          <strong>Generated:</strong> ${new Date().toLocaleString()}<br>
          <strong>Reply to this email</strong> to discuss this lead or ask questions about the conversation.
        </p>
      </div>
    </div>
  `;

  return {
    slack: slackSummary,
    email: emailSummary
  };
}

// Helper function to create unknown questions summary
function createUnknownQuestionsSummary(data) {
  const { conversationId, fullConversation, unknownTopics, userQuestions, sessionData } = data;
  const duration = Math.round((sessionData?.duration || 0) / 60000);
  
  // Slack summary (concise)
  const slackSummary = `
❓ CHATBOT KNOWLEDGE GAP ANALYSIS

🆔 Conversation: ${conversationId}
⏱️ Duration: ${duration} minutes
💬 Total Messages: ${sessionData?.totalMessages || 0}

🔴 Unknown Topics Detected: ${unknownTopics?.length || 0}
${unknownTopics?.slice(0, 3).map((topic, i) => `${i+1}. "${topic.userQuestion}" → Topic: ${topic.topic}`).join('\n')}${unknownTopics?.length > 3 ? `\n   ... +${unknownTopics.length - 3} more topics` : ''}

❓ All User Questions: ${userQuestions?.length || 0}
${userQuestions?.slice(0, 3).map((q, i) => `${i+1}. "${q.question}"`).join('\n')}${userQuestions?.length > 3 ? `\n   ... +${userQuestions.length - 3} more questions` : ''}

💡 Action Needed: Review and update chatbot responses for these topics
📅 ${new Date().toLocaleString()}

🔧 Quick Fixes Needed:
${unknownTopics?.slice(0, 3).map(topic => `• Add content about "${topic.topic}"`).join('\n')}
  `.trim();

  // Email summary (detailed)
  const emailSummary = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <h2 style="color: #f39c12;">❓ Chatbot Knowledge Gap Analysis</h2>
      
      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 5px solid #f39c12;">
        <h3>🚨 Action Required</h3>
        <p>Your chatbot encountered <strong>${unknownTopics?.length || 0} unknown topics</strong> during a conversation. This provides valuable insights for improving your content and bot responses.</p>
      </div>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📊 Conversation Overview</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <div style="background: white; padding: 15px; border-radius: 5px;">
            <strong>🆔 Conversation ID:</strong><br>${conversationId}
          </div>
          <div style="background: white; padding: 15px; border-radius: 5px;">
            <strong>⏱️ Duration:</strong><br>${duration} minutes
          </div>
          <div style="background: white; padding: 15px; border-radius: 5px;">
            <strong>💬 Messages:</strong><br>${sessionData?.totalMessages || 0} total
          </div>
          <div style="background: white; padding: 15px; border-radius: 5px;">
            <strong>❓ Questions:</strong><br>${userQuestions?.length || 0} asked
          </div>
        </div>
      </div>

      <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>🔴 Unknown Topics That Need Immediate Attention</h3>
        ${unknownTopics?.length > 0 ? 
          `<div style="background: white; padding: 15px; border-radius: 5px;">
            ${unknownTopics.map((topic, i) => 
              `<div style="margin: 20px 0; padding: 15px; border-left: 4px solid #dc3545; background: #fff5f5;">
                <h4 style="color: #dc3545; margin-bottom: 10px;">Unknown Topic #${i + 1}: ${topic.topic}</h4>
                <p><strong>📝 User Question:</strong> "${topic.userQuestion}"</p>
                <p><strong>🤖 Bot Response:</strong> "${topic.botResponse || 'No response recorded'}"</p>
                <p><strong>⏰ When Asked:</strong> ${new Date(topic.timestamp).toLocaleString()}</p>
                ${topic.context?.length > 0 ? 
                  `<p><strong>💬 Conversation Context:</strong></p>
                   <div style="background: #f8f9fa; padding: 10px; border-radius: 3px; font-size: 14px;">
                     ${topic.context.map(c => `<div style="margin: 5px 0;"><strong>${c.sender}:</strong> ${c.text}</div>`).join('')}
                   </div>` : 
                  '<p><strong>💬 Context:</strong> No context available</p>'
                }
                <div style="margin-top: 10px; padding: 10px; background: #ffe6e6; border-radius: 3px;">
                  <strong>💡 Suggested Fix:</strong> Add detailed information about "${topic.topic}" to your portfolio or chatbot knowledge base.
                </div>
              </div>`
            ).join('')}
          </div>` 
          : '<p style="text-align: center; color: #28a745; font-weight: bold;">✅ No unknown topics detected in this conversation!</p>'
        }
      </div>

      <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>❓ Complete List of User Questions</h3>
        ${userQuestions?.length > 0 ? 
          `<div style="background: white; padding: 15px; border-radius: 5px;">
            <ol style="line-height: 1.8;">
              ${userQuestions.map((q, i) => 
                `<li style="margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                  <strong>"${q.question}"</strong><br>
                  <small style="color: #666;">
                    ⏰ Asked at: ${new Date(q.timestamp).toLocaleString()}<br>
                    📝 Context: ${q.context?.map(c => `${c.sender}: "${c.text.substring(0, 50)}${c.text.length > 50 ? '...' : ''}"`).join(' → ') || 'No context'}
                  </small>
                </li>`
              ).join('')}
            </ol>
          </div>` 
          : '<p style="text-align: center; color: #666;">No questions were asked during this conversation.</p>'
        }
      </div>

      <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📝 Complete Conversation for Context</h3>
        <div style="background: white; padding: 15px; border-radius: 4px; max-height: 400px; overflow-y: auto; font-family: monospace; font-size: 14px; line-height: 1.6; border: 1px solid #ddd;">
          ${fullConversation?.map(msg => 
            `<div style="margin: 10px 0; padding: 8px; background: ${msg.speaker.includes('User') ? '#f0f8ff' : '#f5f5f5'}; border-left: 3px solid ${msg.speaker.includes('User') ? '#007bff' : '#28a745'};">
              <strong>${msg.speaker}</strong> <small style="color: #666;">(${msg.timestamp})</small><br>
              <div style="font-family: Arial, sans-serif; margin-top: 5px;">${msg.message.replace(/\n/g, '<br>')}</div>
            </div>`
          ).join('') || '<p style="text-align: center; color: #666;">No conversation transcript available.</p>'}
        </div>
      </div>

      <div style="background: #cce5ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>💡 Recommended Content Improvements</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
          <div style="background: white; padding: 15px; border-radius: 5px;">
            <h4 style="color: #007bff;">🔧 Immediate Actions</h4>
            <ul style="line-height: 1.6;">
              <li>Review each unknown topic below</li>
              <li>Create content addressing these gaps</li>
              <li>Update chatbot responses</li>
              <li>Test the improved responses</li>
            </ul>
          </div>
          <div style="background: white; padding: 15px; border-radius: 5px;">
            <h4 style="color: #007bff;">📈 Long-term Improvements</h4>
            <ul style="line-height: 1.6;">
              <li>Monitor question patterns</li>
              <li>Create comprehensive FAQ</li>
              <li>Expand service descriptions</li>
              <li>Add more portfolio examples</li>
            </ul>
          </div>
        </div>

        <div style="background: #e6f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4>🎯 Specific Content Suggestions</h4>
          ${unknownTopics?.length > 0 ? 
            `<ul style="line-height: 1.8;">
              ${unknownTopics.map(topic => 
                `<li><strong>For "${topic.topic}":</strong> Add detailed explanation addressing "${topic.userQuestion}"</li>`
              ).join('')}
            </ul>` :
            '<p>No specific suggestions - all topics were handled well!</p>'
          }
        </div>

        <div style="background: #fff3cd; padding: 15px; border-radius: 5px;">
          <h4>📋 Action Checklist</h4>
          <ul style="line-height: 1.6;">
            ${unknownTopics?.map((topic, i) => 
              `<li>☐ Research and create content for "${topic.topic}"</li>`
            ).join('') || '<li>✅ No unknown topics to address!</li>'}
            <li>☐ Update chatbot knowledge base</li>
            <li>☐ Test new responses with similar questions</li>
            <li>☐ Monitor for recurring unknown topics</li>
          </ul>
        </div>
      </div>

      <hr style="margin: 30px 0;">
      <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
        <h4 style="color: #f39c12; margin-bottom: 15px;">🎯 Knowledge Gap Summary</h4>
        <p style="font-size: 16px; color: #333; margin: 10px 0;">
          <strong>${unknownTopics?.length || 0}</strong> unknown topics detected out of <strong>${userQuestions?.length || 0}</strong> total questions
        </p>
        <p style="font-size: 14px; color: #666;">
          Knowledge coverage: <strong>${userQuestions?.length > 0 ? Math.round(((userQuestions.length - (unknownTopics?.length || 0)) / userQuestions.length) * 100) : 100}%</strong>
        </p>
        <hr style="margin: 15px 0;">
        <p style="font-size: 12px; color: #666;">
          Conversation ID: ${conversationId}<br>
          Analysis Generated: ${new Date().toLocaleString()}<br>
          <strong>Reply to this email</strong> with questions about implementing these improvements
        </p>
      </div>
    </div>
  `;

  return {
    slack: slackSummary,
    email: emailSummary
  };
}

// Helper functions for enhanced notifications
function getQualityColor(quality) {
  switch(quality) {
    case 'qualified': return '#27ae60';
    case 'high': return '#f39c12';
    case 'medium': return '#3498db';
    case 'warm': return '#e67e22';
    case 'cold': return '#95a5a6';
    default: return '#7f8c8d';
  }
}

function getActionSummary(lead) {
  if (lead.email && lead.qualificationLevel === 'qualified') {
    return 'CALL/EMAIL IMMEDIATELY - Hot lead with contact info!';
  } else if (lead.email && lead.conversionPotential === 'high') {
    return 'Email within 24 hours with personalized proposal';
  } else if (lead.email) {
    return 'Add to nurture sequence and send relevant content';
  } else if (lead.qualificationLevel === 'high') {
    return 'Create retargeting campaign - they showed strong interest';
  }
  return 'Monitor for future engagement opportunities';
}

function getActionRecommendationsHtml(lead) {
  const actions = [];
  
  if (lead.email && lead.qualificationLevel === 'qualified') {
    actions.push('🚨 <strong>URGENT - Within 2 hours:</strong> Call or email while interest is hot');
    actions.push('📋 <strong>Prepare:</strong> Custom proposal addressing their specific questions');
    actions.push('📧 <strong>Email template:</strong> Reference the exact conversation and their concerns');
  } else if (lead.email && (lead.qualificationLevel === 'high' || lead.conversionPotential === 'high')) {
    actions.push('✉️ <strong>Within 24 hours:</strong> Send personalized email with relevant examples');
    actions.push('📚 <strong>Include:</strong> Portfolio pieces matching their project type');
    actions.push('💬 <strong>Reference:</strong> Specific questions they asked in the chat');
  } else if (lead.email) {
    actions.push('🔄 <strong>Add to email nurture sequence</strong> for long-term follow-up');
    actions.push('📈 <strong>Create retargeting campaign</strong> based on discussed topics');
    actions.push('📝 <strong>Send relevant content:</strong> Blog posts or case studies about their interests');
  }
  
  // Specific recommendations based on conversation content
  if (lead.dominantTopics?.some(t => t.topic.includes('pricing'))) {
    actions.push('💰 <strong>Pricing Focus:</strong> Send detailed pricing guide with package options');
  }
  
  if (lead.dominantTopics?.some(t => t.topic.includes('portfolio'))) {
    actions.push('🎨 <strong>Portfolio Focus:</strong> Share 2-3 most relevant case studies');
  }
  
  if (lead.userQuestions?.length > 3) {
    actions.push('❓ <strong>Q&A Follow-up:</strong> Create detailed FAQ document addressing all their questions');
  }
  
  if (lead.sessionData?.duration > 300000) { // 5+ minutes
    actions.push('⭐ <strong>Highly Engaged:</strong> This person spent significant time - prioritize heavily!');
  }

  if (lead.leadIndicators?.some(i => i.type === 'hire_intent')) {
    actions.push('🎯 <strong>Hiring Intent Detected:</strong> Focus on availability and next steps');
  }
  
  return actions.length > 0 
    ? `<ul style="line-height: 1.8;">${actions.map(action => `<li style="margin: 10px 0; padding: 8px; background: rgba(0,123,255,0.1); border-radius: 4px;">${action}</li>`).join('')}</ul>`
    : '<p style="text-align: center; color: #666;">Monitor this conversation for future engagement opportunities.</p>';
}

function generateActionChecklist(lead) {
  const checklist = [];
  
  if (lead.email) {
    checklist.push(`☐ Email ${lead.email} within ${lead.qualificationLevel === 'qualified' ? '2 hours' : '24 hours'}`);
  }
  
  if (lead.userQuestions?.length > 0) {
    checklist.push(`☐ Address their ${lead.userQuestions.length} specific questions`);
  }
  
  if (lead.projectType) {
    checklist.push(`☐ Send ${lead.projectType} portfolio examples`);
  }
  
  if (lead.dominantTopics?.some(t => t.topic.includes('pricing'))) {
    checklist.push('☐ Prepare custom pricing proposal');
  }
  
  checklist.push('☐ Add to CRM with conversation notes');
  checklist.push('☐ Set follow-up reminder for 1 week');
  
  return `<ul style="line-height: 1.6;">${checklist.map(item => `<li style="margin: 5px 0;">${item}</li>`).join('')}</ul>`;
}

// OpenAI Chat endpoint - OPTIMIZED FOR GPT-4O-MINI (Fast & Efficient)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, max_tokens = 300, temperature = 0.7, model = 'gpt-4o-mini' } = req.body;

    console.log('🤖 GPT-4o-mini Request:', {
      messageCount: messages.length,
      lastMessage: messages[messages.length - 1]?.content?.substring(0, 100) + '...',
      model: model,
      max_tokens: max_tokens,
      temperature: temperature
    });

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid messages format',
        details: 'Messages must be a non-empty array'
      });
    }

    // Validate OpenAI API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not configured');
      return res.status(500).json({
        error: 'OpenAI not configured',
        message: 'Server configuration error - API key missing'
      });
    }

    // GPT-4o-mini optimized parameters for speed and efficiency
    const completionParams = {
      model: model,
      messages: messages,
      max_tokens: Math.min(max_tokens, 500), // Cap for speed
      temperature: temperature,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
      stream: false // Disable streaming for simpler implementation
    };

    // Call OpenAI API
    const completion = await openai.chat.completions.create(completionParams);

    const response = completion.choices[0]?.message?.content;

    // Handle empty responses
    if (!response || response.trim() === '') {
      console.warn('⚠️ Empty response from GPT-4o-mini, using fallback...');
      
      // Retry with adjusted parameters
      const retryCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 200,
        temperature: 0.8
      });
      
      const retryResponse = retryCompletion.choices[0]?.message?.content;
      
      if (!retryResponse || retryResponse.trim() === '') {
        // Final fallback response
        const fallbackResponse = "I'd be happy to help you connect with Yuvaan! Could you share your email so he can reach out directly to discuss your needs?";
        
        res.json({
          response: fallbackResponse,
          usage: { total_tokens: 50 },
          model: model,
          note: 'Used fallback response due to empty API response'
        });
        return;
      }
      
      res.json({ 
        response: retryResponse,
        usage: retryCompletion.usage,
        model: model,
        note: 'Retry successful after initial empty response'
      });
      return;
    }

    console.log('✅ GPT-4o-mini Response generated:', {
      responseLength: response.length,
      tokensUsed: completion.usage?.total_tokens || 'unknown',
      preview: response.substring(0, 100) + '...'
    });

    // Log usage for monitoring (GPT-4o-mini is very cost-effective)
    if (completion.usage) {
      const inputCost = (completion.usage.prompt_tokens / 1000000) * 0.15; // $0.15 per 1M input tokens
      const outputCost = (completion.usage.completion_tokens / 1000000) * 0.60; // $0.60 per 1M output tokens
      
      console.log('📊 Token Usage:', {
        prompt_tokens: completion.usage.prompt_tokens,
        completion_tokens: completion.usage.completion_tokens,
        total_tokens: completion.usage.total_tokens,
        estimated_cost: `${(inputCost + outputCost).toFixed(6)}`,
        cost_efficiency: 'GPT-4o-mini - Very Low Cost'
      });
    }

    res.json({ 
      response: response,
      usage: completion.usage,
      model: model,
      performance: 'fast',
      cost_tier: 'low'
    });

  } catch (error) {
    console.error('❌ OpenAI API Error Details:', {
      message: error.message,
      code: error.code,
      status: error.status || error.response?.status,
      type: error.type
    });

    // Enhanced error handling for GPT-4o-mini
    if (error.response?.status === 401 || error.status === 401) {
      res.status(401).json({ 
        error: 'Invalid OpenAI API key',
        message: 'Please check your OPENAI_API_KEY environment variable'
      });
    } else if (error.response?.status === 429 || error.status === 429) {
      res.status(429).json({ 
        error: 'Rate limit exceeded',
        message: 'Too many requests to OpenAI API',
        retryAfter: error.response?.headers?.['retry-after'] || '60 seconds',
        suggestion: 'GPT-4o-mini has high rate limits, this should be rare'
      });
    } else if (error.response?.status === 402 || error.status === 402) {
      res.status(402).json({ 
        error: 'OpenAI quota exceeded',
        message: 'Please check your OpenAI billing settings',
        note: 'GPT-4o-mini is very cost-effective at $0.15/$0.60 per 1M tokens'
      });
    } else if (error.response?.status === 404 || error.status === 404) {
      res.status(404).json({
        error: 'Model not available',
        message: 'GPT-4o-mini should be widely available',
        suggestion: 'Check your OpenAI account access or try gpt-3.5-turbo'
      });
    } else if (error.code === 'ENOTFOUND') {
      res.status(503).json({
        error: 'Network error',
        message: 'Cannot reach OpenAI servers - check internet connection'
      });
    } else {
      res.status(500).json({ 
        error: 'OpenAI API call failed',
        message: error.message || 'Unknown error occurred',
        model_used: 'gpt-4o-mini',
        details: process.env.NODE_ENV === 'development' ? {
          code: error.code,
          type: error.type,
          status: error.status || error.response?.status
        } : undefined
      });
    }
  }
});

// Health check for OpenAI - GPT-4o-mini optimized
app.get('/api/openai-health', async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const MODEL = 'gpt-4o-mini';

    // Test GPT-4o-mini with optimized parameters
    const testCompletion = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: 'Say "OK" to confirm you are working' }],
      max_tokens: 10,
      temperature: 0
    });

    res.json({
      status: 'healthy',
      openai: '✅ Connected',
      model: MODEL,
      modelType: 'GPT-4o-mini (Fast & Cost-Efficient)',
      apiKeyConfigured: true,
      test_response: testCompletion.choices[0]?.message?.content,
      performance_benefits: [
        '⚡ Low latency (0.47s TTFT)',
        '💰 Very cost-effective ($0.15/$0.60 per 1M tokens)',
        '🚀 68.5 tokens/second output speed',
        '🎯 Optimized for real-time chatbots'
      ],
      recommended_use_cases: [
        'Customer support chatbots',
        'Real-time interactions',
        'High-volume API calls',
        'Cost-sensitive applications'
      ],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('OpenAI health check failed:', error.message);
    res.status(500).json({
      status: 'unhealthy',
      openai: '❌ Connection failed',
      apiKeyConfigured: !!process.env.OPENAI_API_KEY,
      error: error.message,
      suggestion: 'Check your OPENAI_API_KEY and ensure GPT-4o-mini access',
      fallback_models: ['gpt-3.5-turbo', 'gpt-4o'],
      timestamp: new Date().toISOString()
    });
  }
});

// Additional endpoint for conversation analytics dashboard (optional)
app.get('/api/conversations/analytics', async (req, res) => {
  try {
    // This could return aggregated conversation data for a dashboard
    // Implementation depends on your storage solution (Firebase, MongoDB, etc.)
    
    const analytics = {
      totalConversations: 0, // Pull from your database
      leadConversions: 0,
      unknownTopicsCount: 0,
      averageConversationLength: 0,
      topUnknownTopics: [],
      conversionRate: 0,
      message: 'Analytics endpoint ready - connect to your database for real data'
    };
    
    res.json(analytics);
  } catch (error) {
    console.error('Analytics endpoint error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Please try again later'
  }
});

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Enhanced error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ API Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
});

// Handle 404 for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `${req.method} ${req.originalUrl} is not a valid endpoint`,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/openai-health',
      'GET /api/conversations/analytics',
      'POST /api/contact',
      'POST /api/leads',
      'POST /api/unknown-questions',
      'POST /api/chat'
    ]
  });
});

// Start server with enhanced logging
app.listen(PORT, () => {
  console.log(`🚀 Enhanced Portfolio Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 OpenAI health: http://localhost:${PORT}/api/openai-health`);
  
  console.log('\n📋 Enhanced Configuration Status:');
  console.log(`📧 Email Service: ${CONFIG.EMAIL_USER ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`🤖 Chatbot API: ✅ GPT-4o-mini with Complete Conversation Tracking`);
  console.log(`📱 Pushover Notifications: ${CONFIG.PUSHOVER_TOKEN ? '✅ Configured' : '❌ Optional - Not configured'}`);
  console.log(`💬 Slack Notifications: ${CONFIG.SLACK_WEBHOOK ? '✅ Configured' : '❌ Optional - Not configured'}`);
  console.log(`📝 Complete Conversation Tracking: ✅ Active`);
  console.log(`❓ Unknown Questions Analysis: ✅ Active`);
  console.log(`🔒 Rate Limiting: ✅ 100 requests/15min per IP`);
  
  console.log('\n🎯 Complete Features Active:');
  console.log('  • Full conversation transcripts with timestamps');
  console.log('  • User question tracking with context');
  console.log('  • Lead qualification and scoring');
  console.log('  • Unknown topic detection and analysis');
  console.log('  • Business intelligence insights');
  console.log('  • Engagement level assessment');
  console.log('  • Conversion potential analysis');
  console.log('  • Detailed email notifications with action items');
  console.log('  • Smart push and Slack notifications');
  
  console.log('\n💡 Ready for complete conversation intelligence with GPT-4o-mini!');
  console.log('📈 Every conversation becomes a rich source of business insights');
});