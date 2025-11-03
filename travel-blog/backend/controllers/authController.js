const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const register = async (req, res) => {
  try {
    const { username, password, email, address } = req.body;
    
    // Check if user exists
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?', 
      [username, email]
    );
    
    if (users.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await db.query(
      'INSERT INTO users (username, password, email, address) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, address]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ?', 
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, users[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: users[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, userId: users[0].id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };