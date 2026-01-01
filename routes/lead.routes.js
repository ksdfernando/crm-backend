const express = require('express');
const router = express.Router();
const LeadController = require('../controllers/lead.controller');
const validateLeadInput = require('../middlewares/validateLead');
const rolePermissions = require('../config/permissions');
const { authenticateToken, authorize } = require('../middlewares/permissions');


router.post('/leads', validateLeadInput, LeadController.createLead);
router.get('/leads/my-leads/:userId', LeadController.getMyLeads);
router.put('/leads/update/:id', LeadController.updateLead);

// router.get('/leads', LeadController.getAllLeads);
router.get(
  '/leads',
  authenticateToken,
  authorize('view_leads'),
  LeadController.getAllLeads
);

module.exports = router;
