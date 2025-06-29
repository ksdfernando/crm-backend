const customerModel = require('../models/customers');

exports.addCustomer = (req, res) => {
  const { name, phone, email, status } = req.body;
  customerModel.insertCustomer(name, phone, email, status, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding customer', error: err.message });
    }
    res.status(201).json({ message: 'Customer added', customerId: result.insertId });
  });
};

exports.checkCustomerExists = (req, res) => {
  const customerId = req.params.customerId;
  customerModel.checkCustomerById(customerId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking customer', error: err.message });
    }
    const exists = results[0].count > 0;
    res.json({ exists });
  });
};
exports.getCustomers = (req, res) => {
  customerModel.findAll((err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching customers', error: err.message });
    }
      
    res.json(results);
  });
};
// controller file: customer.controller.js
exports.searchCustomers = (req, res) => {
  console.log('🔍 Backend searchCustomers() function called');
  const { search, status, date } = req.query;

  let conditions = [];
  let params = [];

  if (search) {
    conditions.push('(name LIKE ? OR email LIKE ? OR phone LIKE ?)');
    const searchValue = `%${search}%`;
    params.push(searchValue, searchValue, searchValue);
  }

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  if (date) {
    conditions.push('DATE(created_at) = ?');
    params.push(date);
  }

  
  customerModel.findFiltered(conditions, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error searching customers', error: err.message });
    }
    res.json(results);
  });
};
 
exports.getCustomerOrderHistory = (req, res) => {
  
  const customerId = req.params.customerId;
  console.log(`✅ Getting orders for customer ${customerId}`); 
  customerModel.getCustomerOrders(customerId, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching customer order history', error: err.message });

    // Group orders with items
    const ordersMap = {};
    results.forEach(row => {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          order_id: row.order_id,
          order_date: row.order_date,
          total_amount: row.total_amount,
          status: row.status,
          payment_method: row.payment_method,
          items: []
        };
      }
      if (row.product_id) {
        ordersMap[row.order_id].items.push({
          product_id: row.product_id,
          product_name: row.product_name,
          quantity: row.quantity,
          price: row.price
        });
      }
    });

    res.json(Object.values(ordersMap));
  });
};






// exports.getCustomerById = (req, res) => {
//   const customerId = req.params.customerId;
//   customerModel.findById(customerId, (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error fetching customer', error: err.message });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ message: 'Customer not found' });
//     }

//     res.json(results[0]);
//   });
// };

  





// const db = require('../config/db');
// const bcrypt = require('bcrypt');   

// exports.addCustomer = async (req, res) => {
//   const { name, phone, email, status } = req.body;

//   // Ensure status is one of the allowed values (optional validation)
//   const allowedStatuses = ['active', 'inactive', 'lead', 'vip', 'suspended', 'closed'];
//   if (!allowedStatuses.includes(status)) {
//     return res.status(400).json({ message: 'Invalid status value' });
//   }

//   const sql = 'INSERT INTO customers (name, phone, email, status) VALUES (?, ?, ?, ?)';
//   db.query(sql, [name, phone, email, status], (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error adding customer', error: err.message });
//     }
//     res.status(201).json({ message: 'Customer added', customerId: result.insertId });
//   });
// };
// exports.checkCustomerExists = (req, res) => {
//   const customerId = req.params.customerId;

//   const sql = 'SELECT COUNT(*) AS count FROM customers WHERE customer_id = ?';

//   db.query(sql, [customerId], (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error checking customer', error: err.message });
//     }

//     const exists = results[0].count > 0;
    
//     console.log("🔍 Customer exists:", exists);
//     res.json({ exists });
     
//   });
// };

// exports.getCustomers = (req, res) => {
//   const { status, search } = req.query;

//   // Base SQL
//   let sql = 'SELECT customer_id, name, phone, email, status, created_at FROM customers';
//   const params = [];

//   // Conditions array for WHERE clauses
//   const conditions = [];

//   if (status) {
//     conditions.push('status = ?');
//     params.push(status);
//   }

//   if (search) {
//     conditions.push('(name LIKE ? OR email LIKE ? OR phone LIKE ?)');
//     params.push(`%${search}%`, `%${search}%`, `%${search}%`);
//   }

//   if (conditions.length > 0) {
//     sql += ' WHERE ' + conditions.join(' AND ');
//   }

//   sql += ' ORDER BY created_at DESC';

//   db.query(sql, params, (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error fetching customers', error: err.message });
//     }
//     res.json(results);
//   });
// };


// exports.getCustomerById = (req, res) => {
//   const customerId = req.params.customerId;

//   const sql = 'SELECT customer_id, name, phone, email, status, created_at FROM customers WHERE customer_id = ?';

//   db.query(sql, [customerId], (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error fetching customer', error: err.message });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ message: 'Customer not found' });
//     }

//     res.json(results[0]);
//   });
// };


// exports.getCustomers = (req, res) => {
//   const { status, search, date } = req.query;

//   let sql = 'SELECT customer_id, name, phone, email, status, created_at FROM customers';
//   const conditions = [];
//   const params = [];

//   if (status) {
//     conditions.push('status = ?');
//     params.push(status);
//   }

//   if (search) {
//     conditions.push('(name LIKE ? OR email LIKE ? OR phone LIKE ?)');
//     params.push(`%${search}%`, `%${search}%`, `%${search}%`);
//   }

//   if (date) {
//     conditions.push('DATE(created_at) = ?');
//     params.push(date);
//   }

//   if (conditions.length > 0) {
//     sql += ' WHERE ' + conditions.join(' AND ');
//   }

//   sql += ' ORDER BY created_at DESC';

//   db.query(sql, params, (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error fetching customers', error: err.message });
//     }
//     res.json(results);
//   });
// };

