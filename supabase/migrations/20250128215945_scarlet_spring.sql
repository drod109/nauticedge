-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own webhooks" ON webhooks;
DROP POLICY IF EXISTS "Users can create own webhooks" ON webhooks;
DROP POLICY IF EXISTS "Users can update own webhooks" ON webhooks;
DROP POLICY IF EXISTS "Users can delete own webhooks" ON webhooks;

-- Create webhooks table if it doesn't exist
CREATE TABLE IF NOT EXISTS webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  description text,
  events text[] NOT NULL DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_triggered_at timestamptz,
  secret text, -- For webhook signature verification
  CONSTRAINT webhooks_url_check CHECK (url ~ '^https?://.*')
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_active ON webhooks(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own webhooks"
  ON webhooks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own webhooks"
  ON webhooks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own webhooks"
  ON webhooks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own webhooks"
  ON webhooks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to create webhook
CREATE OR REPLACE FUNCTION create_webhook(
  p_url text,
  p_description text,
  p_events text[]
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_webhook_id uuid;
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
    RAISE EXCEPTION 'Webhooks are only available for Professional and Enterprise plans';
  END IF;

  -- Validate URL
  IF p_url IS NULL OR p_url !~ '^https?://.*' THEN
    RAISE EXCEPTION 'Invalid webhook URL';
  END IF;

  -- Check webhook limit (10 active webhooks per user)
  IF (
    SELECT COUNT(*)
    FROM webhooks
    WHERE user_id = v_user_id
    AND is_active = true
  ) >= 10 THEN
    RAISE EXCEPTION 'Maximum number of active webhooks reached (10)';
  END IF;

  -- Insert webhook
  INSERT INTO webhooks (
    user_id,
    url,
    description,
    events,
    created_at,
    is_active,
    secret
  )
  VALUES (
    v_user_id,
    p_url,
    p_description,
    p_events,
    now(),
    true,
    encode(gen_random_bytes(32), 'hex')
  )
  RETURNING id INTO v_webhook_id;

  RETURN v_webhook_id;

EXCEPTION
  WHEN OTHERS THEN
    -- Log error details but don't expose them to the client
    RAISE LOG 'Error in create_webhook: %', SQLERRM;
    RAISE EXCEPTION 'Failed to create webhook';
END;
$$;