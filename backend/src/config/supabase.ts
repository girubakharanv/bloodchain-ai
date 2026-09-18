import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

// Create a server-side Supabase client using the service role key.
// This client bypasses Row Level Security, so it must ONLY be used on the backend
// and NEVER exposed to the frontend.
export const supabase = createClient(supabaseUrl, supabaseSecretKey);
