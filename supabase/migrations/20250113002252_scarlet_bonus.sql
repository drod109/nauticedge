/*
  # Fix case sensitivity in session handling

  1. Changes
    - Update session cleanup function to handle case-insensitive comparisons
    - Add LOWER() function to device info comparisons
    - Add more robust JSON validation
    - Add NOT NULL constraints to device info fields
*/

-- Drop existing trigger temporarily
DROP TRIGGER IF EXISTS session_cleanup_trigger ON user_sessions;

-- Update the cleanup function to handle case-insensitive comparisons
CREATE OR REPLACE FUNCTION handle_session_cleanup()
RETURNS TRIGGER AS $$
BEGIN
  -- Deactivate any existing active sessions for the same user/device combination
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

-- Add stricter validation with case-insensitive indexes
ALTER TABLE user_sessions
  DROP CONSTRAINT IF EXISTS valid_device_info,
  DROP CONSTRAINT IF EXISTS valid_location,
  ALTER COLUMN device_info SET DEFAULT '{"type": "desktop", "browser": "unknown", "os": "unknown"}'::jsonb,
  ALTER COLUMN location SET DEFAULT '{"city": null, "country": null, "timezone": null}'::jsonb,
  ADD CONSTRAINT valid_device_info CHECK (
    jsonb_typeof(device_info) = 'object'
    AND device_info ? 'type'
    AND device_info ? 'browser'
    AND device_info ? 'os'
    AND jsonb_typeof(device_info->'type') = 'string'
    AND jsonb_typeof(device_info->'browser') = 'string'
    AND jsonb_typeof(device_info->'os') = 'string'
    AND COALESCE(device_info->>'type', '') != ''
    AND COALESCE(device_info->>'browser', '') != ''
    AND COALESCE(device_info->>'os', '') != ''
  ),
  ADD CONSTRAINT valid_location CHECK (
    jsonb_typeof(location) = 'object'
    AND (
      (location ? 'city' AND (jsonb_typeof(location->'city') = 'string' OR location->'city' = 'null'))
      AND (location ? 'country' AND (jsonb_typeof(location->'country') = 'string' OR location->'country' = 'null'))
      AND (location ? 'timezone' AND (jsonb_typeof(location->'timezone') = 'string' OR location->'timezone' = 'null'))
    )
  );

-- Create case-insensitive indexes for device info lookups
DROP INDEX IF EXISTS idx_user_sessions_device_lookup;
CREATE INDEX idx_user_sessions_device_lookup ON user_sessions USING btree (
  user_id,
  ip_address,
  LOWER(COALESCE(device_info->>'browser', 'unknown')),
  LOWER(COALESCE(device_info->>'os', 'unknown')),
  is_active
);

-- Recreate the trigger
CREATE TRIGGER session_cleanup_trigger
  AFTER INSERT OR UPDATE
  ON user_sessions
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION handle_session_cleanup();