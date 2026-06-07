const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const router = express.Router();

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashedPassword);

  const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });

  res.json({ token, user: { id: result.lastInsertRowid, name, email } });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Wrong password' });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });

  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

module.exports = router;