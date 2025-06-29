const db = require('../config/db');

exports.insertCustomer = (name, phone, email, status, callback) => {
  const sql = 'INSERT INTO customers (name, phone, email, status) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, phone, email, status], callback);
};

exports.checkCustomerById = (customerId, callback) => {
  const sql = 'SELECT COUNT(*) AS count FROM customers WHERE customer_id = ?';
  db.query(sql, [customerId], callback);
};

exports.findAll = (callback) => {
  const sql = `
    SELECT customer_id, name, phone, email, status, created_at 
    FROM customers 
    ORDER BY created_at DESC 
    LIMIT 15
  `;
  console.log('Executing SQL:', sql);
  db.query(sql, callback);
};

exports.findFiltered = (conditions, params, callback) => {
  let sql = `SELECT customer_id, name, phone, email, status, created_at FROM customers`;

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY created_at DESC';


  console.log('Executing SQL1:', sql);
  console.log('With parameters:', params);

  db.query(sql, params, callback);
};



exports.findById = (customerId, callback) => {
  const sql = 'SELECT customer_id, name, phone, email, status, created_at FROM customers WHERE customer_id = ?';
  db.query(sql, [customerId], callback);
};

exports.getCustomerOrders = (customerId, callback) => {
  const sql = `
    SELECT o.*, oi.product_id, p.name AS product_name, oi.quantity, oi.price
    FROM orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.product_id
    WHERE o.customer_id = ?
    ORDER BY o.order_date DESC
  `;
  db.query(sql, [customerId], callback);
};

