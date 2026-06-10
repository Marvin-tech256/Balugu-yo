// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'No token. Access denied.' 
      });
    }

    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? 'Session expired. Please log in again.' : 'Invalid or expired token'
    return res.status(401).json({ success: false, message });
  }
};

// Role-based access
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Admin access required' 
    });
  }
  next();
};

const officerOrAdmin = (req, res, next) => {
  if (!['extension_officer', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ 
      success: false,
      message: 'Extension officer or admin access required' 
    });
  }
  next();
};

module.exports = { protect, adminOnly, officerOrAdmin };