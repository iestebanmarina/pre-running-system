import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// This client is used throughout the app for:
// - Authentication (email/password, Google OAuth)
// - Database operations (users, assessments, plans, exercises, progress)
// - Storage (exercise videos, user uploaded images)
// - Real-time subscriptions (future feature)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  )
}

// Create and export Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
