/*
  # Fix User Management Implementation

  1. Changes
    - Implement proper user profile management per Supabase docs
    - Add proper constraints and defaults
    - Fix user initialization timing
    - Add proper error handling

  2. Security
    - Maintain RLS policies
    - Add proper constraints
*/

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create profiles table as recommended by Supabase
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at timestamp with time zone,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  website text,
  
  -- Additional fields from our users_metadata
  first_name text,
  last_name text,
  phone text,
  location text,
  company_name text,
  company_position text,
  registration_number text,
  tax_id text,
  company_address_line1 text,
  company_address_line2 text,
  company_city text,
  company_state text,
  company_postal_code text,
  company_country text,

  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  name_parts RECORD;
  full_name text;
BEGIN
  -- Get full name with proper null handling
  full_name := NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'full_name', '')), '');
  
  -- Split name if provided
  IF full_name IS NOT NULL THEN
    SELECT * INTO name_parts FROM split_full_name(full_name);
  ELSE
    SELECT '' as first_name, '' as last_name INTO name_parts;
  END IF;

  -- Insert row into profiles
  INSERT INTO public.profiles (
    id,
    full_name,
    first_name,
    last_name,
    avatar_url,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(full_name, ''),
    COALESCE(name_parts.first_name, ''),
    COALESCE(name_parts.last_name, ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    now()
  );

  -- Initialize MFA settings
  INSERT INTO public.user_mfa (
    user_id,
    enabled,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    false,
    now(),
    now()
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger for new user profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_profile();

-- Migrate existing data
DO $$
DECLARE
  r RECORD;
BEGIN
  -- Migrate existing users to profiles
  FOR r IN 
    SELECT 
      u.id,
      m.full_name,
      m.first_name,
      m.last_name,
      m.photo_url as avatar_url,
      m.phone,
      m.location,
      m.company_name,
      m.company_position,
      m.registration_number,
      m.tax_id,
      m.company_address_line1,
      m.company_address_line2,
      m.company_city,
      m.company_state,
      m.company_postal_code,
      m.company_country
    FROM auth.users u
    LEFT JOIN users_metadata m ON u.id = m.user_id
  LOOP
    INSERT INTO profiles (
      id,
      full_name,
      first_name,
      last_name,
      avatar_url,
      phone,
      location,
      company_name,
      company_position,
      registration_number,
      tax_id,
      company_address_line1,
      company_address_line2,
      company_city,
      company_state,
      company_postal_code,
      company_country,
      updated_at
    )
    VALUES (
      r.id,
      r.full_name,
      r.first_name,
      r.last_name,
      r.avatar_url,
      r.phone,
      r.location,
      r.company_name,
      r.company_position,
      r.registration_number,
      r.tax_id,
      r.company_address_line1,
      r.company_address_line2,
      r.company_city,
      r.company_state,
      r.company_postal_code,
      r.company_country,
      now()
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      avatar_url = EXCLUDED.avatar_url,
      phone = EXCLUDED.phone,
      location = EXCLUDED.location,
      company_name = EXCLUDED.company_name,
      company_position = EXCLUDED.company_position,
      registration_number = EXCLUDED.registration_number,
      tax_id = EXCLUDED.tax_id,
      company_address_line1 = EXCLUDED.company_address_line1,
      company_address_line2 = EXCLUDED.company_address_line2,
      company_city = EXCLUDED.company_city,
      company_state = EXCLUDED.company_state,
      company_postal_code = EXCLUDED.company_postal_code,
      company_country = EXCLUDED.company_country,
      updated_at = now();
  END LOOP;
END;
$$;