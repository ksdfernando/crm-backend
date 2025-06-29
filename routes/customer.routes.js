const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customer.controller');
const validateCustomer = require('../middlewares/validateCustomer');

router.post('/customers', validateCustomer, CustomerController.addCustomer);
router.get('/customers/:customerId', CustomerController.checkCustomerExists);
router.get('/viewcustomers', CustomerController.getCustomers);

router.get('/search', CustomerController.searchCustomers);
router.get('/customers/:customerId/orders', CustomerController.getCustomerOrderHistory);




module.exports = router