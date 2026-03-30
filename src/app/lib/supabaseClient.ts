import { createClient } from '@supabase/supabase-js';

// Reemplaza estos valores con tus credenciales de Supabase
const supabaseUrl = 'https://jnrbbrkajadjljxiagvf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucmJicmthamFkamxqeGlhZ3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MDk0NTIsImV4cCI6MjA5MDI4NTQ1Mn0.NP2pXw7PXP2JudQrfPMnkltsNEVlFD6_pZoXfs89Kqk'
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
