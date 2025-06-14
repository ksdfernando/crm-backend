const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// router.get('/get-user', userController.getAllUsers);
router.post('/users', userController.createUser);
router.get('/allusers', userController.getAllUsers);

module.exports = router;
