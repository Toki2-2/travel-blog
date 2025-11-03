const db = require('../config/db');

const getLogs = async (req, res) => {
  try {
    const [logs] = await db.query(
      'SELECT * FROM travel_logs WHERE user_id = ?',
      [req.userId]
    );
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addLog = async (req, res) => {
  try {
    const { title, description, start_date, end_date } = req.body;
    const [result] = await db.query(
      'INSERT INTO travel_logs (user_id, title, description, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
      [req.userId, title, description, start_date, end_date]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add updateLog and deleteLog similarly

module.exports = { getLogs, addLog };