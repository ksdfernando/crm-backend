const db = require('../config/db');
const bcrypt = require('bcrypt');  

exports.createLead = (req, res) => {
  const { name, email, phone,source,assigned_to,status,interested_in} = req.body;

  const sql = `INSERT INTO customers (name, email, phone, status) VALUES (?, ?, ?, ?)`;
  const values = [name, email, phone, 'lead'];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error inserting customer:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const customerId = result.insertId;

    if (!customerId) {
      console.error("❌ Failed to get customer ID after insertion");
      return res.status(500).json({ error: "Customer ID not returned" });
    }

    // insert into leads table
    const leadSql = `INSERT INTO leads (customer_id, status, source, assigned_to,interested_in) VALUES (?, ?, ?, ?,?)`;
    const leadValues = [customerId, status, source, assigned_to,interested_in];

    db.query(leadSql, leadValues, (leadErr, leadResult) => {
      if (leadErr) {
        console.error("❌ Error inserting lead:", leadErr);
        return res.status(500).json({ error: "Lead creation failed" });
      }

      res.status(201).json({ message: "Lead and customer created successfully" });
    });
  });
};

exports.getMyLeads = (req, res) => {
  const userId = req.params.userId;

  const query = `SELECT 
  leads.lead_id,
  leads.status,
  leads.interested_in,
  leads.created_at,
  customers.customer_id,
  customers.name,
  customers.email,
  customers.phone
  
FROM leads INNER JOIN customers
ON leads.customer_id = customers.customer_id
WHERE leads.assigned_to = ?
`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching leads:", err);
      return res.status(500).json({ message: "Server error" });
    }

    return res.json(results);
  });
};

exports.updateLead = (req, res) => {
  const leadId = req.params.id;
  const { status, notes } = req.body;

  const sql = `UPDATE leads SET status = ?, notes = ? WHERE lead_id = ?`;

  db.query(sql, [status, notes, leadId], (err, result) => {
    if (err) {
      console.error("❌ Error updating lead:", err);
      return res.status(500).json({ error: "Failed to update lead" });
    }

    res.status(200).json({ message: "✅ Lead updated successfully" });
  });
};

