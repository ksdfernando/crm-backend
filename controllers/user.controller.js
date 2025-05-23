const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  const { name, email, password_hash, role } = req.body;
  const hashedPassword = await bcrypt.hash(password_hash, 10);
  
  const sql = 'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, hashedPassword, role], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating user', error: err.message });
    }
    res.status(201).json({ message: 'User created', userId: result.insertId });
  });
};

exports.getAllUsers = (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching users', error: err.message });
    res.json(results);
  });
};
