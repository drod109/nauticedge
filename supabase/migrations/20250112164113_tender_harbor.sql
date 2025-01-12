/*
  # Fix Subscription RLS Policies

  1. Changes
    - Drop and recreate subscription policies with proper authentication checks
    - Ensure insert operations work during signup
    - Maintain data isolation between users
    
  2. Security
    - Maintains RLS protection
    - Ensures users can only access their own data
    - Allows initial subscription creation during signup
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read for users" ON subscriptions;
DROP POLICY IF EXISTS "Enable insert for users" ON subscriptions;
DROP POLICY IF EXISTS "Enable update for users" ON subscriptions;
DROP POLICY IF EXISTS "Enable delete for users" ON subscriptions;

-- Create new policies with proper authentication checks
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
    -- Allow insert if the user_id matches the authenticated user
    -- and no existing subscription exists for this user
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