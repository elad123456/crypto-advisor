// import express
const express = require('express');
// import database
const db = require('../database');
// import authentication middleware
const authenticateToken = require('../middleware/auth');

// Initialize the router
const router = express.Router();

// Save user preferences + authentication
router.post('/', authenticateToken, (req, res) => {
    // save user preferences
  const { assets, investor_type, content_types } = req.body;
  // save user id
  const userId = req.user.id;

  // Check if user id already exist
  const existing = db.prepare('SELECT * FROM preferences WHERE user_id = ?').get(userId);

  // If user id exists, update preferences
  if (existing) {
    db.prepare('UPDATE preferences SET assets = ?, investor_type = ?, content_types = ? WHERE user_id = ?')
      .run(assets, investor_type, content_types, userId);
      // else, insert new preferences
  } else {
    db.prepare('INSERT INTO preferences (user_id, assets, investor_type, content_types) VALUES (?, ?, ?, ?)')
      .run(userId, assets, investor_type, content_types);
  }

  // Respond with a success message
  res.json({ message: 'Preferences saved!' });
});

// Get user preferences + authentication
router.get('/', authenticateToken, (req, res) => {
    // Get user id
  const userId = req.user.id;
  // Get user preferences
  const preferences = db.prepare('SELECT * FROM preferences WHERE user_id = ?').get(userId);
  // Respond with the user preferences
  res.json(preferences || {});
});

// Export the router
module.exports = router;