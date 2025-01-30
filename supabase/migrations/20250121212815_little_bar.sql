/*
  # Update User Metadata Schema

  1. Changes
    - Add timestamps and constraints
    - Update email validation
    - Add performance indexes
    - Update RLS policies
*/

-- Add missing columns and constraints
ALTER TABLE users_metadata
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
  ALTER COLUMN user_id SET NOT NULL;

-- Add proper email validation
ALTER TABLE users_metadata
  DROP CONSTRAINT IF EXISTS users_metadata_email_check;

ALTER TABLE users_metadata
  ADD CONSTRAINT users_metadata_email_check 
    CHECK (email ~ '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}');

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_metadata_user_id ON users_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_users_metadata_email ON users_metadata(email);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own metadata" ON users_metadata;
DROP POLICY IF EXISTS "Users can update own metadata" ON users_metadata;

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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users_metadata TO authenticated;