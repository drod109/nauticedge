/*
  # Fix User Initialization

  1. Changes
    - Add proper error handling for user initialization
    - Ensure metadata and MFA tables are properly initialized
    - Add missing indexes and constraints
    - Fix race conditions in user creation

  2. Security
    - Maintain existing RLS policies
    - Add proper error handling
*/

-- Drop existing initialization trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_initialize ON auth.users;

-- Create a more robust initialization function
CREATE OR REPLACE FUNCTION initialize_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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

  -- Create user metadata with proper error handling
  BEGIN
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
      COALESCE(full_name, ''),
      COALESCE(name_parts.first_name, ''),
      COALESCE(name_parts.last_name, ''),
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
      RAISE WARNING 'Error creating user metadata: %', SQLERRM;
      -- Ensure basic record exists
      INSERT INTO users_metadata (user_id, email, created_at, updated_at)
      VALUES (NEW.id, NEW.email, now(), now())
      ON CONFLICT (user_id) DO NOTHING;
  END;

  -- Initialize MFA settings
  BEGIN
    INSERT INTO user_mfa (
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
  EXCEPTION 
    WHEN OTHERS THEN
      RAISE WARNING 'Error initializing MFA: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

-- Create new trigger with proper timing
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_new_user();

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_users_metadata_user_id ON users_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_user_mfa_user_id ON user_mfa(user_id);

-- Initialize any missing records for existing users
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id, email FROM auth.users
  LOOP
    -- Ensure metadata exists
    INSERT INTO users_metadata (user_id, email, created_at, updated_at)
    VALUES (r.id, r.email, now(), now())
    ON CONFLICT (user_id) DO NOTHING;

    -- Ensure MFA settings exist
    INSERT INTO user_mfa (user_id, enabled, created_at, updated_at)
    VALUES (r.id, false, now(), now())
    ON CONFLICT (user_id) DO NOTHING;
  END LOOP;
END;
$$;