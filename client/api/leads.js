// Vercel API Route for Lead Recording
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
    const leadData = req.body;
    
    console.log('📧 Lead data received:', {
      email: leadData.email,
      name: leadData.name,
      projectType: leadData.projectType,
      qualificationLevel: leadData.qualificationLevel,
      timestamp: new Date(leadData.timestamp).toISOString()
    });

    // For now, just log the lead data
    // You can later integrate with:
    // - Email service (SendGrid, Nodemailer)
    // - Database (Supabase, MongoDB, Airtable)
    // - CRM (HubSpot, Pipedrive)
    
    // Simple email notification could be added here
    // Example: Send email to Yuvaan with lead details
    
    return res.status(200).json({ 
      success: true,
      message: 'Lead recorded successfully',
      leadId: `lead_${Date.now()}`
    });

  } catch (error) {
    console.error('Leads API error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
}