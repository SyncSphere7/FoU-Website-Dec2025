const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Check if Supabase is configured
if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase credentials not configured. Database features will be limited.');
  console.warn('   Set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file or Vercel environment variables');
}

// Create Supabase client (or a mock if not configured)
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : {
      // Mock client for static deployment without database
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Database not configured' } }),
        update: () => Promise.resolve({ data: null, error: { message: 'Database not configured' } }),
        delete: () => Promise.resolve({ data: null, error: { message: 'Database not configured' } }),
        eq: function() { return this; },
        order: function() { return this; },
        limit: function() { return this; },
        maybeSingle: function() { return this; },
        single: function() { return this; }
      })
    };

module.exports = supabase;

