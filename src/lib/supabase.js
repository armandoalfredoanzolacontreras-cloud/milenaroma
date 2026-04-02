import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://afhviqsuxnsovksmktkf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmaHZpcXN1eG5zb3Zrc21rdGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNjA0NjMsImV4cCI6MjA5MDczNjQ2M30.JTzjMPzBbxbGDZQdegV6krMOOZcQ4S3ecvv_MxRJ2RM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
