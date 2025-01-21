/*
  # MFA and Session Management Tables

  1. New Tables
    - `user_mfa` - Two-factor authentication settings
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `secret` (text)
      - `backup_codes` (text[])
      - `enabled` (boolean)
      - `verified_at` (timestamptz)
      - `last_used_at` (timestamptz)
      - Timestamps

    - `user_sessions` - Active user sessions
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `session_id` (text)
      - `user_agent` (text)
      - `device_info` (jsonb)
      - `location` (jsonb)
      - `is_active` (boolean)
      - Timestamps

  2. Security
    - RLS policies for secure access
    - Functions for session management
*/

-- Create user_mfa table
CREATE TABLE IF NOT EXISTS user_mfa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  secret text,
  backup_codes text[],
  enabled boolean DEFAULT false,
  verified_at timestamptz,
  last_used_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id text NOT NULL,
  user_agent text,
  device_info jsonb,
  location jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_active_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  UNIQUE(user_id, session_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_mfa_user_id ON user_mfa(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE user_mfa ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_mfa
CREATE POLICY "Users can view own MFA settings"
  ON user_mfa
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own MFA settings"
  ON user_mfa
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own MFA settings"
  ON user_mfa
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view own sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON user_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to create user session
CREATE OR REPLACE FUNCTION create_user_session(
  p_user_id uuid,
  p_session_id text,
  p_user_agent text,
  p_device_info jsonb,
  p_location jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_session_id uuid;
BEGIN
  -- End any existing session with the same session_id
  UPDATE user_sessions
  SET 
    is_active = false,
    ended_at = now()
  WHERE user_id = p_user_id 
    AND session_id = p_session_id 
    AND is_active = true;

  -- Create new session
  INSERT INTO user_sessions (
    user_id,
    session_id,
    user_agent,
    device_info,
    location
  )
  VALUES (
    p_user_id,
    p_session_id,
    p_user_agent,
    p_device_info,
    p_location
  )
  RETURNING id INTO v_session_id;

  RETURN v_session_id;
END;
$$;

-- Function to end user session
CREATE OR REPLACE FUNCTION end_user_session(
  p_user_id uuid,
  p_session_id text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_sessions
  SET 
    is_active = false,
    ended_at = now()
  WHERE user_id = p_user_id 
    AND session_id = p_session_id 
    AND is_active = true;
END;
$$;