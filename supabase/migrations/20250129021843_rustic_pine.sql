-- Drop existing function
DROP FUNCTION IF EXISTS create_api_key(text);

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
  v_subscription_plan text;
  v_active_keys_count int;
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

  -- Validate subscription
  IF v_subscription_plan IS NULL THEN
    RAISE EXCEPTION 'No active subscription found';
  END IF;

  IF v_subscription_plan NOT IN ('professional', 'enterprise') THEN
    RAISE EXCEPTION 'API keys are only available for Professional and Enterprise plans';
  END IF;

  -- Validate input
  IF p_name IS NULL OR length(trim(p_name)) = 0 THEN
    RAISE EXCEPTION 'Key name is required';
  END IF;

  -- Check key limit (10 active keys per user)
  SELECT COUNT(*) INTO v_active_keys_count
  FROM api_keys
  WHERE user_id = v_user_id
  AND is_active = true;

  IF v_active_keys_count >= 10 THEN
    RAISE EXCEPTION 'Maximum number of active API keys reached (10)';
  END IF;

  BEGIN
    -- Generate API key using UUID and timestamp for uniqueness
    v_api_key := replace(
      gen_random_uuid()::text || 
      '-' || 
      extract(epoch from clock_timestamp())::text || 
      '-' ||
      md5(random()::text),
      '-',
      ''
    );
    
    -- Create hash using built-in digest function
    v_key_hash := md5(v_api_key);

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
      clock_timestamp(),
      clock_timestamp(),
      true
    );

    -- Return the API key (only shown once)
    RETURN jsonb_build_object(
      'key', v_api_key
    );
  EXCEPTION
    WHEN unique_violation THEN
      RAISE EXCEPTION 'An API key with this name already exists';
    WHEN OTHERS THEN
      -- Log error details but don't expose them to the client
      RAISE LOG 'Error in create_api_key: %', SQLERRM;
      RAISE EXCEPTION 'Failed to create API key';
  END;
END;
$$;