/*
  # Fix User Metadata Handling

  1. Changes
    - Add function to handle missing metadata
    - Add function to handle missing MFA settings
    - Add function to initialize user settings

  2. Purpose
    - Ensure all users have metadata records
    - Ensure all users have MFA settings initialized
    - Fix 406 errors when querying user data
*/

-- Function to ensure user metadata exists
CREATE OR REPLACE FUNCTION ensure_user_metadata(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO users_metadata (user_id)
  VALUES (p_user_id)
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
  INSERT INTO user_mfa (user_id, enabled)
  VALUES (p_user_id, false)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Function to initialize all settings for a user
CREATE OR REPLACE FUNCTION initialize_user_settings(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Ensure metadata exists
  PERFORM ensure_user_metadata(p_user_id);
  
  -- Ensure MFA settings exist
  PERFORM ensure_user_mfa(p_user_id);
END;
$$;

-- Initialize settings for existing users
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id FROM auth.users
  LOOP
    PERFORM initialize_user_settings(r.id);
  END LOOP;
END;
$$;