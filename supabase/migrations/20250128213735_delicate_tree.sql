-- Drop existing function
DROP FUNCTION IF EXISTS create_api_key(text);

-- Create api_keys table if it doesn't exist
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  key_hash text NOT NULL,
  scopes text[] DEFAULT '{}',
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz,
  is_active boolean DEFAULT true,
  UNIQUE(key_hash)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can create API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can update own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can delete own API keys" ON api_keys;

-- Create RLS policies
CREATE POLICY "Users can view own API keys"
  ON api_keys FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create API keys"
  ON api_keys FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
  ON api_keys FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys"
  ON api_keys FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

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

  -- Default to basic plan if no subscription found
  IF v_subscription_plan IS NULL THEN
    v_subscription_plan := 'basic';
  END IF;

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
$$;