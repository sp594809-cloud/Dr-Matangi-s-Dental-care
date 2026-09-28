// Smruti Dental — Supabase (same project; create a user for doctor login)
var SUPABASE_URL = 'https://ocepcfbryrfzqnjdlheq.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jZXBjZmJyeXJmenFuamRsaGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MDUxMzQsImV4cCI6MjEwNjA4MTEzNH0.1ix7FlJ-zDpvVj6w7U_G0yEkYHWfnDWugb_mbsc3OJU';
var sb = null;
try {
  if (window.supabase) {
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
} catch (e) {
  console.log('Supabase init error', e);
}
