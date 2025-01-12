/*
  # Fix subscription RLS policies - Final Version

  1. Changes
    - Drop all existing policies
    - Create new simplified policies that:
      - Allow authenticated users to create their own subscription
      - Allow users to view their own subscription
      - Allow users to update their own subscription
      - Allow users to delete their own subscription
    - Remove any uniqueness checks from policies to fix signup flow
    - Ensure proper authentication checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read for users" ON subscriptions;
DROP POLICY IF EXISTS "Enable insert for users" ON subscriptions;
DROP POLICY IF EXISTS "Enable update for users" ON subscriptions;
DROP POLICY IF EXISTS "Enable delete for users" ON subscriptions;

-- Create new simplified policies
CREATE POLICY "Enable read for users"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

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

-- Ensure RLS is enabled
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;