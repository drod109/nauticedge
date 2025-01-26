/*
  # Update user metadata to store first and last names separately

  1. Changes
    - Add first_name and last_name columns to users_metadata
    - Create function to split existing full names
    - Update handle_new_user function to store split names

  2. Security
    - Maintains existing RLS policies
    - No data loss during migration
*/

-- Add new columns for first and last name
ALTER TABLE users_metadata
ADD COLUMN first_name text,
ADD COLUMN last_name text;

-- Function to split full name into first and last name
CREATE OR REPLACE FUNCTION split_full_name(full_name text)
RETURNS TABLE(first_name text, last_name text)
LANGUAGE plpgsql
AS $$
DECLARE
  name_parts text[];
BEGIN
  -- Split the full name into parts
  name_parts := regexp_split_to_array(trim(full_name), '\s+');
  
  -- If only one part, use it as first name
  IF array_length(name_parts, 1) = 1 THEN
    first_name := name_parts[1];
    last_name := '';
  ELSE
    -- First part is first name, rest is last name
    first_name := name_parts[1];
    last_name := array_to_string(name_parts[2:array_length(name_parts, 1)], ' ');
  END IF;
  
  RETURN NEXT;
END;
$$;

-- Update existing records
DO $$
DECLARE
  r RECORD;
  name_parts RECORD;
BEGIN
  FOR r IN SELECT id, full_name FROM users_metadata WHERE full_name IS NOT NULL
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