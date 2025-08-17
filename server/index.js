const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000; // Keep your existing port

// Middleware
app.use(cors());
app.use(express.json());

// Configuration for chatbot notifications
const CONFIG = {
  PUSHOVER_TOKEN: process.env.PUSHOVER_TOKEN,
  PUSHOVER_USER: process.env.PUSHOVER_USER,
  EMAIL_HOST: 'smtp.gmail.com',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  YOUR_EMAIL: process.env.EMAIL_USER, // Use same email as contact form
  SLACK_WEBHOOK: process.env.SLACK_WEBHOOK_URL
};

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

// EXISTING ROUTES - Keep your current functionality

// Health check endpoint (enhanced)
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    services: {
      contactForm: '✅ Active',
      chatbotAPI: '✅ Active',
      emailService: CONFIG.EMAIL_USER ? '✅ Configured' : '❌ Not configured',
      pushNotifications: CONFIG.PUSHOVER_TOKEN ? '✅ Configured' : '❌ Not configured'
    }
  });
});

// EXISTING Contact form endpoint - Keep exactly as is
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Create transporter with more specific Gmail configuration
    const transporter = createEmailTransporter();

    // Verify transporter configuration
    await transporter.verify();
    console.log('SMTP connection verified');

    // Email options - use your email as sender to avoid spam issues
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

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Detailed error sending email:', error);
    
    // More specific error messages
    if (error.code === 'EAUTH') {
      res.status(500).json({ error: 'Email authentication failed. Please check your email credentials.' });
    } else if (error.code === 'ECONNECTION') {
      res.status(500).json({ error: 'Failed to connect to email server.' });
    } else {
      res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
  }
});

// NEW CHATBOT ROUTES - Add these new endpoints

// Chatbot lead recording endpoint
app.post('/api/leads', async (req, res) => {
  try {
    const lead = req.body;
    console.log('🎯 NEW CHATBOT LEAD RECEIVED:', {
      email: lead.email,
      name: lead.name,
      qualification: lead.qualificationLevel,
      projectType: lead.projectType,
      timestamp: new Date(lead.timestamp).toLocaleString()
    });

    const isHighPriority = lead.qualificationLevel === 'qualified' || 
                          lead.qualificationLevel === 'high' || 
                          lead.businessValue === 'high';
    
    // Format lead data for notifications
    const leadSummary = `
🤖 NEW CHATBOT LEAD ALERT!

📧 Email: ${lead.email || 'Not provided'}
👤 Name: ${lead.name || 'Not provided'} 
🎨 Project: ${lead.projectType || 'General inquiry'}
⭐ Quality: ${lead.qualificationLevel}
💰 Business Value: ${lead.businessValue}
📋 Next Action: ${lead.nextAction}
🕐 Time: ${new Date(lead.timestamp).toLocaleString()}

Summary: ${lead.conversationSummary}

🔗 From: Portfolio Chatbot
    `.trim();

    // Send notifications concurrently (but don't fail if they do)
    const notificationPromises = [
      // Push notification
      sendPushNotification(
        `🤖 New ${lead.qualificationLevel} chatbot lead${lead.email ? ` (${lead.email})` : ''} - ${lead.projectType || 'General'}`,
        isHighPriority ? 1 : 0
      ),
      
      // Slack notification
      sendSlackNotification(leadSummary, isHighPriority),
      
      // Email notification
      sendChatbotEmailNotification(
        `Chatbot Lead: ${lead.email || 'Anonymous'} - ${lead.qualificationLevel} quality`,
        createLeadEmailHtml(lead),
        isHighPriority
      )
    ];

    // Wait for all notifications (but don't fail if they do)
    await Promise.allSettled(notificationPromises);

    console.log('✅ Chatbot lead processed and notifications sent');
    res.json({ 
      success: true, 
      leadId: lead.conversationId,
      message: 'Chatbot lead recorded successfully'
    });

  } catch (error) {
    console.error('❌ Chatbot lead processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process chatbot lead',
      message: error.message 
    });
  }
});

// Chatbot unknown questions recording endpoint
app.post('/api/unknown-questions', async (req, res) => {
  try {
    const { questions, conversationId, timestamp } = req.body;
    
    console.log('❓ CHATBOT UNKNOWN QUESTIONS:', {
      count: questions.length,
      questions: questions,
      conversationId,
      timestamp: new Date(timestamp).toLocaleString()
    });
    
    const questionSummary = `
❓ Chatbot Knowledge Gap Detected

🆔 Conversation: ${conversationId}
🕐 Time: ${new Date(timestamp).toLocaleString()}

Questions that couldn't be answered:
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

💡 Consider adding these topics to your portfolio content or chatbot responses.
    `.trim();

    // Send notifications for knowledge gaps
    await Promise.allSettled([
      sendPushNotification(`🤖 ${questions.length} unknown chatbot question(s)`, 0),
      sendSlackNotification(questionSummary, false),
      sendChatbotEmailNotification(
        `Chatbot Knowledge Gap: ${questions.length} unknown questions`,
        createUnknownQuestionsEmailHtml(questions, conversationId, timestamp),
        false
      )
    ]);

    console.log('✅ Chatbot unknown questions recorded and notifications sent');
    res.json({ 
      success: true, 
      questionsRecorded: questions.length 
    });

  } catch (error) {
    console.error('❌ Chatbot unknown questions processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process chatbot unknown questions',
      message: error.message 
    });
  }
});

