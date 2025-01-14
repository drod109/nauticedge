/*
  # Add subscription management functions

  1. New Functions
    - create_subscription: Creates a new subscription for a user
    - update_subscription: Updates an existing subscription
    - cancel_subscription: Cancels a subscription

  2. Security
    - Functions are SECURITY DEFINER to ensure proper access control
    - Input validation for subscription plans
*/

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