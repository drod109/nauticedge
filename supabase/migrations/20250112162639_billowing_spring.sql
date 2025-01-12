/*
  # Fix Subscription RLS Policy

  1. Changes
    - Drop existing restrictive policies
    - Add new policy to allow subscription creation during signup
    - Maintain policies for viewing and updating subscriptions

  2. Security
    - Ensures users can only create one subscription
    - Maintains user data isolation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow initial subscription creation" ON subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscription" ON subscriptions;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable read access for users based on user_id"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
  ON subscriptions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);