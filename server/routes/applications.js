const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');
const { sendApplicationNotification, sendApplicationConfirmation } = require('../mailer');

router.post('/', async (req, res) => {
  const {
    first_name, last_name, email, phone, address, city, state, zip,
    id_type, position, years_experience, qualification, coverage_area,
    ref1_name, ref1_contact, ref2_name, ref2_contact,
  } = req.body;

  if (!first_name || !last_name || !email || !phone || !position) {
    return res.status(400).json({ error: 'First name, last name, email, phone, and position are required' });
  }

  db.prepare(`
    INSERT INTO applications (
      first_name, last_name, email, phone, address, city, state, zip,
      id_type, position, years_experience, qualification, coverage_area,
      ref1_name, ref1_contact, ref2_name, ref2_contact
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    first_name, last_name, email, phone, address, city, state, zip,
    id_type, position, years_experience, qualification, coverage_area,
    ref1_name, ref1_contact, ref2_name, ref2_contact
  );

  const app = req.body;

  // Fire both emails in parallel, non-blocking — form succeeds even if email fails
  Promise.all([
    sendApplicationNotification(app).catch(err => console.error('Admin notification error:', err.message)),
    sendApplicationConfirmation(app).catch(err => console.error('Confirmation email error:', err.message)),
  ]);

  res.json({ message: 'Application submitted successfully! We will contact you shortly.' });
});

router.get('/', auth, (req, res) => {
  const { status } = req.query;
  const rows = status
    ? db.prepare('SELECT * FROM applications WHERE status = ? ORDER BY created_at DESC').all(status)
    : db.prepare('SELECT * FROM applications ORDER BY created_at DESC').all();
  res.json(rows);
});

router.patch('/:id/status', auth, (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'reviewing', 'accepted', 'rejected'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  db.prepare('UPDATE applications SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ message: 'Status updated' });
});

router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM applications WHERE id = ?').run(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
