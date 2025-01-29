/*
  # Add subscription management functions
  
  1. New Tables
    - `subscriptions` table for tracking user subscriptions
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `plan` (text)
      - `status` (text)
      - `current_period_start` (timestamptz)
      - `current_period_end` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Functions
    - `update_subscription` function for changing subscription plans
  
  3. Security
    - Enable RLS on subscriptions table
    - Add policies for user access
*/

-- Create subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL DEFAULT (now() + interval '1 month'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT subscriptions_plan_check 
    CHECK (plan IN ('basic', 'professional', 'enterprise')),
  CONSTRAINT subscriptions_status_check 
    CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')),
  CONSTRAINT subscriptions_period_check 
    CHECK (current_period_end > current_period_start)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id 
  ON subscriptions(user_id);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update subscription
CREATE OR REPLACE FUNCTION update_subscription(
  p_user_id uuid,
  p_plan text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_period_start timestamptz;
  v_current_period_end timestamptz;
BEGIN
  -- Validate plan
  IF p_plan NOT IN ('basic', 'professional', 'enterprise') THEN
    RAISE EXCEPTION 'Invalid subscription plan';
  END IF;

  -- Set period dates
  v_current_period_start := now();
  v_current_period_end := v_current_period_start + interval '1 month';

  -- Update or insert subscription
  INSERT INTO subscriptions (
    user_id,
    plan,
    status,
    current_period_start,
    current_period_end,
    created_at,
    updated_at
  )
  VALUES (
    p_user_id,
    p_plan,
    'active',
    v_current_period_start,
    v_current_period_end,
    now(),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    plan = EXCLUDED.plan,
    status = 'active',
    current_period_start = v_current_period_start,
    current_period_end = v_current_period_end,
    updated_at = now();
END;
$$;