// import express (server management)
const express = require('express');
// import database
const db = require('../database');
// import authentication middleware
const authenticateToken = require('../middleware/auth');

// Initialize the router
const router = express.Router();

// Save user votes + authentication
router.post('/', authenticateToken, (req, res) => {
    // save user votes + items
  const { section, item_id, vote } = req.body;
  // save user id
  const userId = req.user.id;

  // Check if user vote already exists
  const existing = db.prepare('SELECT * FROM votes WHERE user_id = ? AND section = ? AND item_id = ?').get(userId, section, item_id);

  // If user vote exists, update it
  if (existing) {
    db.prepare('UPDATE votes SET vote = ? WHERE user_id = ? AND section = ? AND item_id = ?')
      .run(vote, userId, section, item_id);
      // else, insert new vote
  } else {
    db.prepare('INSERT INTO votes (user_id, section, item_id, vote) VALUES (?, ?, ?, ?)')
      .run(userId, section, item_id, vote);
  }

  // Respond with a success message
  res.json({ message: 'Vote saved!' });
});

// Get user votes + authentication
router.get('/', authenticateToken, (req, res) => {
    // Get user id
  const userId = req.user.id;
  // Get user votes
  const votes = db.prepare('SELECT * FROM votes WHERE user_id = ?').all(userId);
  // Respond with the user votes
  res.json(votes);
});

// Export the router
module.exports = router;