const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const { connectDB } = require('./db/database');

// Create express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));

// API routes
app.use('/api', apiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});