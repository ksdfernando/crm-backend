const db = require('../config/db');

exports.findUserByEmail = (email, callback) => {
  const query = 'SELECT user_id, name, role, email, password_hash FROM users WHERE email = ?';
  db.query(query, [email], callback);
};
