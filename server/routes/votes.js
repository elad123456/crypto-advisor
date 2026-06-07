const express = require('express');
const db = require('../database');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, (req, res) => {
  const { section, item_id, vote } = req.body;
  const userId = req.user.id;

  const existing = db.prepare('SELECT * FROM votes WHERE user_id = ? AND section = ? AND item_id = ?').get(userId, section, item_id);

  if (existing) {
    db.prepare('UPDATE votes SET vote = ? WHERE user_id = ? AND section = ? AND item_id = ?')
      .run(vote, userId, section, item_id);
  } else {
    db.prepare('INSERT INTO votes (user_id, section, item_id, vote) VALUES (?, ?, ?, ?)')
      .run(userId, section, item_id, vote);
  }

  res.json({ message: 'Vote saved!' });
});

router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const votes = db.prepare('SELECT * FROM votes WHERE user_id = ?').all(userId);
  res.json(votes);
});

module.exports = router;