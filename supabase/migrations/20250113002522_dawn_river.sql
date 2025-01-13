/*
  # Fix session handling and case sensitivity

  1. Changes
    - Add case-insensitive handling for browser and OS comparisons
    - Add proper validation for device info and location fields
    - Add indexes for performance optimization
*/

-- First, create a temporary function to avoid conflicts
CREATE OR REPLACE FUNCTION temp_session_cleanup()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_sessions
  SET 
    is_active = false,
    ended_at = NOW(),
    last_active_at = NOW()
  WHERE 
    user_id = NEW.user_id
    AND id != NEW.id
    AND is_active = true
    AND LOWER(COALESCE(device_info->>'browser', 'unknown')) = LOWER(COALESCE(NEW.device_info->>'browser', 'unknown'))
    AND LOWER(COALESCE(device_info->>'os', 'unknown')) = LOWER(COALESCE(NEW.device_info->>'os', 'unknown'))
    AND ip_address = NEW.ip_address;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS session_cleanup_trigger ON user_sessions;

-- Update table constraints
ALTER TABLE user_sessions
  DROP CONSTRAINT IF EXISTS valid_device_info,
  DROP CONSTRAINT IF EXISTS valid_location;

ALTER TABLE user_sessions
  ALTER COLUMN device_info SET DEFAULT '{"type": "desktop", "browser": "unknown", "os": "unknown"}'::jsonb,
  ALTER COLUMN location SET DEFAULT '{"city": null, "country": null, "timezone": null}'::jsonb;

-- Add new constraints
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

-- Drop and recreate index
DROP INDEX IF EXISTS idx_user_sessions_device_lookup;
CREATE INDEX idx_user_sessions_device_lookup ON user_sessions (
  user_id,
  ip_address,
  is_active
);

-- Create the trigger using the temporary function
CREATE TRIGGER session_cleanup_trigger
  AFTER INSERT OR UPDATE ON user_sessions
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION temp_session_cleanup();