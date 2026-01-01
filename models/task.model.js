const db = require('../config/db');

const TaskModel = {
  // Create new task
  create: (taskData, callback) => {
    const { title, description, due_date, status, assigned_to } = taskData;
    const sql = `INSERT INTO task (title, description, due_date, status, assigned_to, created_at)
                 VALUES (?, ?, ?, ?, ?, NOW())`;
    db.query(sql, [title, description, due_date, status, assigned_to], callback);
  },

  
  // Get all tasks with user name
  getAll: (callback) => {
    const sql = `SELECT t.*, u.name AS assigned_user 
                 FROM task t
                 LEFT JOIN users u ON t.assigned_to = u.user_id
                 ORDER BY t.due_date ASC`;
    db.query(sql, callback);
  },


  getTasksByUser: (userId, callback) => {
    const sql = `SELECT t.*, u.name AS assigned_user 
                 FROM task t
                 LEFT JOIN users u ON t.assigned_to = u.user_id
                 WHERE t.assigned_to = ?
                 ORDER BY t.due_date ASC`;
    db.query(sql, [userId], callback);
  }
};

module.exports = TaskModel;
