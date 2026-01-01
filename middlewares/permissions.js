const jwt = require('jsonwebtoken');
const rolePermissions = require('../config/permissions');
const SECRET = 'your_jwt_secret';

// 🔐 Middleware to authenticate from cookies
function authenticateToken(req, res, next) {
  const token = req.cookies.token; // 👈 JWT from cookies

  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // user contains role, id, etc.
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

// 🔓 Middleware to authorize by permission
function authorize(permission) {
  return (req, res, next) => {
    const role = req.user?.role;
    const allowedPermissions = rolePermissions[role] || [];

    if (!allowedPermissions.includes(permission)) {
      return res.status(403).json({ message: 'Access Denied: No permission' });
    }

    next();
  };
}

module.exports = { authenticateToken, authorize };
