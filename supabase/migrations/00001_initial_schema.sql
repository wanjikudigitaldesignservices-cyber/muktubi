-- ==========================================
-- MUKTUBI - Initial Database Schema
-- ==========================================

-- Enable the pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum types for better data integrity
CREATE TYPE user_role AS ENUM ('super_admin', 'center_librarian', 'teacher', 'student');
CREATE TYPE book_condition AS ENUM ('new', 'good', 'fair', 'poor', 'lost');
CREATE TYPE book_status AS ENUM ('available', 'borrowed', 'reserved', 'maintenance', 'lost');
CREATE TYPE loan_status AS ENUM ('active', 'returned', 'overdue', 'lost');

-- 1. Centers Table
CREATE TABLE centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    region TEXT NOT NULL,
    total_books INTEGER DEFAULT 0,
    active_members INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Profiles Table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL,
    center_id UUID REFERENCES centers(id),
    phone TEXT,
    grade_level TEXT,
    reading_level TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: super_admin might not have a specific center_id, so it can be NULL

-- 3. Books Table (Global Catalog)
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    isbn TEXT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT,
    cover_url TEXT,
    category TEXT NOT NULL,
    target_audience TEXT,
    reading_level TEXT,
    total_copies INTEGER DEFAULT 0,
    available_copies INTEGER DEFAULT 0,
    language TEXT DEFAULT 'English',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Book Copies (Physical inventory at specific centers)
CREATE TABLE book_copies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    center_id UUID NOT NULL REFERENCES centers(id),
    condition book_condition DEFAULT 'good',
    status book_status DEFAULT 'available',
    barcode TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Loans Table
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_copy_id UUID NOT NULL REFERENCES book_copies(id),
    member_id UUID NOT NULL REFERENCES profiles(id),
    librarian_id UUID REFERENCES profiles(id),
    center_id UUID NOT NULL REFERENCES centers(id),
    borrowed_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    returned_date TIMESTAMP WITH TIME ZONE,
    status loan_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Reading Logs
CREATE TABLE reading_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id),
    started_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    finished_date TIMESTAMP WITH TIME ZONE,
    pages_read INTEGER,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. AI Recommendations
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id),
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_copies ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Utility Function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role() RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Utility Function to get current user's center_id
CREATE OR REPLACE FUNCTION get_user_center() RETURNS UUID AS $$
  SELECT center_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;


-- 1. Centers: Anyone can view, only super_admin can modify
CREATE POLICY "Centers are viewable by all authenticated users" ON centers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Only super_admins can insert centers" ON centers FOR INSERT WITH CHECK (get_user_role() = 'super_admin');
CREATE POLICY "Only super_admins can update centers" ON centers FOR UPDATE USING (get_user_role() = 'super_admin');

-- 2. Profiles: Super admins see all. Others see profiles in their center. Users can update their own profile.
CREATE POLICY "Super admins can view all profiles" ON profiles FOR SELECT USING (get_user_role() = 'super_admin');
CREATE POLICY "Users can view profiles in their center" ON profiles FOR SELECT USING (center_id = get_user_center() OR id = auth.uid());
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Librarians can update profiles in their center" ON profiles FOR UPDATE USING (get_user_role() = 'center_librarian' AND center_id = get_user_center());

-- 3. Books: Global catalog is viewable by all. Only librarians and super_admins can modify.
CREATE POLICY "Books are viewable by all" ON books FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Super admins can insert/update books" ON books FOR ALL USING (get_user_role() = 'super_admin');
CREATE POLICY "Librarians can insert/update books" ON books FOR ALL USING (get_user_role() = 'center_librarian');

-- 4. Book Copies: Viewable by all. Librarians manage their center's copies. Super admins manage all.
CREATE POLICY "Copies viewable by all" ON book_copies FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Librarians manage their center copies" ON book_copies FOR ALL USING (get_user_role() = 'center_librarian' AND center_id = get_user_center());
CREATE POLICY "Super admins manage all copies" ON book_copies FOR ALL USING (get_user_role() = 'super_admin');

-- 5. Loans: Super admins view all. Librarians manage their center. Members see their own.
CREATE POLICY "Members can view own loans" ON loans FOR SELECT USING (member_id = auth.uid());
CREATE POLICY "Librarians manage center loans" ON loans FOR ALL USING (get_user_role() = 'center_librarian' AND center_id = get_user_center());
CREATE POLICY "Super admins manage all loans" ON loans FOR ALL USING (get_user_role() = 'super_admin');

-- 6. Reading Logs: Members manage their own. Teachers/Librarians view logs for their center.
CREATE POLICY "Members manage own reading logs" ON reading_logs FOR ALL USING (member_id = auth.uid());
CREATE POLICY "Teachers and Librarians view center logs" ON reading_logs FOR SELECT USING (
  (get_user_role() IN ('teacher', 'center_librarian')) AND 
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = reading_logs.member_id AND profiles.center_id = get_user_center()))
);

-- 7. AI Recommendations: Members view their own.
CREATE POLICY "Members view own recommendations" ON ai_recommendations FOR SELECT USING (member_id = auth.uid());
