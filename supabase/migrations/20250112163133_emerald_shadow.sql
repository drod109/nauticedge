/*
  # Fix RLS Policies for All Tables

  1. Changes
    - Simplify RLS policies for subscriptions table
    - Ensure proper authentication checks
    - Allow initial subscription creation
    - Maintain data isolation between users
    
  2. Security
    - Maintains RLS protection
    - Ensures users can only access their own data
    - Allows proper subscription management
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON subscriptions;

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