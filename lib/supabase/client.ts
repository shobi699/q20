import { createClient } from '@supabase/supabase-js';

// The Supabase URL and public anon key are now hardcoded here
// as per the user's request.
const supabaseUrl = 'https://rjaydfbfhobmewxabdqi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqYXlkZmJmaG9ibWV3eGFiZHFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDY4NDksImV4cCI6MjA3MzcyMjg0OX0.xtksQch_Ik_7FqAbBBvRhp4vbATqjqv_atl3k906KUM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
});