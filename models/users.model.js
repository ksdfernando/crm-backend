

const db = require('../config/db');

exports.insertUser = (name, email, hashedPassword, role, callback) => {
  const sql = 'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, hashedPassword, role], callback);
};

exports.getAllUsers = (callback) => {
  const sql = 'SELECT user_id, name, email, role FROM users';
  db.query(sql, callback);
};

exports.getUserPasswordById = (userId, callback) => {
  const sql = 'SELECT password_hash FROM users WHERE user_id = ?';
  db.query(sql, [userId], callback);
};

exports.updateUserById = (fields, values, userId, callback) => {
  const sql = `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`;
  db.query(sql, [...values, userId], callback);
};
