/*
  # Fix user creation issues

  1. Changes
    - Improve error handling in handle_new_user trigger
    - Add proper validation
    - Fix race conditions
    - Add better error messages

  2. Security
    - Maintain data integrity
    - Prevent invalid data
*/

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  name_parts RECORD;
  full_name text;
BEGIN
  -- Get full name from metadata with proper null handling
  full_name := NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'full_name', '')), '');
  
  -- Get email with validation
  IF NEW.email IS NULL THEN
    RAISE EXCEPTION 'Email is required';
  END IF;

  -- Split the full name with null handling
  IF full_name IS NOT NULL THEN
    SELECT * INTO name_parts FROM split_full_name(full_name);
  ELSE
    -- Set default empty values if no full name provided
    SELECT '' as first_name, '' as last_name INTO name_parts;
  END IF;

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
    WHEN unique_violation THEN
      -- Handle unique constraint violations
      RAISE WARNING 'Duplicate user_id or email: %', NEW.id;
      -- Update existing record
      UPDATE users_metadata
      SET
        email = NEW.email,
        full_name = COALESCE(full_name, ''),
        first_name = COALESCE(name_parts.first_name, ''),
        last_name = COALESCE(name_parts.last_name, ''),
        updated_at = now()
      WHERE user_id = NEW.id;
      
    WHEN check_violation THEN
      -- Handle constraint violations
      RAISE WARNING 'Invalid data format: %', SQLERRM;
      -- Still create the record but with sanitized data
      INSERT INTO users_metadata (
        user_id,
        email,
        created_at,
        updated_at
      )
      VALUES (
        NEW.id,
        NEW.email,
        now(),
        now()
      );
      
    WHEN OTHERS THEN
      -- Log other errors but don't prevent user creation
      RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
      -- Ensure basic record is created
      INSERT INTO users_metadata (
        user_id,
        email,
        created_at,
        updated_at
      )
      VALUES (
        NEW.id,
        NEW.email,
        now(),
        now()
      )
      ON CONFLICT DO NOTHING;
  END;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger with proper timing
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Add index to improve performance
CREATE INDEX IF NOT EXISTS idx_users_metadata_user_id_email 
ON users_metadata(user_id, email);

-- Ensure proper permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users_metadata TO authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user TO authenticated;