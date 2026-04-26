const nodemailer = require('nodemailer');

function esc(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { conversationId, unknownTopics, userQuestions, sessionData } = req.body;
    const safeConversationId = typeof conversationId === 'string' ? conversationId.trim() : '';
    const safeUnknownTopics = Array.isArray(unknownTopics) ? unknownTopics.slice(0, 30) : [];
    const safeQuestions = Array.isArray(userQuestions) ? userQuestions.slice(0, 30) : [];

    if (!safeConversationId) {
      return res.status(400).json({ error: 'conversationId is required' });
    }

    if (safeUnknownTopics.length === 0) {
      return res.json({ success: true, unknownTopicsRecorded: 0 });
    }

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        tls: { rejectUnauthorized: false }
      });

      const topicRows = safeUnknownTopics.map((t, i) => `
        <tr style="background:${i % 2 === 0 ? '#fff5f5' : '#fff'}">
          <td>${i + 1}</td>
          <td>${esc(t.topic)}</td>
          <td>${esc(t.userQuestion)}</td>
        </tr>`).join('');

      const allQuestions = safeQuestions
        .map((q, i) => `<li>${esc(q.question)}</li>`)
        .join('') || '<li>None</li>';

      await transporter.sendMail({
        from: `"Portfolio Bot" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `[Knowledge Gap] ${safeUnknownTopics.length} unknown topics — ${safeConversationId}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:700px">
            <h2>Chatbot Knowledge Gaps</h2>
            <p><strong>${safeUnknownTopics.length}</strong> topics the bot couldn't answer in conversation <code>${esc(safeConversationId)}</code>.</p>
            <table style="width:100%;border-collapse:collapse;border:1px solid #ddd">
              <thead><tr style="background:#f8d7da"><th>#</th><th>Topic</th><th>User Question</th></tr></thead>
              <tbody>${topicRows}</tbody>
            </table>
            <h3>All Questions This Session</h3><ol>${allQuestions}</ol>
            <p><strong>Session duration:</strong> ${Math.round((sessionData?.duration || 0) / 1000)} seconds</p>
          </div>`
      });
    }

    res.json({ success: true, unknownTopicsRecorded: safeUnknownTopics.length });
  } catch (error) {
    console.error('Unknown-questions handler error:', error);
    res.status(500).json({ error: 'Failed to process unknown questions', message: error.message });
  }
}
