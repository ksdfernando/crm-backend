const db = require('../config/db');

const LeadModel = {

 getAllLeads: (callback) => {
  const sql = `
    SELECT 
      leads.lead_id,
      leads.customer_id,
      leads.status,
      leads.source,
      leads.assigned_to,
      leads.interested_in,
      leads.notes,
      leads.created_at,
      customers.name AS customer_name,
      customers.email,
      customers.phone,
      users.name AS assigned_user_name
    FROM leads
    INNER JOIN customers ON leads.customer_id = customers.customer_id
    LEFT JOIN users ON leads.assigned_to = users.user_id
    ORDER BY leads.created_at DESC
  `;
  db.query(sql, callback);
},


 createCustomer: (name, email, phone, callback) => {
  const sql = `INSERT INTO customers (name, email, phone, status) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, email, phone, 'lead'], (err, result) => {
    if (err) {
      console.error("DB Error (createCustomer):", err);
      return callback(err);
    }
    callback(null, result);
  });
},

createLead: (customerId, status, source, assigned_to, interested_in, callback) => {
  const sql = `INSERT INTO leads (customer_id, status, source, assigned_to, interested_in) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [customerId, status, source, assigned_to, interested_in], (err, result) => {
    if (err) {
      console.error("DB Error (createLead):", err);
      return callback(err);
    }
    callback(null, result);
  });
},

  getLeadsByUser: (userId, callback) => {
    const query = `
      SELECT leads.lead_id, leads.status, leads.interested_in, leads.created_at,
             customers.customer_id, customers.name, customers.email, customers.phone
      FROM leads
      INNER JOIN customers ON leads.customer_id = customers.customer_id
      WHERE leads.assigned_to = ?
    `;
    db.query(query, [userId], callback);
  },

  updateLead: (leadId, status, notes, callback) => {
    const sql = `UPDATE leads SET status = ?, notes = ? WHERE lead_id = ?`;
    db.query(sql, [status, notes, leadId], callback);
  }

  
};


module.exports = LeadModel;
