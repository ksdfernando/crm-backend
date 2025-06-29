const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validateUser = require('../middlewares/validateUser');


// router.get('/get-user', userController.getAllUsers);
router.post('/users', userController.createUser);
router.get('/allusers', userController.getAllUsers);
router.put('/users/:id', userController.updateUser);

module.exports = router;
