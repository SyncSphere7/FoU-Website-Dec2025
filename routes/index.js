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

// Gallery page
router.get('/gallery', (req, res) => {
  res.render('gallery', {
    title: 'Gallery - Friends of Uganda',
    page: 'gallery'
  });
});

// Milestone data for each event
const milestones = {
  'fou-launch': {
    title: 'FOU Launch',
    date: 'November 2024',
    location: 'Kampala, Uganda',
    description: 'The official launch of Friends of Uganda, bringing together community leaders, peace advocates, and citizens united for a common cause.',
    images: [
      '/FOU%20Launch/FoU%20Launch%20Hero%20section.jpg',
      '/FOU%20Launch/highlight%201.jpg',
      '/FOU%20Launch/Highlight%202.jpg',
      '/FOU%20Launch/Highlight%203.jpg',
      '/FOU%20Launch/highlight%204.jpg',
      '/FOU%20Launch/highlight%205.jpg'
    ],
    status: 'completed'
  },
  'media-launch': {
    title: 'Media Launch',
    date: 'November 2024',
    location: 'Kampala, Uganda',
    description: 'Official media launch introducing Friends of Uganda to the press and public, sharing our vision for peace and unity.',
    images: [
      '/Media%20launch/media%20highlight%201.jpeg',
      '/Media%20launch/media%20highlight%202.jpeg',
      '/Media%20launch/media%20highlight%203.jpeg',
      '/Media%20launch/media%20highlight%204.jpeg',
      '/Media%20launch/media%20highlight%205.jpeg'
    ],
    status: 'completed'
  },
  'duuwa-campaign': {
    title: 'Duuwa Campaign',
    date: 'November 2024',
    location: 'Various Locations, Uganda',
    description: 'The Duuwa Campaign - a grassroots movement promoting peace dialogue and community engagement across Uganda.',
    images: [
      '/Duuwa/Duuwa%20highlight%201.jpeg',
      '/Duuwa/Duuwa%20highlight%202.jpeg',
      '/Duuwa/Duuwa%20highlight%203.jpeg',
      '/Duuwa/Duuwa%20highlight%204.jpeg',
      '/Duuwa/Duuwa%20highlight%205.jpeg'
    ],
    status: 'completed'
  },
  'mbarara-outreach': {
    title: 'Mbarara Outreach Tour',
    date: 'November 2024',
    location: 'Mbarara, Uganda',
    description: 'Community outreach in Mbarara, engaging local leaders and youth in peace-building initiatives.',
    images: [
      '/Mbarara%20Tour/WhatsApp%20Image%202025-12-01%20at%207.07.00%20AM.jpeg',
      '/Mbarara%20Tour/WhatsApp%20Image%202025-12-01%20at%207.07.01%20AM.jpeg',
      '/Mbarara%20Tour/WhatsApp%20Image%202025-12-01%20at%207.07.01%20AM%20(1).jpeg',
      '/Mbarara%20Tour/WhatsApp%20Image%202025-12-01%20at%207.07.02%20AM.jpeg',
      '/Mbarara%20Tour/WhatsApp%20Image%202025-12-01%20at%207.07.02%20AM%20(1).jpeg'
    ],
    status: 'completed'
  },
  'youth-reunion': {
    title: 'Youth Reunion',
    date: 'November 2024',
    location: 'Kampala, Uganda',
    description: 'A gathering of young peace ambassadors, sharing experiences and strengthening the youth peace network.',
    images: [
      '/Youth%20Reunion/Youth%20reunion.jpeg'
    ],
    status: 'completed'
  }
};

// Milestone detail page
router.get('/milestone/:slug', (req, res) => {
  const slug = req.params.slug;
  const milestone = milestones[slug];
  
  if (!milestone) {
    return res.status(404).render('404', {
      title: 'Milestone Not Found - Friends of Uganda',
      page: '404'
    });
  }
  
  res.render('milestone', {
    title: `${milestone.title} - Friends of Uganda`,
    page: 'milestone',
    milestone: milestone
  });
});

module.exports = router;

