import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uammnugjdndrjixcjnhc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhbW1udWdqZG5kcmppeGNqbmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNDIyMjAsImV4cCI6MjA5MDgxODIyMH0.DONNobZmn6NZLoJ66xOJr1EMtaS4cLu7MDIyE2umhtw';
    
export const supabase = createClient(supabaseUrl, supabaseAnonKey);