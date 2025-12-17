import { createClient } from "@supabase/supabase-js";

// 👇 Paste YOUR values here
const supabaseUrl = "https://yfztfyhemmrxyvhjcoat.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmenRmeWhlbW1yeHl2aGpjb2F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NjQ4MjcsImV4cCI6MjA4MTU0MDgyN30.CCx5iztz9rmJEtFVP25aLgjGZEUCLeZVglrVx_6ppEE";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
