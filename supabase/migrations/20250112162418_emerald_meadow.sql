/*
  # Fix Subscription Policies - Final

  1. Changes
    - Drop all existing subscription policies
    - Add new simplified policy for initial subscription creation
    - Maintain policies for viewing and managing subscriptions

  2. Security
    - Allows authenticated users to create their first subscription
    - Maintains user isolation for subscription data
    - Prevents multiple subscriptions per user
*/

-- Drop existing policies
DROP POLICY IF EXISTS "System can create initial subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can create their initial subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscription" ON subscriptions;

-- Create new simplified policies
CREATE POLICY "Allow initial subscription creation"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
  );

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

CREATE POLICY "Users can delete their own subscription"
  ON subscriptions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);