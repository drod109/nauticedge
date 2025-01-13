/*
  # MFA Implementation Schema Update

  1. New Tables
    - user_mfa: Stores MFA configuration for users
    - mfa_verification_attempts: Tracks verification attempts

  2. Security
    - Enable RLS on all tables
    - Add policies for MFA verification
    - Add rate limiting for verification attempts
*/

-- Create user_mfa table
CREATE TABLE IF NOT EXISTS user_mfa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  secret text NOT NULL,
  mfa_method text NOT NULL DEFAULT 'totp',
  backup_codes jsonb,
  enabled boolean DEFAULT false,
  verified_at timestamptz,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_mfa_method CHECK (mfa_method IN ('totp', 'microsoft_authenticator')),
  UNIQUE (user_id)
);

-- Create MFA verification attempts table
CREATE TABLE IF NOT EXISTS mfa_verification_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  ip_address text NOT NULL,
  attempted_at timestamptz DEFAULT now(),
  success boolean NOT NULL,
  device_info jsonb DEFAULT '{}'::jsonb
);

-- Create temporary MFA setup table
CREATE TABLE IF NOT EXISTS mfa_temp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  secret text NOT NULL,
  recovery_codes jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE user_mfa ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_verification_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_temp ENABLE ROW LEVEL SECURITY;

-- Create policies for user_mfa
CREATE POLICY "Users can view their own MFA settings"
  ON user_mfa
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own MFA settings"
  ON user_mfa
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for verification attempts
CREATE POLICY "Users can view their own verification attempts"
  ON mfa_verification_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for temporary MFA setup
CREATE POLICY "Users can manage their temporary MFA setup"
  ON mfa_temp
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

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