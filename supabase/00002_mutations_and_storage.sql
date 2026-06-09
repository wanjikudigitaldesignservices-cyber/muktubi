-- ============================================================
-- MUKTUBI — Feature Expansion Schema
-- Adds Avatars, Storage Buckets, and Onboarding RPC
-- ============================================================

-- 1. ADD AVATAR SUPPORT
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. CONFIGURE STORAGE (AVATARS BUCKET)
-- Ensure storage extensions and tables exist (Supabase defaults)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to update their own avatar
CREATE POLICY "Users can update their own avatar" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow anyone to view avatars
CREATE POLICY "Anyone can view avatars" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'avatars');


-- 3. ONBOARDING FUNCTION (RPC)
-- Securely creates a user, their auth identity, and their profile in one transaction.
CREATE OR REPLACE FUNCTION onboard_member(
  p_email TEXT,
  p_password TEXT,
  p_full_name TEXT,
  p_role user_role,
  p_center_id UUID,
  p_grade_level TEXT DEFAULT NULL,
  p_reading_level TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Security Check: Ensure caller is a librarian
  IF (SELECT role FROM public.profiles WHERE id = auth.uid()) != 'center_librarian' THEN
    RAISE EXCEPTION 'Unauthorized: Only librarians can onboard members';
  END IF;

  new_user_id := gen_random_uuid();

  -- Insert into auth.users (bypass email confirmation for MVP)
  INSERT INTO auth.users (
    id, aud, role, email, encrypted_password, email_confirmed_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    new_user_id, 'authenticated', 'authenticated', p_email, 
    crypt(p_password, gen_salt('bf')), now(), 
    '{"provider":"email","providers":["email"]}', '{}', now(), now()
  );

  -- Insert into auth.identities (required for login)
  INSERT INTO auth.identities (
    id, provider_id, user_id, identity_data, provider, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id::text, new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', p_email, 'email_verified', false, 'phone_verified', false),
    'email', now(), now()
  );

  -- Insert into public.profiles
  INSERT INTO public.profiles (id, email, full_name, role, center_id, grade_level, reading_level)
  VALUES (new_user_id, p_email, p_full_name, p_role, p_center_id, p_grade_level, p_reading_level);

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
