// server tool
const express = require('express');
// Encrypt the password
const bcrypt = require('bcryptjs');
// JSON Web Token library
const jwt = require('jsonwebtoken');
// Database connection
const db = require('../database');

// Initialize the router
const router = express.Router();

// User registration
router.post('/register', (req, res) => {
    // Get user details from request body
  const { name, email, password } = req.body;

  // Validate user input
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if user already exists
  const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  // If user exists, return error
  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  // Hash the password, 10 - rounds
  const hashedPassword = bcrypt.hashSync(password, 10);
  // Insert the new user into the database
  const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashedPassword);

  // Generate a JWT token for the new user
  const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });

  // respond with the token and user information
  res.json({ token, user: { id: result.lastInsertRowid, name, email } });
});

// User login
router.post('/login', (req, res) => {
    // Get user credentials from request body
  const { email, password } = req.body;

  // Check if user exists
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  // If user does not exist, return error
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  // Validate the password
  const validPassword = bcrypt.compareSync(password, user.password);
  // If password is invalid, return error
  if (!validPassword) {
    return res.status(400).json({ error: 'Wrong password' });
  }

  // Generate a JWT token for the user
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });

  // Respond with the token and user information
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// router to export
module.exports = router;