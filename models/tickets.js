const db = require('../config/db');

const TicketModel = {
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

  getUserEmail: (userId, callback) => {
    const sql = `SELECT email FROM users WHERE user_id = ?`;
    db.query(sql, [userId], callback);
  },

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

  getTicketStatus: (ticketId, callback) => {
    const sql = `SELECT status FROM ticket WHERE ticket_id = ?`;
    db.query(sql, [ticketId], callback);
  },

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
      // status undefined, update only note
      sql = `UPDATE ticket SET update_note = ? WHERE ticket_id = ?`;
      return db.query(sql, [updateNote, ticketId], callback);
    } else {
      // status unchanged or other status
      sql = `UPDATE ticket SET status = ?, update_note = ? WHERE ticket_id = ?`;
    }

    db.query(sql, [status, updateNote, ticketId], callback);
  }
};

module.exports = TicketModel;
