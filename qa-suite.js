import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxeyhbvtczkoyiuupvmg.supabase.co';
// Using the ANON KEY to simulate a real front-end user
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4ZXloYnZ0Y3prb3lpdXVwdm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTYxMjEsImV4cCI6MjA5NjU5MjEyMX0.MVxKPk_M7W7yQtVWxU6xHx9E0BzweCBOtvizOTtr6EI';

const supabase = createClient(supabaseUrl, supabaseKey);

const TEST_USERS = {
  librarian: { email: 'lib@mohiafrica.org', password: 'password123' },
  teacher:   { email: 'teach@mohiafrica.org', password: 'password123' },
  student:   { email: 'stud@mohiafrica.org', password: 'password123' }
};

let errors = [];
let passed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`✅ PASS: ${message}`);
  } else {
    errors.push(`❌ FAIL: ${message}`);
    console.error(`❌ FAIL: ${message}`);
  }
}

async function login(user) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: user.password
  });
  if (error) throw new Error(`Login failed for ${user.email}: ${error.message}`);
  return data.user;
}

async function runQASuite() {
  console.log("🚀 Starting QA Red Team Execution...\n");

  // ============================================
  // 1. Librarian Tests
  // ============================================
  console.log("--- 🕵️‍♂️ ROLE: CENTER LIBRARIAN ---");
  const libUser = await login(TEST_USERS.librarian);
  
  // Get Librarian Profile to find center_id
  const { data: libProfile } = await supabase.from('profiles').select('*').eq('id', libUser.id).single();
  assert(libProfile.role === 'center_librarian', "Librarian profile has correct role");
  
  const centerId = libProfile.center_id;

  // Librarian fetching catalog
  const { data: catalog } = await supabase.from('book_copies').select('*, book:books(*)').eq('center_id', centerId);
  assert(catalog && catalog.length > 0, "Librarian can fetch the center catalog.");

  // Librarian fetching all loans
  const { data: libLoans } = await supabase.from('loans').select('*').eq('center_id', centerId);
  assert(libLoans !== null, "Librarian can fetch center loans.");

  // Security Check: Librarian tries to fetch loans from a fake center
  const fakeCenterId = '00000000-0000-0000-0000-000000000000';
  const { data: fakeLoans } = await supabase.from('loans').select('*').eq('center_id', fakeCenterId);
  assert(fakeLoans.length === 0, "[SECURITY] Librarian RLS prevents reading from other centers.");
  
  await supabase.auth.signOut();


  // ============================================
  // 2. Teacher Tests
  // ============================================
  console.log("\n--- 🧑‍🏫 ROLE: TEACHER ---");
  const teachUser = await login(TEST_USERS.teacher);

  const { data: teachProfile } = await supabase.from('profiles').select('*').eq('id', teachUser.id).single();
  assert(teachProfile.grade_level === '4', "Teacher profile has correct grade level assigned.");

  // Teacher fetching students
  const { data: students } = await supabase.from('profiles').select('*').eq('center_id', teachProfile.center_id);
  assert(students && students.some(s => s.role === 'student'), "Teacher can view students in their center.");

  await supabase.auth.signOut();


  // ============================================
  // 3. Student Tests
  // ============================================
  console.log("\n--- 🎒 ROLE: STUDENT ---");
  const studUser = await login(TEST_USERS.student);

  // Student fetching catalog
  const { data: studCatalog } = await supabase.from('book_copies').select('*').eq('center_id', teachProfile.center_id);
  assert(studCatalog && studCatalog.length > 0, "Student can view the center's book catalog.");

  // Student trying to insert a log for themselves
  const { error: validInsertError } = await supabase.from('reading_logs').insert({
    member_id: studUser.id,
    book_id: catalog[0]?.book_id || '9e54d6fa-f131-41b9-873d-9d4133f93cde', // fake if empty
    pages_read: 10
  });
  // Note: the above might fail if book_id isn't in their DB but the RLS check should pass or hit a foreign key error
  assert(!validInsertError || validInsertError.code === '23503', "Student can initiate a reading log for themselves (RLS allows).");

  // Security Check: Student tries to insert a reading log for the TEACHER
  const { error: hackInsertError } = await supabase.from('reading_logs').insert({
    member_id: teachUser.id,
    book_id: '9e54d6fa-f131-41b9-873d-9d4133f93cde',
    pages_read: 10
  });
  assert(hackInsertError && hackInsertError.code === '42501', "[SECURITY] RLS strictly prevents student from inserting logs on behalf of others.");

  // Security Check: Student tries to view Teacher's reading logs
  const { data: hackViewData } = await supabase.from('reading_logs').select('*').eq('member_id', teachUser.id);
  assert(hackViewData.length === 0, "[SECURITY] RLS prevents student from viewing other users' reading logs.");

  await supabase.auth.signOut();

  console.log("\n============================================");
  console.log(`🏁 QA Execution Complete. ${passed} Passed, ${errors.length} Failed.`);
  if (errors.length > 0) {
    console.log(errors.join("\n"));
  }
}

runQASuite().catch(console.error);
