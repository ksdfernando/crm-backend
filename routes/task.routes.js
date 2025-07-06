const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/task.controller');

// Create a new task
router.post('/task/create', TaskController.createTask);

// Get all tasks (optional)
router.get('/tasks', TaskController.getTasks);

// ✅ Get tasks assigned to a specific user (My Tasks)
router.get('/tasks/my-tasks/:userId', TaskController.getMyTasks);

module.exports = router;
