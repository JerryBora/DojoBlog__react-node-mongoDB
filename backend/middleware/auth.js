import jwt from 'jsonwebtoken';

/**
 * Authentication middleware to verify JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

/**
 * Authorization middleware to check if user has permission
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authorizeUser = (req, res, next) => {
  try {
    // Check if the authenticated user is the same as the requested user
    if (req.user.userId !== req.params.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to perform this action' 
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: 'Authorization error' 
    });
  }
};