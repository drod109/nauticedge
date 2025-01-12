/*
  # Fix Subscription Policies - Final Version

  1. Changes
    - Drop all existing policies
    - Disable and re-enable RLS to ensure clean state
    - Create new simplified policies with proper authentication checks
    - Add explicit security definer function for subscription creation
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read for users" ON subscriptions;
DROP POLICY IF EXISTS "Enable insert for users" ON subscriptions;
DROP POLICY IF EXISTS "Enable update for users" ON subscriptions;
DROP POLICY IF EXISTS "Enable delete for users" ON subscriptions;

-- Temporarily disable RLS
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;

-- Create helper function for subscription creation
CREATE OR REPLACE FUNCTION create_initial_subscription(
  user_id uuid,
  plan text,
  status text,
  period_start timestamptz,
  period_end timestamptz
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO subscriptions (
    user_id,
    plan,
    status,
    current_period_start,
    current_period_end
  ) VALUES (
    user_id,
    plan,
    status,
    period_start,
    period_end
  );
END;
$$;

-- Re-enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Enable read for users"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
  );

CREATE POLICY "Enable update for users"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users"
  ON subscriptions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);