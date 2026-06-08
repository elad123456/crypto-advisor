// import the express library to manage the server
const express = require('express');
// Security library
const cors = require('cors');
// tool for loading environment variables from a .env file
const dotenv = require('dotenv');
// local files
const authRoutes = require('./routes/auth');
const preferencesRoutes = require('./routes/preferences');
const votesRoutes = require('./routes/votes');
const dashboardRoutes = require('./routes/dashboard');

// Load environment variables from .env file
dotenv.config();

// Initialize the server
const app = express();
// loading the port or local port 3001
const PORT = process.env.PORT || 3001;

// CORS - all requests go through CORS validation
app.use(cors());
// Server accepts JSON data
app.use(express.json());

// Direct requests to the appropriate route
app.use('/api/auth', authRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/votes', votesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// server health check
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});