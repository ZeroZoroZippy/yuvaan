const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const { OpenAI } = require('openai');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

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
      emailService: CONFIG.EMAIL_USER ? '✅ Configured' : '❌ Not configured',
      pushNotifications: CONFIG.PUSHOVER_TOKEN ? '✅ Configured' : '❌ Not configured',
      openAI: '✅ GPT-5-nano Ready'
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
    
    const leadSummary = `
🤖 NEW CHATBOT LEAD ALERT!

📧 Email: ${lead.email || 'Not provided'}
👤 Name: ${lead.name || 'Not provided'} 
🎨 Project: ${lead.projectType || 'General inquiry'}
⭐ Quality: ${lead.qualificationLevel}
💰 Business Value: ${lead.businessValue}
📋 Next Action: ${lead.nextAction}
🕒 Time: ${new Date(lead.timestamp).toLocaleString()}

Summary: ${lead.conversationSummary}

🔗 From: Portfolio Chatbot
    `.trim();

    const notificationPromises = [
      sendPushNotification(
        `🤖 New ${lead.qualificationLevel} chatbot lead${lead.email ? ` (${lead.email})` : ''} - ${lead.projectType || 'General'}`,
        isHighPriority ? 1 : 0
      ),
      sendSlackNotification(leadSummary, isHighPriority),
      sendChatbotEmailNotification(
        `Chatbot Lead: ${lead.email || 'Anonymous'} - ${lead.qualificationLevel} quality`,
        createLeadEmailHtml(lead),
        isHighPriority
      )
    ];

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
🕒 Time: ${new Date(timestamp).toLocaleString()}

Questions that couldn't be answered:
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

💡 Consider adding these topics to your portfolio content or chatbot responses.
    `.trim();

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
  
  console.log('\n📋 Configuration Status:');
  console.log(`📧 Email (Contact Form): ${CONFIG.EMAIL_USER ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`🤖 Chatbot API: ✅ Active with GPT-5-nano`);
  console.log(`📱 Pushover: ${CONFIG.PUSHOVER_TOKEN ? '✅ Configured' : '❌ Not configured (optional)'}`);
  console.log(`💬 Slack: ${CONFIG.SLACK_WEBHOOK ? '✅ Configured' : '❌ Not configured (optional)'}`);
  console.log('\n🎯 Ready for both contact forms and chatbot leads with GPT-5!');
});

