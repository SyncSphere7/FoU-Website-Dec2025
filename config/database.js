require('dotenv').config();

// Database Configuration for Static Deployment
// The routes use MySQL-style db.query() syntax, so we provide a mock that returns empty results
// This allows the site to function without database credentials

const isProduction = process.env.NODE_ENV === 'production';
const hasDatabase = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY;

if (!hasDatabase) {
  console.warn('⚠️  Database credentials not configured. Running in static mode.');
  console.warn('   Set SUPABASE_URL and SUPABASE_ANON_KEY in environment variables to enable database features.');
}

// Mock database connection that mimics MySQL pool.query() interface
// Returns empty arrays so routes can render pages without data
const mockDb = {
  query: async (sql, params = []) => {
    const sqlPreview = typeof sql === 'string' ? sql.substring(0, 50) : 'unknown';
    console.log('📊 Mock DB query (no database configured):', sqlPreview + '...');
    
    // For INSERT queries, return mock result with insertId
    if (typeof sql === 'string' && sql.toLowerCase().includes('insert')) {
      return [{ insertId: 0, affectedRows: 0 }, []];
    }
    
    // For COUNT/SUM queries, return a row with zero values
    if (typeof sql === 'string' && (sql.toLowerCase().includes('count') || sql.toLowerCase().includes('sum'))) {
      return [[{ 
        total_projects: 0, 
        total_beneficiaries: 0, 
        active_projects: 0,
        completed_projects: 0,
        total_members: 0,
        peace_ambassadors: 0,
        community_members: 0,
        project_count: 0
      }], []];
    }
    
    // For SELECT queries, return empty array
    return [[], []];
  },
  getConnection: async () => ({
    query: async () => [[], []],
    release: () => {}
  }),
  end: async () => {}
};

module.exports = mockDb;

