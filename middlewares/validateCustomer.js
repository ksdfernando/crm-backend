module.exports = (req, res, next) => {
  const { name, phone, email, status } = req.body;
  const allowedStatuses = ['active', 'inactive', 'lead', 'vip', 'suspended', 'closed'];

  if (!name || !phone || !email || !status) {
    return res.status(400).json({ message: 'All fields (name, phone, email, status) are required' });
  }

  
  next();
};
