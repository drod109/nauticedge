/*
  # Add Missing MFA and Session Policies

  1. New Policies
    - Add missing insert policy for user_mfa
    - Add missing insert policy for user_sessions

  Note: Other policies were already created in previous migrations
*/

-- Add missing policy for user_mfa
CREATE POLICY "Users can insert own MFA settings"
  ON user_mfa
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add missing policy for user_sessions
CREATE POLICY "Users can insert own sessions"
  ON user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);