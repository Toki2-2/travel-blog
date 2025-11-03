require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/logs', require('./routes/logsRoutes'));
app.use('/api/plans', require('./routes/plansRoutes'));

// Test DB connection
db.getConnection()
  .then(() => console.log('Connected to database'))
  .catch(err => console.error('Database connection failed:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});