// /api/chat.js - Vercel API Route for Chatbot
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

    console.log('🤖 GPT-4o-mini Request:', {
      messageCount: messages?.length || 0,
      model: model,
      max_tokens: max_tokens,
    });

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid messages format',
        details: 'Messages must be a non-empty array'
      });
    }

    // Check OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.error('❌ OPENAI_API_KEY not configured');
      return res.status(500).json({ 
        error: 'OpenAI API key not configured',
        response: "I'm having trouble connecting right now. Could you share your email so Yuvaan can reach out directly?"
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
      console.error('OpenAI API error:', openaiResponse.status, errorData);
      
      if (openaiResponse.status === 401) {
        return res.status(401).json({ 
          error: 'Invalid OpenAI API key',
          response: "Configuration issue detected. Please email yuvaanvithlani@gmail.com directly."
        });
      } else if (openaiResponse.status === 429) {
        return res.status(429).json({ 
          error: 'Rate limit exceeded',
          response: "I'm a bit busy right now. Could you try again in a moment?"
        });
      }
      
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const data = await openaiResponse.json();
    const responseText = data.choices[0]?.message?.content;

    // Handle empty responses
    if (!responseText || responseText.trim() === '') {
      console.warn('Empty response from OpenAI, using fallback');
      return res.status(200).json({ 
        response: "I'd be happy to help you connect with Yuvaan! Could you share your email so he can reach out directly to discuss your needs?",
        usage: data.usage,
        model: model,
        note: 'Fallback response due to empty API response'
      });
    }

    console.log('✅ GPT-4o-mini Response generated:', {
      responseLength: responseText.length,
      tokensUsed: data.usage?.total_tokens || 'unknown'
    });

    // Return response in the expected format
    return res.status(200).json({ 
      response: responseText,
      usage: data.usage,
      model: model,
      performance: 'fast',
      cost_tier: 'low'
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Always return a graceful fallback response
    return res.status(500).json({ 
      error: 'Internal server error',
      response: "I'm experiencing some technical difficulties. Could you share your email so Yuvaan can reach out to you directly?",
      message: error.message
    });
  }
}