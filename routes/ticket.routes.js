const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/ticket.controller');
// const validateTicket = require('../middleware/validateTicket');
const validateTicket = require('../middlewares/validateTicket');
// Route to create a new ticket
router.post('/ticket/create',validateTicket, TicketController.createTicket);
//  tickets assigned to a specific user
router.get('/tickets/my-tickets/:userId', TicketController.getMyTickets);
router.get('/tickets', TicketController.getAllTickets);
// in routes/ticket.routes.js
router.put('/tickets/update/:id', TicketController.updateTicket);

module.exports = router;
