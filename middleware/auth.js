const { body, validationResult } = require('express-validator');

// Check if user is authenticated (admin)
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  
  // If API request, return JSON
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  // Otherwise redirect to login
  req.session.returnTo = req.originalUrl;
  res.redirect('/admin/login');
};

// Check if user has admin role
const isAdmin = (req, res, next) => {
  if (req.session && req.session.role === 'Admin') {
    return next();
  }
  
  return res.status(403).json({ 
    success: false, 
    message: 'Access denied. Admin role required.' 
  });
};

// Check if user has editor or admin role
const isEditor = (req, res, next) => {
  if (req.session && (req.session.role === 'Admin' || req.session.role === 'Editor')) {
    return next();
  }
  
  return res.status(403).json({ 
    success: false, 
    message: 'Access denied. Editor or Admin role required.' 
  });
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isEditor
};

