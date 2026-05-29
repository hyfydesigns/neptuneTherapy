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

// Temporary: test SMTP connection — remove after confirming email works
app.get('/api/test-email', async (_, res) => {
  try {
    const nodemailer = require('nodemailer');
    const t = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await t.verify();
    await t.sendMail({
      from: `"Neptune Therapy" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      subject: 'Neptune Therapy — SMTP Test',
      text: 'SMTP is working correctly on Railway.',
    });
    res.json({ success: true, message: `Test email sent to ${process.env.NOTIFY_EMAIL}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/health', (_, res) => {
  const smtpUser = process.env.SMTP_USER || '';
  res.json({
    status: 'ok',
    smtp: {
      configured: !!(smtpUser && !smtpUser.startsWith('your_')),
      host: process.env.SMTP_HOST || '(not set)',
      port: process.env.SMTP_PORT || '(not set)',
      user: smtpUser ? smtpUser.replace(/(.{3}).*(@.*)/, '$1***$2') : '(not set)',
      notifyEmail: process.env.NOTIFY_EMAIL || '(not set)',
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Neptune API running on http://localhost:${PORT}`));
