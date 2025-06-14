const db = require('../config/db');
const bcrypt = require('bcrypt');   

exports.addCustomer = async (req, res) => {
  const { name, phone, email, status } = req.body;

  // Ensure status is one of the allowed values (optional validation)
  const allowedStatuses = ['active', 'inactive', 'lead', 'vip', 'suspended', 'closed'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const sql = 'INSERT INTO customers (name, phone, email, status) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, phone, email, status], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding customer', error: err.message });
    }
    res.status(201).json({ message: 'Customer added', customerId: result.insertId });
  });
};
exports.checkCustomerExists = (req, res) => {
  const customerId = req.params.customerId;

  const sql = 'SELECT COUNT(*) AS count FROM customers WHERE customer_id = ?';

  db.query(sql, [customerId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking customer', error: err.message });
    }

    const exists = results[0].count > 0;
    
    console.log("🔍 Customer exists:", exists);
    res.json({ exists });
     
  });
};

