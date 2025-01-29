-- Drop existing function
DROP FUNCTION IF EXISTS create_api_key(text);

-- Function to create a new API key with improved error handling
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
  -- Get current user ID with proper error handling
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Check subscription plan with proper error handling
  BEGIN
    SELECT plan INTO v_subscription_plan
    FROM subscriptions
    WHERE user_id = v_user_id
    AND status = 'active'
    AND current_period_end > now()
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_subscription_plan IS NULL THEN
      RAISE EXCEPTION 'No active subscription found';
    END IF;

    IF v_subscription_plan NOT IN ('professional', 'enterprise') THEN
      RAISE EXCEPTION 'API keys are only available for Professional and Enterprise plans';
    END IF;
  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RAISE EXCEPTION 'No active subscription found';
  END;

  -- Validate input with proper error handling
  IF p_name IS NULL OR length(trim(p_name)) = 0 THEN
    RAISE EXCEPTION 'Key name is required';
  END IF;

  -- Check key limit with proper error handling
  SELECT COUNT(*) INTO v_active_keys_count
  FROM api_keys
  WHERE user_id = v_user_id
  AND is_active = true;

  IF v_active_keys_count >= 10 THEN
    RAISE EXCEPTION 'Maximum number of active API keys reached (10)';
  END IF;

  -- Generate API key and hash in a transaction
  BEGIN
    -- Use a combination of methods to generate a secure random key
    v_api_key := encode(
      digest(
        gen_random_uuid()::text || 
        clock_timestamp()::text || 
        random()::text,
        'sha256'
      ),
      'hex'
    );
    
    -- Use simple MD5 for hash storage (since we never need to decrypt)
    v_key_hash := md5(v_api_key);

    -- Insert new API key with explicit error handling
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

    -- Return the API key
    RETURN jsonb_build_object(
      'key', v_api_key
    );

  EXCEPTION
    WHEN unique_violation THEN
      RAISE EXCEPTION 'An API key with this name already exists';
    WHEN OTHERS THEN
      -- Log the error but return a generic message
      RAISE LOG 'Error in create_api_key: %', SQLERRM;
      RAISE EXCEPTION 'Failed to create API key';
  END;

EXCEPTION
  -- Handle all other errors with appropriate messages
  WHEN OTHERS THEN
    -- Log the error but return a generic message
    RAISE LOG 'Error in create_api_key: %', SQLERRM;
    RAISE EXCEPTION 'Failed to create API key';
END;
$$;