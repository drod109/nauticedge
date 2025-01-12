/*
  # Fix Subscription Policies

  1. Changes
    - Drop existing subscription policies
    - Add new policy to allow authenticated users to create their initial subscription
    - Add policies for viewing, updating, and deleting subscriptions
    - Add system-level policy for initial subscription creation

  2. Security
    - Maintains row-level security
    - Allows new users to create their first subscription
    - Prevents multiple subscriptions per user
    - Ensures users can only access their own subscription data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their initial subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscription" ON subscriptions;

-- Create new policies
CREATE POLICY "System can create initial subscription"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM subscriptions s
      WHERE s.user_id = user_id
    )
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