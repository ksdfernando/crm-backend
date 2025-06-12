const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/ticket.controller');

// Route to create a new ticket
router.post('/ticket/create', TicketController.createTicket);
//  tickets assigned to a specific user
router.get('/tickets/my-tickets/:userId', TicketController.getMyTickets);

// in routes/ticket.routes.js
router.put('/tickets/update/:id', TicketController.updateTicket);

module.exports = router;