// Helper function to create lead email HTML
const createLeadEmailHtml = (lead) => {
  const isHighPriority = lead.qualificationLevel === 'qualified' || lead.businessValue === 'high';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${isHighPriority ? '#e74c3c' : '#3498db'};">
        🤖 ${isHighPriority ? 'High Priority Chatbot Lead' : 'New Chatbot Lead'}
      </h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Lead Information</h3>
        <p><strong>Email:</strong> ${lead.email || 'Not provided'}</p>
        <p><strong>Name:</strong> ${lead.name || 'Not provided'}</p>
        <p><strong>Project Type:</strong> ${lead.projectType || 'General inquiry'}</p>
        <p><strong>Qualification Level:</strong> ${lead.qualificationLevel}</p>
        <p><strong>Business Value:</strong> ${lead.businessValue}</p>
        <p><strong>Recommended Action:</strong> ${lead.nextAction}</p>
      </div>

      <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Conversation Summary</h3>
        <p>${lead.conversationSummary}</p>
      </div>

      <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4>Detected Intents</h4>
        <p>${lead.intents ? lead.intents.join(', ') : 'No specific intents detected'}</p>
      </div>

      <div style="margin-top: 30px; padding: 20px; background: ${isHighPriority ? '#ffe6e6' : '#e6f3ff'}; border-radius: 8px;">
        <h3>Recommended Next Steps:</h3>
        ${getRecommendedActionsHtml(lead)}
      </div>

      <hr style="margin: 30px 0;">
      <p style="font-size: 12px; color: #666; text-align: center;">
        Generated by Portfolio Chatbot • Conversation ID: ${lead.conversationId}
      </p>
    </div>
  `;
};

// Helper function to create unknown questions email HTML
const createUnknownQuestionsEmailHtml = (questions, conversationId, timestamp) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f39c12;">🤖 Chatbot Knowledge Gap Detected</h2>
      
      <p>Your portfolio chatbot encountered questions it couldn't answer. This is valuable feedback for improving your content and bot responses.</p>

      <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Unknown Questions:</h3>
        <ol>
          ${questions.map(q => `<li style="margin: 10px 0;">${q}</li>`).join('')}
        </ol>
      </div>

      <div style="background: #d1ecf1; padding: 15px; border-radius: 8px;">
        <h4>💡 Suggested Actions:</h4>
        <ul>
          <li>Add these topics to your portfolio content</li>
          <li>Update the chatbot's knowledge base with new responses</li>
          <li>Consider creating FAQ sections for common questions</li>
          <li>Review if these indicate missing service offerings</li>
        </ul>
      </div>

      <hr style="margin: 30px 0;">
      <p style="margin-top: 20px; font-size: 12px; color: #666;">
        Conversation ID: ${conversationId}<br>
        Timestamp: ${new Date(timestamp).toLocaleString()}
      </p>
    </div>
  `;
};

// Helper function for action recommendations
const getRecommendedActionsHtml = (lead) => {
  const actions = [];
  
  if (lead.email) {
    actions.push('✅ <strong>Immediate:</strong> Send personalized email within 2-4 hours');
  } else {
    actions.push('🎯 <strong>Follow-up:</strong> Consider retargeting or creating content to recapture interest');
  }
  
  if (lead.qualificationLevel === 'qualified' || lead.qualificationLevel === 'high') {
    actions.push('🚀 <strong>Priority:</strong> Schedule call/meeting within 24 hours');
    actions.push('📋 <strong>Prepare:</strong> Custom proposal and relevant case studies');
  }
  
  if (lead.projectType) {
    actions.push(`🎨 <strong>Portfolio:</strong> Highlight ${lead.projectType} projects in follow-up`);
  }
  
  if (lead.businessValue === 'high') {
    actions.push('💰 <strong>Sales:</strong> Prepare pricing discussion and contract templates');
  }
  
  return `<ul>${actions.map(action => `<li style="margin: 5px 0;">${action}</li>`).join('')}</ul>`;
};

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ API Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  
  // Log configuration status
  console.log('\n📋 Configuration Status:');
  console.log(`📧 Email (Contact Form): ${CONFIG.EMAIL_USER ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`🤖 Chatbot API: ✅ Active`);
  console.log(`📱 Pushover: ${CONFIG.PUSHOVER_TOKEN ? '✅ Configured' : '❌ Not configured (optional)'}`);
  console.log(`💬 Slack: ${CONFIG.SLACK_WEBHOOK ? '✅ Configured' : '❌ Not configured (optional)'}`);
  console.log('\n🎯 Ready for both contact forms and chatbot leads!');
});