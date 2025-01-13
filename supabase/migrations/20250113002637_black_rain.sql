/*
  # Fix session handling and validation

  1. Changes
    - Simplify JSON validation to prevent type errors
    - Add proper defaults for device info
    - Fix case sensitivity issues
    - Add proper indexes
*/

-- First create a temporary function to avoid conflicts
CREATE OR REPLACE FUNCTION temp_session_cleanup()
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

-- Drop existing trigger
DROP TRIGGER IF EXISTS session_cleanup_trigger ON user_sessions;

-- Update constraints and defaults
ALTER TABLE user_sessions
  DROP CONSTRAINT IF EXISTS valid_device_info,
  DROP CONSTRAINT IF EXISTS valid_location;

-- Set proper defaults
ALTER TABLE user_sessions
  ALTER COLUMN device_info SET DEFAULT '{"type": "desktop", "browser": "unknown", "os": "unknown"}'::jsonb,
  ALTER COLUMN location SET DEFAULT '{"city": null, "country": null, "timezone": null}'::jsonb;

-- Add simplified constraints
ALTER TABLE user_sessions
  ADD CONSTRAINT valid_device_info CHECK (
    jsonb_typeof(device_info) = 'object'
    AND device_info ? 'type'
    AND device_info ? 'browser'
    AND device_info ? 'os'
  );

ALTER TABLE user_sessions
  ADD CONSTRAINT valid_location CHECK (
    jsonb_typeof(location) = 'object'
    AND location ? 'city'
    AND location ? 'country'
    AND location ? 'timezone'
  );

-- Create optimized indexes
DROP INDEX IF EXISTS idx_user_sessions_device_lookup;
CREATE INDEX idx_user_sessions_device_lookup ON user_sessions (
  user_id,
  ip_address,
  is_active
);

CREATE INDEX idx_user_sessions_browser ON user_sessions ((LOWER(device_info->>'browser')));
CREATE INDEX idx_user_sessions_os ON user_sessions ((LOWER(device_info->>'os')));

-- Recreate trigger with new function
CREATE TRIGGER session_cleanup_trigger
  AFTER INSERT OR UPDATE ON user_sessions
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION temp_session_cleanup();