require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

// Auto-seed on first run (when content table is empty)
const rowCount = db.prepare('SELECT COUNT(*) as n FROM site_content').get().n;
if (rowCount === 0) {
  console.log('🌱 Empty database detected — seeding default content...');
  require('./seed');
}

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/applications', require('./routes/applications'));
app.use('/sitemap.xml', require('./routes/sitemap'));

// Temporary: test Resend email — remove after confirming email works
app.get('/api/test-email', async (_, res) => {
  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Neptune Therapy <onboarding@resend.dev>',
      to: process.env.NOTIFY_EMAIL,
      subject: 'Neptune Therapy — Email Test',
      text: 'Resend is working correctly on Railway!',
    });
    res.json({ success: true, message: `Test email sent to ${process.env.NOTIFY_EMAIL}`, id: result.data?.id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/health', (_, res) => {
  const apiKey = process.env.RESEND_API_KEY || '';
  res.json({
    status: 'ok',
    email: {
      provider: 'Resend',
      configured: !!(apiKey && apiKey.startsWith('re_')),
      notifyEmail: process.env.NOTIFY_EMAIL || '(not set)',
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Neptune API running on http://localhost:${PORT}`));
