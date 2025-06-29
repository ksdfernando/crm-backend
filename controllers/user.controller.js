// controllers/user.controller.js

const bcrypt = require('bcrypt');
const UserModel = require('../models/users.model');

exports.createUser = async (req, res) => {
  const { name, email, password_hash, role } = req.body;
  const hashedPassword = await bcrypt.hash(password_hash, 10);

  UserModel.insertUser(name, email, hashedPassword, role, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating user', error: err.message });
    }
    res.status(201).json({ message: 'User created', userId: result.insertId });
  });
};

exports.getAllUsers = (req, res) => {
  UserModel.getAllUsers((err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    res.json(results);
  });
};

exports.updateUser = async (req, res) => {
  const { name, email, currentPassword, password } = req.body;
  const { id } = req.params;

  if (!currentPassword) {
    return res.status(400).json({ message: 'Current password is required' });
  }

  UserModel.getUserPasswordById(id, async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const passwordMatch = await bcrypt.compare(currentPassword, results[0].password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    const fields = [];
    const values = [];

    if (name) {
      fields.push('name = ?');
      values.push(name);
    }
    if (email) {
      fields.push('email = ?');
      values.push(email);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fields.push('password_hash = ?');
      values.push(hashedPassword);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    UserModel.updateUserById(fields, values, id, (err, result) => {
      if (err) return res.status(500).json({ message: 'Update error', error: err.message });
      res.json({ message: 'User updated successfully' });
    });
  });
};



// const db = require('../config/db');
// const bcrypt = require('bcrypt');

// exports.createUser = async (req, res) => {
//   const { name, email, password_hash, role } = req.body;
//   const hashedPassword = await bcrypt.hash(password_hash, 10);
  
//   const sql = 'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)';
//   db.query(sql, [name, email, hashedPassword, role], (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error creating user', error: err.message });
//     }
//     res.status(201).json({ message: 'User created', userId: result.insertId });
//   });
// };

// exports.getAllUsers = (req, res) => {
//   const sql = 'SELECT user_id, name, email, role FROM users';
//   db.query(sql, (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: 'Database error', error: err.message });
//     }
//     res.json(results);
//   });
// };



// exports.updateUser = async (req, res) => {
//   const { name, email, currentPassword, password } = req.body;
//   const { id } = req.params;

//   if (!currentPassword) {
//     return res.status(400).json({ message: 'Current password is required' });
//   }

//   // Get the current password hash from the database
//   db.query('SELECT password_hash FROM users WHERE user_id = ?', [id], async (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: 'Database error', error: err.message });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const user = results[0];
//     const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);

//     if (!passwordMatch) {
//       return res.status(401).json({ message: 'Incorrect current password' });
//     }

//     // Only update if password is correct
//     const fields = [];
//     const values = [];

//     if (name) {
//       fields.push('name = ?');
//       values.push(name);
//     }

//     if (email) {
//       fields.push('email = ?');
//       values.push(email);
//     }

//     if (password) {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       fields.push('password_hash = ?');
//       values.push(hashedPassword);
//     }

//     if (fields.length === 0) {
//       return res.status(400).json({ message: 'No fields to update' });
//     }

//     values.push(id); // for WHERE clause

//     const sql = `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`;

//     db.query(sql, values, (err, result) => {
//       if (err) {
//         return res.status(500).json({ message: 'Update error', error: err.message });
//       }

//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       res.json({ message: 'User updated successfully' });
//     });
//   });
// };
