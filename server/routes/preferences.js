const express = require('express');
const db = require('../database');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, (req, res) => {
  const { assets, investor_type, content_types } = req.body;
  const userId = req.user.id;

  const existing = db.prepare('SELECT * FROM preferences WHERE user_id = ?').get(userId);

  if (existing) {
    db.prepare('UPDATE preferences SET assets = ?, investor_type = ?, content_types = ? WHERE user_id = ?')
      .run(assets, investor_type, content_types, userId);
  } else {
    db.prepare('INSERT INTO preferences (user_id, assets, investor_type, content_types) VALUES (?, ?, ?, ?)')
      .run(userId, assets, investor_type, content_types);
  }

  res.json({ message: 'Preferences saved!' });
});

router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const preferences = db.prepare('SELECT * FROM preferences WHERE user_id = ?').get(userId);
  res.json(preferences || {});
});

module.exports = router;