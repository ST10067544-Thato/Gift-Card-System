const jwt = require('jsonwebtoken');

// Middleware to check the user's role
const checkRole = (roles) => {
  return (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      return res.status(403).json({ message: 'Access denied, no token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the user's role matches one of the required roles
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied, insufficient permissions' });
      }

      // Attach user to the request object for further use
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  };
};

module.exports = checkRole;
