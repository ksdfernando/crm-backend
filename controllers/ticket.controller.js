const TicketModel = require('../models/tickets');
const sendTicketEmail = require('../utils/mailer');

// Create new ticket
exports.createTicket = (req, res) => {
  const ticketData = req.body;

  TicketModel.createTicket(ticketData, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database operation failed", details: err.message });
    }

    const ticketId = result.insertId;

    // Get assigned user email
    TicketModel.getUserEmail(ticketData.assigned_to, async (userErr, userResult) => {
      if (userErr) {
        console.error("Error fetching user email:", userErr);
        return res.status(500).json({ error: "Failed to fetch user email" });
      }

      if (userResult.length === 0) {
        return res.status(404).json({ error: "Assigned user not found" });
      }

      const assignedEmail = userResult[0].email;

      try {
        await sendTicketEmail({
          to: assignedEmail,
          subject: `🎫 New Ticket Assigned: ${ticketData.subject}`,
          text: `You have been assigned a new ticket:\n\nSubject: ${ticketData.subject}\nDescription: ${ticketData.description}\nPriority: ${ticketData.priority}\nStatus: ${ticketData.status}`
        });

        console.log(`Email sent to ${assignedEmail}`);
      } catch (mailErr) {
        console.error("Failed to send email:", mailErr.message);
      }

      return res.status(201).json({
        message: "Ticket created and email sent",
        ticketId
      });
    });
  });
};

// Get tickets assigned to current user
exports.getMyTickets = (req, res) => {
  const userId = req.params.userId;

  TicketModel.getTicketsByUser(userId, (err, results) => {
    if (err) {
      console.error("Error fetching tickets:", err);
      return res.status(500).json({ message: "Server error" });
    }

    return res.json(results);
  });
};

// Update ticket (status and/or note)
exports.updateTicket = (req, res) => {
  const ticketId = req.params.id;
  const { status, update } = req.body;

  TicketModel.getTicketStatus(ticketId, (selectErr, selectResult) => {
    if (selectErr) {
      console.error("Error fetching current status:", selectErr);
      return res.status(500).json({ error: "Failed to fetch current ticket status" });
    }

    if (selectResult.length === 0) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const currentStatus = selectResult[0].status;

    if (status && status !== currentStatus) {
      // Status changed
      TicketModel.updateTicket(ticketId, status, update, (err) => {
        if (err) {
          console.error("Error updating ticket:", err);
          return res.status(500).json({ error: "Failed to update ticket" });
        }

        return res.status(200).json({ message: "Ticket updated successfully" });
      });
    } else {
      // Status same or not provided, update only note
      TicketModel.updateTicket(ticketId, undefined, update, (err) => {
        if (err) {
          console.error("Error updating ticket:", err);
          return res.status(500).json({ error: "Failed to update ticket" });
        }

        return res.status(200).json({ message: "Ticket updated successfully" });
      });
    }
  });
};

// ✅ NEW: Get all tickets (optionally filter by status and assigned_to)
exports.getAllTickets = (req, res) => {
  const { status, assigned_to } = req.query;

  const filters = {};

  if (status) {
    filters.status = status.toLowerCase();
  }

  if (assigned_to) {
    filters.assigned_to = assigned_to;
  }

  TicketModel.getAll(filters, (err, results) => {
    if (err) {
      console.error("Error fetching all tickets:", err);
      return res.status(500).json({ error: 'Failed to fetch tickets' });
    }
    res.status(200).json(results);
  });
};








// const db = require('../config/db');
// const sendTicketEmail = require('../utils/mailer');


// exports.createTicket = (req, res) => {
//   console.log("Request body:", req.body);

//   const { customer_id, subject, description, assigned_to, status, priority } = req.body;

//   const requiredFields = ['customer_id', 'subject', 'description', 'assigned_to', 'status', 'priority'];
//   const missingFields = requiredFields.filter(field => !req.body[field]);

//   if (missingFields.length > 0) {
//     console.error("Missing fields:", missingFields);
//     return res.status(400).json({ error: "Missing required fields", missingFields });
//   }

//   const statusLower = status.toLowerCase();
//   const timestampField = statusLower === 'open' ? ', open_time' : '';
//   const timestampValue = statusLower === 'open' ? ', NOW()' : '';

//   const sql = `
//     INSERT INTO ticket 
//     (customer_id, subject, description, status, assigned_to, priority, created_at${timestampField})
//     VALUES (?, ?, ?, ?, ?, ?, NOW()${timestampValue})
//   `;

