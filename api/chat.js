// /api/chat.js - Enhanced Vercel API Route for Chatbot with Complete Conversation Tracking
export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, max_tokens = 300, temperature = 0.7, model = 'gpt-4o-mini' } = req.body;

    console.log('🤖 GPT-4o-mini Request (Vercel):', {
      messageCount: messages?.length || 0,
      model: model,
      max_tokens: max_tokens,
      timestamp: new Date().toISOString()
    });

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid messages format',
        details: 'Messages must be a non-empty array',
        fallbackResponse: "I'd be happy to help you connect with Yuvaan! Could you share your email so he can reach out directly?"
      });
    }

    // Check OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.error('❌ OPENAI_API_KEY not configured in Vercel');
      return res.status(500).json({ 
        error: 'OpenAI API key not configured',
        response: "I'm having trouble connecting right now. Could you share your email so Yuvaan can reach out directly?",
        fallback: true
      });
    }

    // Call OpenAI API with GPT-4o-mini optimized parameters
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: Math.min(max_tokens, 500), // Cap for speed
        temperature: temperature,
        top_p: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.3,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}));
      console.error('OpenAI API error (Vercel):', openaiResponse.status, errorData);
      
      if (openaiResponse.status === 401) {
        return res.status(401).json({ 
          error: 'Invalid OpenAI API key',
          response: "Configuration issue detected. Please email yuvaanvithlani@gmail.com directly.",
          fallback: true
        });
      } else if (openaiResponse.status === 429) {
        return res.status(429).json({ 
          error: 'Rate limit exceeded',
          response: "I'm a bit busy right now. Could you try again in a moment or share your email for Yuvaan to reach out directly?",
          fallback: true
        });
      } else if (openaiResponse.status === 402) {
        return res.status(402).json({
          error: 'OpenAI quota exceeded',
          response: "I'm experiencing some limitations. Could you share your email so Yuvaan can help you directly?",
          fallback: true
        });
      }
      
      throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await openaiResponse.json();
    const responseText = data.choices[0]?.message?.content;

    // Handle empty responses with enhanced fallback
    if (!responseText || responseText.trim() === '') {
      console.warn('Empty response from OpenAI (Vercel), using intelligent fallback');
      
      // Analyze the last message to provide a contextual fallback
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
      let contextualFallback;
      
      if (lastMessage.includes('email') || lastMessage.includes('contact')) {
        contextualFallback = "I'd love to make sure Yuvaan gets your contact information! What's your email address?";
      } else if (lastMessage.includes('price') || lastMessage.includes('cost')) {
        contextualFallback = "Projects typically start around ₹35,000, but I'd love to have Yuvaan discuss pricing specifics with you. What's your email?";
      } else if (lastMessage.includes('portfolio') || lastMessage.includes('work')) {
        contextualFallback = "Yuvaan has some great examples to share! What's your email so he can send you relevant portfolio pieces?";
      } else if (lastMessage.includes('hire') || lastMessage.includes('project')) {
        contextualFallback = "That's exciting! Yuvaan would love to discuss your project. Could you share your email so he can reach out?";
      } else {
        contextualFallback = "I'd be happy to help you connect with Yuvaan! Could you share your email so he can reach out directly to discuss your needs?";
      }
      
      return res.status(200).json({ 
        response: contextualFallback,
        usage: data.usage || { total_tokens: 50 },
        model: model,
        note: 'Contextual fallback response due to empty API response',
        fallback: true
      });
    }

    console.log('✅ GPT-4o-mini Response generated (Vercel):', {
      responseLength: responseText.length,
      tokensUsed: data.usage?.total_tokens || 'unknown',
      preview: responseText.substring(0, 100) + '...'
    });

    // Log usage for monitoring (GPT-4o-mini is very cost-effective)
    if (data.usage) {
      const inputCost = (data.usage.prompt_tokens / 1000000) * 0.15; // $0.15 per 1M input tokens
      const outputCost = (data.usage.completion_tokens / 1000000) * 0.60; // $0.60 per 1M output tokens
      
      console.log('📊 Token Usage (Vercel):', {
        prompt_tokens: data.usage.prompt_tokens,
        completion_tokens: data.usage.completion_tokens,
        total_tokens: data.usage.total_tokens,
        estimated_cost: `${(inputCost + outputCost).toFixed(6)}`,
        cost_efficiency: 'GPT-4o-mini - Very Low Cost'
      });
    }

    // Return response in the expected format
    return res.status(200).json({ 
      response: responseText,
      usage: data.usage,
      model: model,
      performance: 'fast',
      cost_tier: 'low',
      timestamp: new Date().toISOString(),
      fallback: false
    });

  } catch (error) {
    console.error('Chat API error (Vercel):', error);
    
    // Analyze error for better fallback responses
    let contextualErrorResponse;
    
    if (error.message.includes('network') || error.message.includes('fetch')) {
      contextualErrorResponse = "I'm having connection issues right now. Could you share your email so Yuvaan can reach out to you directly?";
    } else if (error.message.includes('timeout')) {
      contextualErrorResponse = "I'm responding a bit slowly today. What's your email so Yuvaan can get back to you quickly?";
    } else if (error.message.includes('quota') || error.message.includes('billing')) {
      contextualErrorResponse = "I'm experiencing some technical limitations. Please email yuvaanvithlani@gmail.com directly for immediate assistance.";
    } else {
      contextualErrorResponse = "I'm experiencing some technical difficulties. Could you share your email so Yuvaan can reach out to you directly?";
    }
    
    // Always return a graceful fallback response
    return res.status(500).json({ 
      error: 'Internal server error',
      response: contextualErrorResponse,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Technical difficulties',
      fallback: true,
      timestamp: new Date().toISOString(),
      suggestion: 'Try refreshing the page or contact yuvaanvithlani@gmail.com directly'
    });
  }
}