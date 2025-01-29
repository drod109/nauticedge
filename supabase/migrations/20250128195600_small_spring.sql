/*
  # Add API Key Creation Function
  
  1. New Functions
    - create_api_key: Creates a new API key with proper hashing and validation
  
  2. Security
    - Function is SECURITY DEFINER to run with elevated privileges
    - Validates user permissions and input
    - Uses secure hashing for API keys
*/

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

  -- Generate API key
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
END;
$$;