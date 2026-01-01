const db = require('../config/db');

const TicketModel = {
  // 🔹 Create a new ticket
  createTicket: (ticketData, callback) => {
    const { customer_id, subject, description, status, assigned_to, priority } = ticketData;

    const statusLower = status.toLowerCase();
    const timestampField = statusLower === 'open' ? ', open_time' : '';
    const timestampValue = statusLower === 'open' ? ', NOW()' : '';

    const sql = `
      INSERT INTO ticket 
      (customer_id, subject, description, status, assigned_to, priority, created_at${timestampField})
      VALUES (?, ?, ?, ?, ?, ?, NOW()${timestampValue})
    `;

    const values = [customer_id, subject, description, statusLower, assigned_to, priority];

    db.query(sql, values, callback);
  },

  // 🔹 Get all tickets (for AllTickets page) with optional filters
  getAll: (filters, callback) => {
    let sql = `
      SELECT 
        t.*, 
        c.name, c.email, c.phone, 
        u.name AS assigned_user 
      FROM ticket t
      LEFT JOIN customers c ON t.customer_id = c.customer_id
      LEFT JOIN users u ON t.assigned_to = u.user_id
      WHERE 1 = 1
    `;

    const params = [];

    if (filters.status) {
      sql += ' AND t.status = ?';
      params.push(filters.status);
    }

    if (filters.assigned_to) {
      sql += ' AND t.assigned_to = ?';
      params.push(filters.assigned_to);
    }

    sql += ' ORDER BY t.created_at DESC';

    db.query(sql, params, callback);
  },

  // 🔹 Get user email by ID
  getUserEmail: (userId, callback) => {
    const sql = `SELECT email FROM users WHERE user_id = ?`;
    db.query(sql, [userId], callback);
  },

  // 🔹 Get all tickets assigned to a specific user
  getTicketsByUser: (userId, callback) => {
    const sql = `
      SELECT 
        ticket.ticket_id,
        ticket.subject,
        ticket.description,
        ticket.status,
        ticket.priority,
        ticket.update_note,
        ticket.created_at,
        ticket.open_time,
        ticket.inProgress_time,
        ticket.resolved_time,
        ticket.closed_time,
        customers.customer_id,
        customers.name,
        customers.email,
        customers.phone
      FROM ticket
      INNER JOIN customers ON ticket.customer_id = customers.customer_id
      WHERE ticket.assigned_to = ?
    `;
    db.query(sql, [userId], callback);
  },

  // 🔹 Get the current status of a ticket
  getTicketStatus: (ticketId, callback) => {
    const sql = `SELECT status FROM ticket WHERE ticket_id = ?`;
    db.query(sql, [ticketId], callback);
  },

  // 🔹 Update ticket status + update_note with corresponding timestamp
  updateTicket: (ticketId, status, updateNote, callback) => {
    let sql;
    const statusLower = status?.toLowerCase();

    if (statusLower === 'open') {
      sql = `UPDATE ticket SET status = ?, update_note = ?, open_time = NOW() WHERE ticket_id = ?`;
    } else if (statusLower === 'in_progress') {
      sql = `UPDATE ticket SET status = ?, update_note = ?, inProgress_time = NOW() WHERE ticket_id = ?`;
    } else if (statusLower === 'resolved') {
      sql = `UPDATE ticket SET status = ?, update_note = ?, resolved_time = NOW() WHERE ticket_id = ?`;
    } else if (statusLower === 'closed') {
      sql = `UPDATE ticket SET status = ?, update_note = ?, closed_time = NOW() WHERE ticket_id = ?`;
    } else if (status === undefined) {
      // Only update the note
      sql = `UPDATE ticket SET update_note = ? WHERE ticket_id = ?`;
      return db.query(sql, [updateNote, ticketId], callback);
    } else {
      // Default: update both status and note
      sql = `UPDATE ticket SET status = ?, update_note = ? WHERE ticket_id = ?`;
    }

    db.query(sql, [status, updateNote, ticketId], callback);
  }
};

module.exports = TicketModel;
