/*
  # Fix API Key Creation Function - Part 2
  
  1. Create function with proper error handling
  2. Add subscription plan validation
  3. Add key limit check
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
  v_subscription_plan text;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check subscription plan
  SELECT plan INTO v_subscription_plan
  FROM subscriptions
  WHERE user_id = v_user_id
  AND status = 'active'
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_subscription_plan NOT IN ('professional', 'enterprise') THEN
    RAISE EXCEPTION 'API keys are only available for Professional and Enterprise plans';
  END IF;

  -- Validate input
  IF p_name IS NULL OR length(trim(p_name)) = 0 THEN
    RAISE EXCEPTION 'Key name is required';
  END IF;

  -- Check key limit (10 active keys per user)
  IF (
    SELECT COUNT(*)
    FROM api_keys
    WHERE user_id = v_user_id
    AND is_active = true
  ) >= 10 THEN
    RAISE EXCEPTION 'Maximum number of active API keys reached (10)';
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
    updated_at,
    is_active
  )
  VALUES (
    v_user_id,
    trim(p_name),
    v_key_hash,
    now(),
    now(),
    true
  );

  -- Return the API key (only shown once)
  v_result := jsonb_build_object(
    'key', v_api_key
  );

  RETURN v_result;

EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'An API key with this name already exists';
  WHEN OTHERS THEN
    -- Log error details but don't expose them to the client
    RAISE LOG 'Error in create_api_key: %', SQLERRM;
    RAISE EXCEPTION 'Failed to create API key';
END;
$$;