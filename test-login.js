import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxeyhbvtczkoyiuupvmg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4ZXloYnZ0Y3prb3lpdXVwdm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTYxMjEsImV4cCI6MjA5NjU5MjEyMX0.MVxKPk_M7W7yQtVWxU6xHx9E0BzweCBOtvizOTtr6EI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAll() {
  const users = ['teach@mohiafrica.org', 'stud@mohiafrica.org'];
  
  for (const email of users) {
    console.log('\nSigning in as ' + email + '...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: 'password123'
    });

    if (error) {
      console.error("Login failed!", error.message);
    } else {
      console.log("LOGIN SUCCESSFUL! 🎉");
      console.log("Role:", data.user.role);
      
      const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', data.user.id).single();
      console.log("Profile details:", profile);
      
      // Sign out so we can test the next one cleanly
      await supabase.auth.signOut();
    }
  }
}

testAll();
