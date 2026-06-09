import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxeyhbvtczkoyiuupvmg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4ZXloYnZ0Y3prb3lpdXVwdm1nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTAxNjEyMSwiZXhwIjoyMDk2NTkyMTIxfQ.1ehyzdNmolQZvGTmd3J3x9KMn-ez-LWe3eANSp6V7oc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setup() {
  const cid = '123e4567-e89b-12d3-a456-426614174000'; // MOHI Mathare North
  
  // Using slightly different emails to avoid the corrupted SQL rows
  const usersToCreate = [
    { email: 'lib@mohiafrica.org', password: 'password123', name: 'Grace Wangari', role: 'center_librarian', grade_level: null, reading_level: null },
    { email: 'teach@mohiafrica.org', password: 'password123', name: 'David Ochieng', role: 'teacher', grade_level: '4', reading_level: null },
    { email: 'stud@mohiafrica.org', password: 'password123', name: 'Faith Mutuku', role: 'student', grade_level: '4', reading_level: 'Intermediate' }
  ];

  for (const u of usersToCreate) {
     console.log("Creating fresh user:", u.email);
     const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true
     });
     
     if (authErr) {
        console.error("Failed to create", u.email, authErr);
        continue;
     }

     const uid = authData.user.id;
     console.log("Linking to profile in database...");

     const { error: profileErr } = await supabase.from('profiles').upsert({
        id: uid,
        email: u.email,
        full_name: u.name,
        role: u.role,
        center_id: cid,
        grade_level: u.grade_level,
        reading_level: u.reading_level
     });

     if (profileErr) {
        console.error("Failed to create profile for", u.email, profileErr);
     } else {
        console.log("Successfully setup", u.email, "with ID:", uid);
     }
  }
}

setup();
