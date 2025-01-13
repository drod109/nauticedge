/*
  # Enhanced Session Tracking

  1. New Tables
    - `user_sessions`
      - Stores detailed information about user login sessions
      - Tracks IP addresses, device info, and location data
      - Maintains session history with timestamps

  2. Security
    - Enables RLS on the new table
    - Adds policies for users to view their own sessions
*/

-- Create the user_sessions table
CREATE TABLE user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  session_id text NOT NULL,
  ip_address text,
  user_agent text,
  device_info jsonb,
  location jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_active_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON user_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_is_active ON user_sessions(is_active);
CREATE INDEX idx_user_sessions_created_at ON user_sessions(created_at);