/*
  # Update handle_new_user function for split names

  1. Changes
    - Update handle_new_user function to store split names
    - No column additions since they already exist

  2. Security
    - Maintains existing RLS policies
    - No data loss during migration
*/

-- Update existing records with split names
DO $$
DECLARE
  r RECORD;
  name_parts RECORD;
BEGIN
  FOR r IN SELECT id, full_name FROM users_metadata WHERE full_name IS NOT NULL
    AND (first_name IS NULL OR last_name IS NULL)
  LOOP
    SELECT * INTO name_parts FROM split_full_name(r.full_name);
    
    UPDATE users_metadata
    SET 
      first_name = name_parts.first_name,
      last_name = name_parts.last_name
    WHERE id = r.id;
  END LOOP;
END;
$$;

-- Update handle_new_user function to handle split names
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  name_parts RECORD;
BEGIN
  -- Split the full name
  SELECT * INTO name_parts 
  FROM split_full_name(NEW.raw_user_meta_data->>'full_name');
  
  -- Insert new record with split names
  INSERT INTO users_metadata (
    user_id,
    full_name,
    first_name,
    last_name
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    name_parts.first_name,
    name_parts.last_name
  );
  
  RETURN NEW;
END;
$$;