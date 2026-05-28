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

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Neptune API running on http://localhost:${PORT}`));
