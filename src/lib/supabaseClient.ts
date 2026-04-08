import { createClient } from '@supabase/supabase-js'

// ✅ ENV VARIABLES (safe way)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase ENV not loaded ❌");
}

// ✅ CLIENT WITH CONFIG
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,       // login session save rahega
    autoRefreshToken: true,     // token auto refresh hoga
    detectSessionInUrl: true    // redirect login support
  }
})