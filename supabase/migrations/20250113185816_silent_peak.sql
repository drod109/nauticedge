/*
  # MFA Implementation Schema Update

  1. Changes
    - Add MFA method column to user_mfa table
    - Add recovery codes table
    - Add MFA verification attempts tracking
    - Add MFA backup methods

  2. Security
    - Add policies for MFA verification
    - Add rate limiting for verification attempts
*/

-- Add MFA method to user_mfa table
ALTER TABLE user_mfa
ADD COLUMN IF NOT EXISTS mfa_method text NOT NULL DEFAULT 'totp',
ADD COLUMN IF NOT EXISTS backup_codes jsonb,
ADD COLUMN IF NOT EXISTS last_used_at timestamptz,
ADD CONSTRAINT valid_mfa_method CHECK (mfa_method IN ('totp', 'microsoft_authenticator'));

-- Create MFA verification attempts table
CREATE TABLE IF NOT EXISTS mfa_verification_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  ip_address text NOT NULL,
  attempted_at timestamptz DEFAULT now(),
  success boolean NOT NULL,
  device_info jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE mfa_verification_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for verification attempts
CREATE POLICY "Users can view their own verification attempts"
  ON mfa_verification_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to check verification attempts
CREATE OR REPLACE FUNCTION check_mfa_verification_attempts(
  p_user_id uuid,
  p_ip_address text
) RETURNS boolean AS $$
DECLARE
  attempt_count integer;
BEGIN
  -- Count failed attempts in the last 15 minutes
  SELECT COUNT(*)
  INTO attempt_count
  FROM mfa_verification_attempts
  WHERE user_id = p_user_id
    AND ip_address = p_ip_address
    AND success = false
    AND attempted_at > NOW() - INTERVAL '15 minutes';

  -- Return true if under limit
  RETURN attempt_count < 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;