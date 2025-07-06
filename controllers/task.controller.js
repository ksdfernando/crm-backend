const TaskModel = require('../models/task.model');

const TaskController = {
  // Create a new task
  createTask: (req, res) => {
    const { title, description, due_date, status, assigned_to } = req.body;

    if (!title || !description || !due_date || !status || !assigned_to) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    TaskModel.create({ title, description, due_date, status, assigned_to }, (err, result) => {
      if (err) {
        console.error('Error creating task:', err);
        return res.status(500).json({ message: 'Database error while creating task' });
      }
      res.status(201).json({ message: 'Task created successfully', task_id: result.insertId });
    });
  },

  // Get all tasks
  getTasks: (req, res) => {
    TaskModel.getAll((err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching tasks' });
      res.status(200).json(results);
    });
  },

  // ✅ Get tasks assigned to a specific user
  getMyTasks: (req, res) => {
    const userId = req.params.userId;

    TaskModel.getTasksByUser(userId, (err, results) => {
      if (err) {
        console.error("Error getting tasks:", err);
        return res.status(500).json({ message: "Server error" });
      }

      res.status(200).json(results);
    });
  }
};

module.exports = TaskController;
