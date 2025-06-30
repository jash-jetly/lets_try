import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// Replace these with your actual Supabase credentials from the dashboard
const supabaseUrl = 'https://hdhmcagikmlzmhpntkek.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkaG1jYWdpa21sem1ocG50a2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNDYzNjMsImV4cCI6MjA2NjYyMjM2M30.wJBlC98nmilIWc4BJy7vpH6Odpr7uD3jRuns9CdxvWY'


export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})