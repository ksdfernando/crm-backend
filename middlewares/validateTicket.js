// middleware/validateTicket.js
module.exports = (req, res, next) => {
  const requiredFields = ['customer_id', 'subject', 'description', 'assigned_to', 'status', 'priority'];
  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ error: "Missing required fields", missingFields });
  }

  next();
};
