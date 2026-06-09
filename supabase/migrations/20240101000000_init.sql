-- ============================================================
-- MUKTUBI — Database Schema (Supabase PostgreSQL)
-- Core tables, RLS policies, and triggers
-- ============================================================

-- Create Enums
CREATE TYPE user_role AS ENUM ('super_admin', 'center_librarian', 'teacher', 'student');
CREATE TYPE book_condition AS ENUM ('new', 'good', 'fair', 'poor', 'lost');
CREATE TYPE loan_status AS ENUM ('active', 'returned', 'overdue', 'lost');
CREATE TYPE reservation_status AS ENUM ('pending', 'fulfilled', 'cancelled');

-- 1. Centers Table
CREATE TABLE centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  region TEXT NOT NULL,
  total_books INTEGER DEFAULT 0,
  active_members INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles Table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  center_id UUID REFERENCES centers(id) ON DELETE SET NULL,
  role user_role NOT NULL DEFAULT 'student',
  full_name TEXT NOT NULL,
  grade_level INTEGER, -- Nullable for staff
  reading_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Books Table (Global Catalog)
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT,
  publisher TEXT,
  published_year INTEGER,
  category TEXT NOT NULL,
  language TEXT DEFAULT 'English',
  reading_level TEXT,
  grade_range TEXT,
  ai_summary TEXT,
  ai_tags TEXT[],
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Book Copies Table (Inventory per Center)
CREATE TABLE book_copies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  center_id UUID NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
  barcode TEXT UNIQUE,
  condition book_condition DEFAULT 'new',
  status TEXT DEFAULT 'available', -- 'available', 'borrowed', 'reserved'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Loans Table
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  copy_id UUID NOT NULL REFERENCES book_copies(id) ON DELETE RESTRICT,
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  center_id UUID NOT NULL REFERENCES centers(id) ON DELETE RESTRICT,
  borrowed_date TIMESTAMPTZ DEFAULT NOW(),
  due_date TIMESTAMPTZ NOT NULL,
  returned_date TIMESTAMPTZ,
  status loan_status DEFAULT 'active',
  overdue_risk_score FLOAT, -- AI predicted risk
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Reading Logs Table
CREATE TABLE reading_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  started_date TIMESTAMPTZ DEFAULT NOW(),
  finished_date TIMESTAMPTZ,
  pages_read INTEGER DEFAULT 0,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Reservations Table
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  center_id UUID NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
  reserved_date TIMESTAMPTZ DEFAULT NOW(),
  status reservation_status DEFAULT 'pending',
  fulfilled_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AI Recommendations Table
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  score FLOAT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_copies ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Helper function to get current user's center_id
CREATE OR REPLACE FUNCTION get_user_center()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT center_id FROM public.profiles WHERE id = auth.uid();
$$;

-- RLS Policies Examples (Simplified)

-- Centers: Everyone can read
CREATE POLICY "Centers are viewable by everyone" ON centers FOR SELECT USING (true);
CREATE POLICY "Super admins can manage centers" ON centers FOR ALL USING (get_user_role() = 'super_admin');

-- Profiles: Users can read their own, staff can read their center's users
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Center staff view center profiles" ON profiles FOR SELECT USING (
  get_user_center() = center_id AND get_user_role() IN ('super_admin', 'center_librarian', 'teacher')
);

-- Books: Everyone can read catalog
CREATE POLICY "Books viewable by everyone" ON books FOR SELECT USING (true);
CREATE POLICY "Staff can manage books" ON books FOR ALL USING (get_user_role() IN ('super_admin', 'center_librarian'));

-- Loans: Students view own, Staff view center
CREATE POLICY "Users view own loans" ON loans FOR SELECT USING (auth.uid() = member_id);
CREATE POLICY "Staff view center loans" ON loans FOR ALL USING (
  get_user_center() = center_id AND get_user_role() IN ('super_admin', 'center_librarian', 'teacher')
);

-- ============================================================
-- Triggers for updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_centers_updated_at BEFORE UPDATE ON centers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_book_copies_updated_at BEFORE UPDATE ON book_copies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON loans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reading_logs_updated_at BEFORE UPDATE ON reading_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
