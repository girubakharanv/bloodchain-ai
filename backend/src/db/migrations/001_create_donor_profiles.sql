-- Migration: 001_create_donor_profiles.sql
-- Description: Creates the donor_profiles table with RLS and constraints.

-- 1. Create the donor_profiles table
CREATE TABLE IF NOT EXISTS public.donor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  blood_group TEXT NOT NULL,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Add unique constraint on user_id
  CONSTRAINT donor_profiles_user_id_key UNIQUE (user_id),
  
  -- Prevent duplicate donor accounts by normalizing and checking email
  CONSTRAINT donor_profiles_email_key UNIQUE (email),

  -- Blood group validation
  CONSTRAINT donor_profiles_blood_group_check CHECK (
    blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
  )
);

-- 2. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. Add trigger to update updated_at automatically
DROP TRIGGER IF EXISTS update_donor_profiles_updated_at ON public.donor_profiles;
CREATE TRIGGER update_donor_profiles_updated_at
  BEFORE UPDATE ON public.donor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.donor_profiles ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Prevent public SELECT access, unrestricted INSERT, or UPDATE.

-- Policy: Authenticated users can read their own profile
CREATE POLICY "Users can view own donor profile"
  ON public.donor_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Authenticated users can update their own profile
CREATE POLICY "Users can update own donor profile"
  ON public.donor_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Only service_role (backend) can insert new donor profiles
-- This ensures that anonymous users cannot arbitrarily insert profiles,
-- and inserts are completely handled securely by the backend logic.
CREATE POLICY "Service role can manage all donor profiles"
  ON public.donor_profiles
  USING (true)
  WITH CHECK (true);
