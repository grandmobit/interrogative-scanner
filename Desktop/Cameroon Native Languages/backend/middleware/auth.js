const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        message: 'Invalid token. User not found.'
      });
    }

    req.user = decoded;
    req.userDoc = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired.'
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({
      message: 'Server error in authentication.'
    });
  }
};

// Admin middleware
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    if (req.userDoc.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({
      message: 'Server error in admin authentication.'
    });
  }
};

module.exports = { auth, adminAuth };
