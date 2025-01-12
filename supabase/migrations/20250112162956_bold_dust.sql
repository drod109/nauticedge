/*
  # Fix Subscription RLS Policies

  1. Changes
    - Drop existing restrictive policies
    - Add new policies that properly handle authentication state
    - Enable proper access for authenticated users
    
  2. Security
    - Maintains RLS protection
    - Ensures users can only access their own data
    - Allows initial subscription creation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON subscriptions;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON subscriptions;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON subscriptions;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON subscriptions;

-- Create new policies with proper authentication checks
CREATE POLICY "Enable all operations for authenticated users"
  ON subscriptions
  FOR ALL
  TO authenticated
  USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE auth.uid() = user_id
    END
  )
  WITH CHECK (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE auth.uid() = user_id
    END
  );