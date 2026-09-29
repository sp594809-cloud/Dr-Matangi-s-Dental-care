// Smruti Dental — Supabase client (anon key is public by design)
var SUPABASE_URL = 'https://ocepcfbryrfzqnjdlheq.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jZXBjZmJyeXJmenFuamRsaGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MDUxMzQsImV4cCI6MjEwNjA4MTEzNH0.1ix7FlJ-zDpvVj6w7U_G0yEkYHWfnDWugb_mbsc3OJU';
var sb = null;
(function () {
  try {
    if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
      sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: window.localStorage
        }
      });
    } else {
      console.warn('Supabase SDK not loaded yet');
    }
  } catch (e) {
    console.error('Supabase init error', e);
  }
})();
