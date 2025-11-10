const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Home/Landing page
router.get('/', async (req, res) => {
  try {
    // Get impact statistics - Updated for peace movement
    const [projects] = await db.query(`
      SELECT 
        COUNT(*) as total_projects,
        COALESCE(SUM(beneficiaries), 0) as total_beneficiaries,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_projects
      FROM impact_projects
    `);
    
    // Get user statistics for Peace Ambassadors
    const [userStats] = await db.query(`
      SELECT 
        COUNT(*) as total_members,
        COUNT(CASE WHEN interest = 'Peace Ambassador' THEN 1 END) as peace_ambassadors,
        COUNT(CASE WHEN interest = 'Community Member' THEN 1 END) as community_members
      FROM users
    `);

    // Get recent projects
    const [recentProjects] = await db.query(`
      SELECT * FROM impact_projects 
      ORDER BY created_at DESC 
      LIMIT 3
    `);

    const projectStats = projects[0] || { total_projects: 0, total_beneficiaries: 0, active_projects: 0 };
    const userStatsData = userStats[0] || { total_members: 0, peace_ambassadors: 0, community_members: 0 };
    
    res.render('index', {
      title: 'Friends of Uganda - Our nation, Our shared responsibility',
      page: 'home',
      stats: {
        total_projects: projectStats.total_projects,
        total_beneficiaries: projectStats.total_beneficiaries,
        active_projects: projectStats.active_projects,
        total_members: userStatsData.total_members,
        peace_ambassadors: userStatsData.peace_ambassadors,
        community_members: userStatsData.community_members
      },
      recentProjects: recentProjects || []
    });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.render('index', {
      title: 'Friends of Uganda - Our nation, Our shared responsibility',
      page: 'home',
      stats: { total_projects: 0, total_beneficiaries: 0, active_projects: 0, total_members: 0, peace_ambassadors: 0, community_members: 0 },
      recentProjects: []
    });
  }
});

// Mission & Vision page
router.get('/mission', (req, res) => {
  res.render('mission', {
    title: 'Mission & Vision - Friends of Uganda',
    page: 'mission'
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us - Friends of Uganda',
    page: 'about'
  });
});

// Our Team page
router.get('/team', (req, res) => {
  res.render('team', {
    title: 'Our Team - Friends of Uganda',
    page: 'team'
  });
});

// Community page
router.get('/community', async (req, res) => {
  try {
    // Get recent projects for community updates
    const [projects] = await db.query(`
      SELECT * FROM impact_projects 
      ORDER BY created_at DESC 
      LIMIT 6
    `);

    res.render('community', {
      title: 'Community - Friends of Uganda',
      page: 'community',
      projects: projects || []
    });
  } catch (error) {
    console.error('Error loading community page:', error);
    res.render('community', {
      title: 'Community - Friends of Uganda',
      page: 'community',
      projects: []
    });
  }
});

// Our Impact page
router.get('/impact', async (req, res) => {
  try {
    // Get all projects
    const [projects] = await db.query(`
      SELECT * FROM impact_projects 
      ORDER BY created_at DESC
    `);

    // Get statistics by location
    const [locationStats] = await db.query(`
      SELECT 
        location,
        COUNT(*) as project_count,
        SUM(beneficiaries) as total_beneficiaries
      FROM impact_projects
      GROUP BY location
      ORDER BY total_beneficiaries DESC
    `);

    // Calculate total impact
    const [totals] = await db.query(`
      SELECT 
        COUNT(*) as total_projects,
        SUM(beneficiaries) as total_beneficiaries,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_projects,
        COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed_projects
      FROM impact_projects
    `);

    res.render('impact', {
      title: 'Our Impact - Friends of Uganda',
      page: 'impact',
      projects: projects || [],
      locationStats: locationStats || [],
      totals: totals[0] || { total_projects: 0, total_beneficiaries: 0, active_projects: 0, completed_projects: 0 }
    });
  } catch (error) {
    console.error('Error loading impact page:', error);
    res.render('impact', {
      title: 'Our Impact - Friends of Uganda',
      page: 'impact',
      projects: [],
      locationStats: [],
      totals: { total_projects: 0, total_beneficiaries: 0, active_projects: 0, completed_projects: 0 }
    });
  }
});

// Privacy Policy page
router.get('/privacy', (req, res) => {
  res.render('privacy', {
    title: 'Privacy Policy - Friends of Uganda',
    page: 'privacy'
  });
});

module.exports = router;

