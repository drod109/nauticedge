-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  plan text NOT NULL CHECK (plan IN ('basic', 'professional', 'enterprise')),
  status text NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Create function to handle subscription creation
CREATE OR REPLACE FUNCTION create_subscription(
  p_user_id uuid,
  p_plan text,
  p_period_start timestamptz DEFAULT now(),
  p_period_end timestamptz DEFAULT (now() + interval '1 month')
) RETURNS uuid AS $$
DECLARE
  v_subscription_id uuid;
BEGIN
  -- Validate plan
  IF p_plan NOT IN ('basic', 'professional', 'enterprise') THEN
    RAISE EXCEPTION 'Invalid subscription plan';
  END IF;

  -- Insert new subscription
  INSERT INTO subscriptions (
    user_id,
    plan,
    status,
    current_period_start,
    current_period_end
  ) VALUES (
    p_user_id,
    p_plan,
    'active',
    p_period_start,
    p_period_end
  )
  RETURNING id INTO v_subscription_id;

  RETURN v_subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle subscription updates
CREATE OR REPLACE FUNCTION update_subscription(
  p_user_id uuid,
  p_plan text
) RETURNS void AS $$
BEGIN
  -- Validate plan
  IF p_plan NOT IN ('basic', 'professional', 'enterprise') THEN
    RAISE EXCEPTION 'Invalid subscription plan';
  END IF;

  -- Update existing subscription
  UPDATE subscriptions
  SET 
    plan = p_plan,
    updated_at = now()
  WHERE user_id = p_user_id
  AND status = 'active';

  IF NOT FOUND THEN
    -- If no active subscription exists, create one
    PERFORM create_subscription(p_user_id, p_plan);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle subscription cancellation
CREATE OR REPLACE FUNCTION cancel_subscription(
  p_user_id uuid
) RETURNS void AS $$
BEGIN
  -- Update subscription status
  UPDATE subscriptions
  SET 
    status = 'cancelled',
    updated_at = now()
  WHERE user_id = p_user_id
  AND status = 'active';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No active subscription found';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;