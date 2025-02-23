const jwt = require('jsonwebtoken');

const checkRole = (roles) => {
  return (req, res, next) => {
    const authHeader = req.header('Authorization');

    // Check if the Authorization header is present
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ message: 'Access denied, no token provided' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the user's role is valid and matches one of the required roles
      if (!decoded.role || !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied, insufficient permissions' });
      }

      // Attach user to the request object for further use
      req.user = decoded;
      next();
    } catch (err) {
      // Handle token verification errors
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ message: 'Token expired' });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }
  };
};

module.exports = checkRole;