//   const values = [
//     customer_id,
//     subject,
//     description,
//     statusLower,
//     assigned_to,
//     priority
//   ];

//   console.log("Executing SQL:", sql, "with values:", values);

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ error: "Database operation failed", details: err.message });
//     }

//     const ticketId = result.insertId;
//     console.log("Ticket created, ID:", ticketId);

//     // ✅ Send email to assigned user
//     const userQuery = `SELECT email FROM users WHERE user_id = ?`;
//     db.query(userQuery, [assigned_to], async (userErr, userResult) => {
//       if (userErr) {
//         console.error("Error fetching user email:", userErr);
//         return res.status(500).json({ error: "Failed to fetch user email" });
//       }

//       if (userResult.length === 0) {
//         console.warn("Assigned user not found.");
//         return res.status(404).json({ error: "Assigned user not found" });
//       }

//       const assignedEmail = userResult[0].email;

//       try {
//         await sendTicketEmail({
//           to: assignedEmail,
//           subject: `🎫 New Ticket Assigned: ${subject}`,
//           text: `You have been assigned a new ticket:\n\nSubject: ${subject}\nDescription: ${description}\nPriority: ${priority}\nStatus: ${status}`
//         });

//         console.log(`✅ Email sent to ${assignedEmail}`);
//       } catch (mailErr) {
//         console.error("❌ Failed to send email:", mailErr.message);
//       }

//       return res.status(201).json({
//         message: "✅ Ticket created and email sent",
//         ticketId
//       });
//     });
//   });
// };

// // ✅ Get Tickets Assigned to a User
// exports.getMyTickets = (req, res) => {
//   const userId = req.params.userId;

//   const query = `
//     SELECT 
//       ticket.ticket_id,
//       ticket.subject,
//       ticket.description,
//       ticket.status,
//       ticket.priority,
//       ticket.update_note,
//       ticket.created_at,
//       ticket.open_time,
//       ticket.inProgress_time,
//       ticket.resolved_time,
//       ticket.closed_time,
//       customers.customer_id,
//       customers.name,
//       customers.email,
//       customers.phone
//     FROM ticket
//     INNER JOIN customers ON ticket.customer_id = customers.customer_id
//     WHERE ticket.assigned_to = ?
//   `;

//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error("❌ Error fetching tickets:", err);
//       return res.status(500).json({ message: "Server error" });
//     }

//     return res.json(results);
//   });
// };


// exports.updateTicket = (req, res) => {
//   const ticketId = req.params.id;
//   const { status, update } = req.body;

//   // First, get current status from DB
//   const selectSql = `SELECT status FROM ticket WHERE ticket_id = ?`;

//   db.query(selectSql, [ticketId], (selectErr, selectResult) => {
//     if (selectErr) {
//       console.error("❌ Error fetching current status:", selectErr);
//       return res.status(500).json({ error: "Failed to fetch current ticket status" });
//     }

//     if (selectResult.length === 0) {
//       return res.status(404).json({ error: "Ticket not found" });
//     }

//     const currentStatus = selectResult[0].status;

//     let sql;
//     let values;

//     if (status !== currentStatus) {
//       // status changed => update timestamp accordingly
//       if (status === 'open') {
//         sql = `UPDATE ticket SET status = ?, update_note = ?, open_time = NOW() WHERE ticket_id = ?`;
//       } else if (status === 'in_progress') {
//         sql = `UPDATE ticket SET status = ?, update_note = ?, inProgress_time = NOW() WHERE ticket_id = ?`;
//       } else if (status === 'resolved') {
//         sql = `UPDATE ticket SET status = ?, update_note = ?, resolved_time = NOW() WHERE ticket_id = ?`;
//       } else if (status === 'closed') {
//         sql = `UPDATE ticket SET status = ?, update_note = ?, closed_time = NOW() WHERE ticket_id = ?`;
//       } else {
//         sql = `UPDATE ticket SET status = ?, update_note = ? WHERE ticket_id = ?`;
//       }
//       values = [status, update, ticketId];
//     } else {
//       // status same => update only update_note (if needed)
//       sql = `UPDATE ticket SET update_note = ? WHERE ticket_id = ?`;
//       values = [update, ticketId];
//     }

//     db.query(sql, values, (err, result) => {
//       if (err) {
//         console.error("❌ Error updating ticket:", err);
//         return res.status(500).json({ error: "Failed to update ticket" });
//       }

//       res.status(200).json({ message: "✅ Ticket updated successfully" });
//     });
//   });
// };
