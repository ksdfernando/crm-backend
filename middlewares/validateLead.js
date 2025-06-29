module.exports = (req, res, next) => {
  const { name, email, phone, source, assigned_to, status, interested_in } = req.body;

  if (!name || !email || !phone || !source || !assigned_to || !status || !interested_in) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    return res.status(400).json({ message: "Phone must be 10 digits." });
  }

  next(); // Validations passed
};
