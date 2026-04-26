const nodemailer = require('nodemailer');

function esc(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function normalizeOptional(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const lead = req.body;
    const conversationId = normalizeOptional(lead?.conversationId);
    const email = normalizeOptional(lead?.email).toLowerCase();
    const qualificationLevel = normalizeOptional(lead?.qualificationLevel);
    const fullConversation = Array.isArray(lead?.fullConversation) ? lead.fullConversation.slice(0, 100) : [];
    const userQuestions = Array.isArray(lead?.userQuestions) ? lead.userQuestions.slice(0, 30) : [];
    const sessionData = lead?.sessionData || {};

    if (!conversationId) {
      return res.status(400).json({ error: 'conversationId is required' });
    }

    const duration = Math.round((lead.sessionData?.duration || 0) / 60000);
    const questionCount = userQuestions.length;
    const messageCount = sessionData.totalMessages || 0;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        tls: { rejectUnauthorized: false }
      });

      const questions = userQuestions
        .map((q, i) => `<li>${esc(q.question)}</li>`)
        .join('') || '<li>None</li>';

      const conversation = fullConversation
        .map(msg => `<div style="margin:8px 0;padding:8px;background:${msg.speaker?.includes('User') ? '#f0f8ff' : '#f5f5f5'};border-left:3px solid ${msg.speaker?.includes('User') ? '#007bff' : '#28a745'}"><strong>${esc(msg.speaker)}</strong> <small>${esc(msg.timestamp)}</small><br>${esc(msg.message)}</div>`)
        .join('') || '<p>No transcript.</p>';

      await transporter.sendMail({
        from: `"Portfolio Bot" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `[Lead] ${qualificationLevel || 'unknown'} — ${email || 'anonymous'}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:700px">
            <h2>Chatbot Lead: ${esc(qualificationLevel.toUpperCase())}</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td><strong>Email</strong></td><td>${esc(email) || '—'}</td></tr>
              <tr><td><strong>Name</strong></td><td>${esc(lead.name) || '—'}</td></tr>
              <tr><td><strong>Project</strong></td><td>${esc(lead.projectType) || '—'}</td></tr>
              <tr><td><strong>Conversion</strong></td><td>${esc(lead.conversionPotential)}</td></tr>
              <tr><td><strong>Engagement</strong></td><td>${esc(lead.engagementLevel)}</td></tr>
              <tr><td><strong>Duration</strong></td><td>${duration} min, ${messageCount} messages, ${questionCount} questions</td></tr>
              <tr><td><strong>Action</strong></td><td>${esc(lead.recommendedAction?.replace(/_/g, ' '))}</td></tr>
            </table>
            <h3>Questions Asked</h3><ol>${questions}</ol>
            <h3>Transcript</h3>${conversation}
          </div>`
      });
    }

    res.json({ success: true, leadId: conversationId });
  } catch (error) {
    console.error('Leads handler error:', error);
    res.status(500).json({ error: 'Failed to process lead', message: error.message });
  }
}
