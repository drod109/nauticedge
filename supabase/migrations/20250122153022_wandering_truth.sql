/*
  # Fix MFA Tables and Functions

  1. New Tables
    - `mfa_temp` for temporary MFA setup data
    - `mfa_verification_attempts` for tracking verification attempts

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
    - Add indexes for performance

  3. Changes
    - Update MFA-related functions
    - Add proper error handling
*/

-- Create mfa_temp table for temporary setup data
CREATE TABLE IF NOT EXISTS mfa_temp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  secret text NOT NULL,
  recovery_codes text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '1 hour'),
  UNIQUE(user_id)
);

-- Create mfa_verification_attempts table
CREATE TABLE IF NOT EXISTS mfa_verification_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ip_address text,
  success boolean DEFAULT false,
  device_info jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE mfa_temp ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_verification_attempts ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mfa_temp_user_id ON mfa_temp(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_temp_expires_at ON mfa_temp(expires_at);
CREATE INDEX IF NOT EXISTS idx_mfa_verification_attempts_user_id ON mfa_verification_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_verification_attempts_created_at ON mfa_verification_attempts(created_at);

-- RLS Policies for mfa_temp
CREATE POLICY "Users can view own MFA setup data"
  ON mfa_temp
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own MFA setup data"
  ON mfa_temp
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own MFA setup data"
  ON mfa_temp
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for mfa_verification_attempts
CREATE POLICY "Users can view own verification attempts"
  ON mfa_verification_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verification attempts"
  ON mfa_verification_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to clean up expired MFA setup data
CREATE OR REPLACE FUNCTION cleanup_expired_mfa_temp()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM mfa_temp
  WHERE expires_at < now();
END;
$$;

-- Function to initialize MFA for new user
CREATE OR REPLACE FUNCTION initialize_user_mfa(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create MFA settings if they don't exist
  INSERT INTO user_mfa (
    user_id,
    enabled,
    created_at,
    updated_at
  )
  VALUES (
    p_user_id,
    false,
    now(),
    now()
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Clean up any existing temporary setup data
  DELETE FROM mfa_temp
  WHERE user_id = p_user_id;
END;
$$;

-- Function to handle MFA verification attempts
CREATE OR REPLACE FUNCTION log_mfa_verification_attempt(
  p_user_id uuid,
  p_success boolean,
  p_device_info jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO mfa_verification_attempts (
    user_id,
    success,
    device_info,
    created_at
  )
  VALUES (
    p_user_id,
    p_success,
    p_device_info,
    now()
  );
END;
$$;