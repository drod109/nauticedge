/*
  # Fix Login Attempts RLS Policies

  1. Changes
    - Add RLS policy to allow inserting login attempts
    - Add RLS policy to allow updating own login attempts
    - Add RLS policy to allow deleting own login attempts
    - Add RLS policy to allow reading own login attempts
  
  2. Security
    - Enable RLS on login_attempts table
    - Restrict access to own records only
    - Allow insert for authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own login attempts" ON login_attempts;

-- Create comprehensive RLS policies
CREATE POLICY "Users can insert login attempts"
  ON login_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own login attempts"
  ON login_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own login attempts"
  ON login_attempts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own login attempts"
  ON login_attempts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);