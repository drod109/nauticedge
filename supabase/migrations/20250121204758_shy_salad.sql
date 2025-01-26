/*
  # Fix user metadata handling

  1. Changes
    - Add proper constraints and indexes
    - Improve trigger function
    - Add RLS policies if not exist
    - Fix race conditions

  2. Security
    - Maintain data integrity
    - Prevent invalid data
*/

-- Add missing columns and constraints
ALTER TABLE users_metadata
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
  ALTER COLUMN user_id SET NOT NULL,
  ADD CONSTRAINT users_metadata_user_id_fk 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- Add proper email validation
ALTER TABLE users_metadata
  DROP CONSTRAINT IF EXISTS users_metadata_email_check,
  ADD CONSTRAINT users_metadata_email_check 
    CHECK (email ~ '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}');

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_metadata_user_id ON users_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_users_metadata_email ON users_metadata(email);

-- Update handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_full_name text;
  v_email text;
BEGIN
  -- Input validation
  v_email := NEW.email;
  IF v_email IS NULL THEN
    RAISE WARNING 'Email is required';
    RETURN NEW;
  END IF;

  -- Get full name with fallback
  v_full_name := NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'full_name', '')), '');

  -- Insert or update metadata
  INSERT INTO users_metadata (
    user_id,
    email,
    full_name,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    v_email,
    COALESCE(v_full_name, ''),
    now(),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error but don't prevent user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Enable RLS
ALTER TABLE users_metadata ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own metadata" ON users_metadata;
  DROP POLICY IF EXISTS "Users can update own metadata" ON users_metadata;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create new policies
CREATE POLICY "Users can view own metadata"
  ON users_metadata FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own metadata"
  ON users_metadata FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users_metadata TO authenticated;