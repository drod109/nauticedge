/*
  # Fix Subscription RLS Policies

  1. Changes
    - Drop existing RLS policies for subscriptions table
    - Add new policies that allow:
      - Users to create their initial subscription
      - Users to view their own subscription
      - Users to update their own subscription
      - Users to delete their own subscription

  2. Security
    - Maintains row-level security
    - Ensures users can only access their own subscription data
    - Allows new users to create their initial subscription
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own subscription" ON subscriptions;

-- Create new policies
CREATE POLICY "Users can create their initial subscription"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM subscriptions s
      WHERE s.user_id = auth.uid()
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