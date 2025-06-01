const express = require('express');
const router = express.Router();
const LeadController = require('../controllers/lead.controller');

router.post('/leads', LeadController.createLead);
router.get('/leads/my-leads/:userId', LeadController.getMyLeads);
router.put('/leads/update/:id', LeadController.updateLead);



module.exports = router;
