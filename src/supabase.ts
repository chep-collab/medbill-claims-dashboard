import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qfhiqhxgqqoprhuurhhd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmaGlxaHhncXFvcHJodXVyaGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTAzMzEsImV4cCI6MjA4MzE4NjMzMX0.KCUzt1q4hIBbyBxtUuFLwhID27ynZY29Jx5-OHfOD2U";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
