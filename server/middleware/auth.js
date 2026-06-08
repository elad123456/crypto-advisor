// Security and encryption library
const jwt = require('jsonwebtoken');


// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  // Split the token from the "Bearer" prefix
  const token = authHeader && authHeader.split(' ')[1];

  // Check if token is existing
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  // Verify the token
  try {
    // validate the token
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    // Attach the verified user to the request
    req.user = verified;
    // approve the request
    next();
    // the token is invalid
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Middleware to export
module.exports = authenticateToken;