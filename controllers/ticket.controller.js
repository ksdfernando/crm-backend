const db = require('../config/db');
const sendTicketEmail = require('../utils/mailer');


// exports.createTicket = (req, res) => {
//   console.log("Request body:", req.body); // Log incoming data

//   const { customer_id, subject, description, assigned_to, status, priority} = req.body;

//   // Validate required fields
//   const requiredFields = ['customer_id', 'subject', 'description', 'assigned_to', 'status', 'priority'];
//   const missingFields = requiredFields.filter(field => !req.body[field]);

//   if (missingFields.length > 0) {
//     console.error("Missing fields:", missingFields);
//     return res.status(400).json({ 
//       error: "Missing required fields",
//       missingFields 
//     });
//   }

//   const sql = `
//     INSERT INTO ticket 
//     (customer_id, subject, description, status, assigned_to, priority) 
//     VALUES (?, ?, ?, ?, ?, ?)
//   `;
  
//   const values = [
//     customer_id,
//     subject,
//     description,
//     status.toLowerCase(),
//     assigned_to,
//     priority
//   ];

//   console.log("Executing SQL:", sql, "with values:", values); // Log the query

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ 
//         error: "Database operation failed",
//         details: err.message,
//         sqlMessage: err.sqlMessage 
//       });
//     }

//     console.log("Insert result:", result);
//     res.status(201).json({ 
//       message: "Ticket created successfully",
//       ticketId: result.insertId 
//     });
//   });
// };


exports.createTicket = (req, res) => {
  console.log("Request body:", req.body);

  const { customer_id, subject, description, assigned_to, status, priority } = req.body;

  const requiredFields = ['customer_id', 'subject', 'description', 'assigned_to', 'status', 'priority'];
  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    console.error("Missing fields:", missingFields);
    return res.status(400).json({ error: "Missing required fields", missingFields });
  }

  const sql = `
    INSERT INTO ticket 
    (customer_id, subject, description, status, assigned_to, priority) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    customer_id,
    subject,
    description,
    status.toLowerCase(),
    assigned_to,
    priority
  ];

  console.log("Executing SQL:", sql, "with values:", values);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database operation failed", details: err.message });
    }

    const ticketId = result.insertId;
    console.log("Ticket created, ID:", ticketId);

    // ✅ Now fetch assigned user's email and send email
    const userQuery = `SELECT email FROM users WHERE user_id = ?`;
    db.query(userQuery, [assigned_to], async (userErr, userResult) => {
      if (userErr) {
        console.error("Error fetching user email:", userErr);
        return res.status(500).json({ error: "Failed to fetch user email" });
      }

      if (userResult.length === 0) {
        console.warn("Assigned user not found.");
        return res.status(404).json({ error: "Assigned user not found" });
      }

      const assignedEmail = userResult[0].email;

      try {
        await sendTicketEmail({
          to: assignedEmail,
          subject: `🎫 New Ticket Assigned: ${subject}`,
          text: `You have been assigned a new ticket:\n\nSubject: ${subject}\nDescription: ${description}\nPriority: ${priority}\nStatus: ${status}`
        });

        console.log(`✅ Email sent to ${assignedEmail}`);
      } catch (mailErr) {
        console.error("❌ Failed to send email:", mailErr.message);
      }

      // ✅ Final response
      return res.status(201).json({
        message: "✅ Ticket created and email sent",
        ticketId
      });
    });
  });
};

exports.getMyTickets = (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT 
      ticket.ticket_id,
      ticket.subject,
      ticket.description,
      ticket.status,
      ticket.created_at,
      ticket.priority,
      customers.customer_id,
      customers.name,
      customers.email,
      customers.phone
    FROM ticket
    INNER JOIN customers ON ticket.customer_id = customers.customer_id
    WHERE ticket.assigned_to = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching tickets:", err);
      return res.status(500).json({ message: "Server error" });
    }

    return res.json(results);
  });
};
exports.updateTicket = (req, res) => {
  const ticketId = req.params.id;
  const { status, priority } = req.body;

  const sql = `UPDATE ticket SET status = ?, priority = ? WHERE ticket_id = ?`;

  db.query(sql, [status, priority, ticketId], (err, result) => {
    if (err) {
      console.error("❌ Error updating ticket:", err);
      return res.status(500).json({ error: "Failed to update ticket" });
    }

    res.status(200).json({ message: "✅ Ticket updated successfully" });
  });
};

