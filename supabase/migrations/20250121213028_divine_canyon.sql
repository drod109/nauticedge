/*
  # Fix User Metadata and MFA Creation

  1. Changes
    - Add initialize_user_settings function to create all required records
    - Add trigger to automatically initialize settings for new users
    - Add missing RLS policies
*/

-- Function to ensure user metadata exists
CREATE OR REPLACE FUNCTION ensure_user_metadata(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO users_metadata (
    user_id,
    email,
    created_at,
    updated_at
  )
  SELECT 
    id,
    email,
    now(),
    now()
  FROM auth.users
  WHERE id = p_user_id
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Function to ensure MFA settings exist
CREATE OR REPLACE FUNCTION ensure_user_mfa(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_mfa (
    user_id,
    enabled,
    created_at,
    updated_at
  )
  VALUES (
    p_user_id,
    false,
    now(),
    now()
  )
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Function to initialize all settings for a user
CREATE OR REPLACE FUNCTION initialize_user_settings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Ensure metadata exists
  PERFORM ensure_user_metadata(NEW.id);
  
  -- Ensure MFA settings exist
  PERFORM ensure_user_mfa(NEW.id);
  
  RETURN NEW;
END;
$$;

-- Create trigger to initialize settings for new users
DROP TRIGGER IF EXISTS on_auth_user_created_initialize ON auth.users;
CREATE TRIGGER on_auth_user_created_initialize
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_settings();

-- Add missing RLS policies
CREATE POLICY "Users can insert own metadata"
  ON users_metadata
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own MFA settings"
  ON user_mfa
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Initialize settings for existing users
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id FROM auth.users
  LOOP
    PERFORM ensure_user_metadata(r.id);
    PERFORM ensure_user_mfa(r.id);
  END LOOP;
END;
$$;