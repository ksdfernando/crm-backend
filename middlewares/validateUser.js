// middleware/validateUser.js

module.exports = (req, res, next) => {
  const { name, email, password_hash, role } = req.body;

  if (!name || !email || !password_hash || !role) {
    return res.status(400).json({ message: 'All fields are required: name, email, password, role' });
  }

  
  next();
};
