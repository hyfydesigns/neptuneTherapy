const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/:section', (req, res) => {
  const row = db.prepare('SELECT content FROM site_content WHERE section = ?').get(req.params.section);
  if (!row) return res.status(404).json({ error: 'Section not found' });
  res.json(JSON.parse(row.content));
});

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT section, content, updated_at FROM site_content').all();
  const result = {};
  for (const row of rows) {
    result[row.section] = { data: JSON.parse(row.content), updated_at: row.updated_at };
  }
  res.json(result);
});

router.put('/:section', auth, (req, res) => {
  const { section } = req.params;
  // Upsert — create if missing, update if exists
  db.prepare(
    'INSERT INTO site_content (section, content, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(section) DO UPDATE SET content = excluded.content, updated_at = CURRENT_TIMESTAMP'
  ).run(section, JSON.stringify(req.body));

  res.json({ message: 'Content updated successfully' });
});

module.exports = router;
