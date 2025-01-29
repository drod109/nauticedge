/*
  # Update API Key Creation Function
  
  1. Enable pgcrypto extension
  2. Update create_api_key function to use proper crypto functions
  
  Changes:
  - Add pgcrypto extension for secure key generation
  - Update key generation to use crypto_strong_random_bytes
  - Add better input validation
  - Add proper error handling
*/

-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to create a new API key
CREATE OR REPLACE FUNCTION create_api_key(p_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_api_key text;
  v_key_hash text;
  v_result jsonb;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Validate input
  IF p_name IS NULL OR length(trim(p_name)) = 0 THEN
    RAISE EXCEPTION 'Key name is required';
  END IF;

  -- Generate API key using crypto_strong_random_bytes
  v_api_key := encode(gen_random_bytes(32), 'hex');
  v_key_hash := encode(digest(v_api_key, 'sha256'), 'hex');

  -- Insert new API key
  INSERT INTO api_keys (
    user_id,
    name,
    key_hash,
    created_at,
    updated_at
  )
  VALUES (
    v_user_id,
    p_name,
    v_key_hash,
    now(),
    now()
  );

  -- Return the API key (only shown once)
  v_result := jsonb_build_object(
    'key', v_api_key
  );

  RETURN v_result;
EXCEPTION
  WHEN others THEN
    -- Log error details but don't expose them to the client
    RAISE LOG 'Error in create_api_key: %', SQLERRM;
    RAISE EXCEPTION 'Failed to create API key';
END;
$$;