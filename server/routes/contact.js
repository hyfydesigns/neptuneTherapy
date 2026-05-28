const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');
const { sendContactNotification } = require('../mailer');

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  db.prepare(
    'INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)'
  ).run(name.trim(), email.trim(), message.trim());

  // Send email notification (non-blocking — form succeeds even if email fails)
  sendContactNotification({ name: name.trim(), email: email.trim(), message: message.trim() })
    .catch(err => console.error('Contact email error:', err.message));

  res.json({ message: 'Message received. We will be in touch soon!' });
});

router.get('/', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM contact_submissions ORDER BY created_at DESC').all();
  res.json(rows);
});

router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM contact_submissions WHERE id = ?').run(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
