/*
  # Fix subscription RLS policies

  1. Changes
    - Drop existing policies
    - Create new simplified policies that allow authenticated users to:
      - Insert their own subscription
      - View their own subscription
      - Update their own subscription
      - Delete their own subscription
    - Remove uniqueness check from INSERT policy to fix signup flow
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