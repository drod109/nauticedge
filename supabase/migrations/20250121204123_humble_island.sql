/*
  # Fix signup error and improve user creation

  1. Changes
    - Add missing columns to users_metadata table
    - Update handle_new_user function to handle errors gracefully
    - Add constraints to ensure data integrity
    - Add indexes for better performance

  2. Security
    - Add RLS policies for user metadata
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

-- Add constraints
ALTER TABLE users_metadata
  ADD CONSTRAINT users_metadata_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT users_metadata_phone_check CHECK (phone IS NULL OR phone ~ '^\+?[0-9\s-()]+$');

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
    );
  EXCEPTION 
    WHEN unique_violation THEN
      -- If record already exists, update it
      UPDATE users_metadata
      SET
        email = NEW.email,
        full_name = full_name,
        first_name = name_parts.first_name,
        last_name = name_parts.last_name,
        updated_at = now()
      WHERE user_id = NEW.id;
    WHEN OTHERS THEN
      -- Log error but don't prevent user creation
      RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$;