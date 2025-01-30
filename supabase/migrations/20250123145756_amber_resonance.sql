/*
  # Fix MFA temp table RLS policies

  1. Changes
    - Add upsert policy for mfa_temp table
    - Update existing policies to be more permissive for authenticated users
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own MFA setup data" ON mfa_temp;
DROP POLICY IF EXISTS "Users can update own MFA setup data" ON mfa_temp;

-- Create new policies that handle both insert and update
CREATE POLICY "Users can manage own MFA setup data"
  ON mfa_temp
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE mfa_temp ENABLE ROW LEVEL SECURITY;