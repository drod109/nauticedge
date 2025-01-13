/*
  # Fix user sessions table structure and policies

  1. Changes
    - Drop and recreate the user_sessions table with proper structure
    - Add comprehensive policies
    - Create optimized indexes
*/

-- Drop existing table and its dependencies
DROP TABLE IF EXISTS user_sessions CASCADE;

-- Create the user_sessions table with proper structure
CREATE TABLE user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  session_id text NOT NULL UNIQUE,
  ip_address text NOT NULL,
  user_agent text,
  device_info jsonb NOT NULL DEFAULT '{"type": "desktop", "browser": "unknown", "os": "unknown"}'::jsonb,
  location jsonb NOT NULL DEFAULT '{"city": null, "country": null, "timezone": null}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_active_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  CONSTRAINT valid_device_info CHECK (
    jsonb_typeof(device_info) = 'object'
    AND device_info ? 'type'
    AND device_info ? 'browser'
    AND device_info ? 'os'
  ),
  CONSTRAINT valid_location CHECK (
    jsonb_typeof(location) = 'object'
    AND location ? 'city'
    AND location ? 'country'
    AND location ? 'timezone'
  )
);

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies
CREATE POLICY "Users can manage their own sessions"
  ON user_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle session cleanup
CREATE OR REPLACE FUNCTION handle_session_cleanup()
RETURNS TRIGGER AS $$
BEGIN
  -- Deactivate existing sessions with case-insensitive comparison
  UPDATE user_sessions
  SET 
    is_active = false,
    ended_at = NOW(),
    last_active_at = NOW()
  WHERE 
    user_id = NEW.user_id
    AND id != NEW.id
    AND is_active = true
    AND ip_address = NEW.ip_address
    AND (
      LOWER(COALESCE(device_info->>'browser', '')) = LOWER(COALESCE(NEW.device_info->>'browser', ''))
      AND LOWER(COALESCE(device_info->>'os', '')) = LOWER(COALESCE(NEW.device_info->>'os', ''))
    );
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for session cleanup
CREATE TRIGGER session_cleanup_trigger
  AFTER INSERT OR UPDATE ON user_sessions
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION handle_session_cleanup();

-- Create optimized indexes
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_active_user ON user_sessions (user_id) WHERE is_active = true;
CREATE INDEX idx_user_sessions_browser ON user_sessions ((LOWER(device_info->>'browser')));
CREATE INDEX idx_user_sessions_os ON user_sessions ((LOWER(device_info->>'os')));