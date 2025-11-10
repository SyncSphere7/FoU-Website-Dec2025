const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { isAuthenticated, isAdmin, isEditor } = require('../middleware/auth');
const { validateAdminLogin, checkValidation } = require('../utils/validators');

// Admin login page
router.get('/login', (req, res) => {
  if (req.session.adminId) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', {
    title: 'Admin Login - Friends of Uganda',
    page: 'admin-login'
  });
});

// Admin login handler
router.post('/login', validateAdminLogin, checkValidation, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin user
    const [users] = await db.query(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Update last login
    await db.query(
      'UPDATE admin_users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // Create session
    req.session.adminId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;

    res.json({
      success: true,
      message: 'Login successful',
      redirect: '/admin/dashboard'
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
});

// Admin logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, redirect: '/admin/login' });
  });
});

// Admin dashboard
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    // Get statistics
    const [userStats] = await db.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN interest = 'Peace Ambassador' THEN 1 END) as peace_ambassadors,
        COUNT(CASE WHEN interest = 'Community Member' THEN 1 END) as community_members,
        COUNT(CASE WHEN interest = 'Partner' THEN 1 END) as partners,
        COUNT(CASE WHEN interest = 'Sponsor' THEN 1 END) as sponsors,
        COUNT(CASE WHEN interest = 'Volunteer' THEN 1 END) as volunteers
      FROM users
    `);

    const [projectStats] = await db.query(`
      SELECT 
        COUNT(*) as total_projects,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_projects,
        COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed_projects,
        SUM(beneficiaries) as total_beneficiaries
      FROM impact_projects
    `);

    // Get recent registrations
    const [recentUsers] = await db.query(`
      SELECT id, full_name, email, interest, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard - Friends of Uganda',
      page: 'admin-dashboard',
      user: req.session,
      userStats: userStats[0] || {},
      projectStats: projectStats[0] || {},
      recentUsers: recentUsers || []
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Admin Dashboard',
      error: error.message
    });
  }
});

// View all users
router.get('/users', isAuthenticated, isEditor, async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT id, full_name, email, country, interest, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);

    res.render('admin/users', {
      title: 'Users - Admin Dashboard',
      page: 'admin-users',
      user: req.session,
      users: users || []
    });

  } catch (error) {
    console.error('Users list error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Admin Dashboard',
      error: error.message
    });
  }
});

// View all projects
router.get('/projects', isAuthenticated, isEditor, async (req, res) => {
  try {
    const [projects] = await db.query(`
      SELECT * FROM impact_projects 
      ORDER BY created_at DESC
    `);

    res.render('admin/projects', {
      title: 'Projects - Admin Dashboard',
      page: 'admin-projects',
      user: req.session,
      projects: projects || []
    });

  } catch (error) {
    console.error('Projects list error:', error);
    res.status(500).render('admin/error', {
      title: 'Error - Admin Dashboard',
      error: error.message
    });
  }
});

module.exports = router;

