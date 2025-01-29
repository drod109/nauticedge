/*
  # Fix User Metadata Schema

  1. Changes
    - Add email column if missing
    - Add simplified email and phone validation
    - Add performance indexes
    - Update user creation handler
*/

-- Add missing columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users_metadata' AND column_name = 'email'
  ) THEN
    ALTER TABLE users_metadata ADD COLUMN email text;
  END IF;
END $$;

-- Add simplified constraints
ALTER TABLE users_metadata
  DROP CONSTRAINT IF EXISTS users_metadata_email_check,
  DROP CONSTRAINT IF EXISTS users_metadata_phone_check;

ALTER TABLE users_metadata
  ADD CONSTRAINT users_metadata_email_check CHECK (email ~ '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,}'),
  ADD CONSTRAINT users_metadata_phone_check CHECK (phone IS NULL OR phone ~ '^\+?[0-9][0-9 -]*$');

-- Add indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_users_metadata_email ON users_metadata(email);
CREATE INDEX IF NOT EXISTS idx_users_metadata_full_name ON users_metadata(full_name);

-- Update handle_new_user function to be more robust
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  name_parts RECORD;
  full_name text;
BEGIN
  -- Get full name from metadata, with fallback
  full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  
  -- Split the full name
  SELECT * INTO name_parts 
  FROM split_full_name(full_name);
  
  BEGIN
    -- Insert new record with split names
    INSERT INTO users_metadata (
      user_id,
      email,
      full_name,
      first_name,
      last_name,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      full_name,
      name_parts.first_name,
      name_parts.last_name,
      now(),
      now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      updated_at = now();
  EXCEPTION 
    WHEN OTHERS THEN
      -- Log error but don't prevent user creation
      RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$;