const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customer.controller');

router.post('/customers',CustomerController.addCustomer);

router.get('/customers/:customerId', CustomerController.checkCustomerExists);

module.exports = router;
