/*
  # Add insert policy for user sessions

  1. Changes
    - Add policy to allow users to insert their own sessions
*/

-- Create policy for inserting sessions
CREATE POLICY "Users can insert their own sessions"
  ON user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);