// OpenAI Chat endpoint - OPTIMIZED FOR GPT-5-NANO
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, max_tokens = 500 } = req.body; // Increased default for GPT-5
    const MODEL = process.env.OPENAI_MODEL || 'gpt-5-nano';

    console.log('🤖 OpenAI GPT-5 Request:', {
      messageCount: messages.length,
      lastMessage: messages[messages.length - 1]?.content?.substring(0, 100) + '...',
      model: MODEL,
      max_completion_tokens: max_tokens
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

    // Build parameters based on model type
    let completionParams = {
      model: MODEL,
      messages: messages
    };

    // Check if it's a GPT-5 model
    if (MODEL.includes('gpt-5')) {
      // GPT-5 specific parameters
      completionParams.max_completion_tokens = max_tokens;
      // GPT-5 doesn't support temperature, top_p, etc.
    } else {
      // GPT-4 and GPT-3.5 parameters
      completionParams.max_tokens = max_tokens;
      completionParams.temperature = 0.7;
      completionParams.top_p = 0.9;
      completionParams.frequency_penalty = 0.3;
      completionParams.presence_penalty = 0.3;
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create(completionParams);

    const response = completion.choices[0]?.message?.content;

    // Handle empty responses (GPT-5 quirk)
    if (!response || response.trim() === '') {
      console.warn('⚠️ Empty response from GPT-5, retrying with more tokens...');
      
      // Retry with significantly more tokens
      const retryCompletion = await openai.chat.completions.create({
        model: MODEL,
        messages: messages,
        max_completion_tokens: 1000
      });
      
      const retryResponse = retryCompletion.choices[0]?.message?.content;
      
      if (!retryResponse || retryResponse.trim() === '') {
        // Fallback to GPT-4 if GPT-5 still returns empty
        console.log('📊 GPT-5 returned empty, falling back to GPT-4o-mini...');
        
        const fallbackCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: messages,
          max_tokens: 300,
          temperature: 0.7
        });
        
        res.json({
          response: fallbackCompletion.choices[0]?.message?.content,
          usage: fallbackCompletion.usage,
          model: 'gpt-4o-mini',
          note: 'Fallback from GPT-5 (empty response)'
        });
        return;
      }
      
      res.json({ 
        response: retryResponse,
        usage: retryCompletion.usage,
        model: MODEL,
        note: 'Required token increase for GPT-5 response'
      });
      return;
    }

    console.log('✅ GPT-5 Response generated:', {
      responseLength: response.length,
      tokensUsed: completion.usage?.total_tokens || 'unknown',
      reasoningTokens: completion.usage?.completion_tokens_details?.reasoning_tokens,
      preview: response.substring(0, 100) + '...'
    });

    // Log usage for monitoring (GPT-5 costs)
    if (completion.usage) {
      // GPT-5-nano pricing (estimated based on typical OpenAI patterns)
      const inputCost = (completion.usage.prompt_tokens / 1000000) * 0.15; // Estimated
      const outputCost = (completion.usage.completion_tokens / 1000000) * 0.60; // Estimated
      
      console.log('📊 Token Usage:', {
        prompt_tokens: completion.usage.prompt_tokens,
        completion_tokens: completion.usage.completion_tokens,
        reasoning_tokens: completion.usage.completion_tokens_details?.reasoning_tokens,
        total_tokens: completion.usage.total_tokens,
        estimated_cost: `$${(inputCost + outputCost).toFixed(6)}`
      });
    }

    res.json({ 
      response: response,
      usage: completion.usage,
      model: MODEL,
      reasoning_tokens: completion.usage?.completion_tokens_details?.reasoning_tokens
    });

  } catch (error) {
    console.error('❌ OpenAI API Error Details:', {
      message: error.message,
      code: error.code,
      status: error.status || error.response?.status,
      type: error.type,
      response: error.response?.data
    });

    // Enhanced error handling
    if (error.response?.status === 401 || error.status === 401) {
      res.status(401).json({ 
        error: 'Invalid OpenAI API key',
        message: 'Please check your OPENAI_API_KEY environment variable'
      });
    } else if (error.response?.status === 429 || error.status === 429) {
      res.status(429).json({ 
        error: 'Rate limit exceeded',
        message: 'Too many requests to OpenAI API',
        retryAfter: error.response?.headers?.['retry-after'] || '60 seconds'
      });
    } else if (error.response?.status === 402 || error.status === 402) {
      res.status(402).json({ 
        error: 'OpenAI quota exceeded',
        message: 'Please check your OpenAI billing settings'
      });
    } else if (error.response?.status === 404 || error.status === 404) {
      res.status(404).json({
        error: 'Model not available',
        message: `${MODEL} may not be enabled for your account`,
        suggestion: 'Try using gpt-4o-mini or gpt-3.5-turbo'
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
        details: process.env.NODE_ENV === 'development' ? {
          code: error.code,
          type: error.type,
          status: error.status || error.response?.status,
          data: error.response?.data
        } : undefined
      });
    }
  }
});

// Health check for OpenAI - GPT-5 aware
app.get('/api/openai-health', async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const MODEL = process.env.OPENAI_MODEL || 'gpt-5-nano';

    // Test with appropriate parameters for the model
    const testParams = MODEL.includes('gpt-5') 
      ? {
          model: MODEL,
          messages: [{ role: 'user', content: 'Say OK' }],
          max_completion_tokens: 100
        }
      : {
          model: MODEL,
          messages: [{ role: 'user', content: 'Say OK' }],
          max_tokens: 5,
          temperature: 0
        };

    const testCompletion = await openai.chat.completions.create(testParams);

    res.json({
      status: 'healthy',
      openai: '✅ Connected',
      model: MODEL,
      modelType: MODEL.includes('gpt-5') ? 'GPT-5 (Reasoning Model)' : 'Standard Model',
      apiKeyConfigured: true,
      test_response: testCompletion.choices[0]?.message?.content,
      reasoning_tokens_used: testCompletion.usage?.completion_tokens_details?.reasoning_tokens,
      available_models: [
        'gpt-5-nano ✨ (NEW - You have access!)',
        'gpt-5-mini',
        'gpt-5',
        'gpt-4o-mini',
        'gpt-4-turbo-preview',
        'gpt-3.5-turbo'
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
      suggestion: 'Check your OPENAI_API_KEY and model settings',
      fallback_models: ['gpt-4o-mini', 'gpt-3.5-turbo'],
      timestamp: new Date().toISOString()
    });
  }
});