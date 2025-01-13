/*
  # Fix JSON validation for user sessions

  1. Changes
    - Add stricter JSON validation for device_info and location
    - Add default values with proper structure
    - Add check constraints for required fields
*/

-- Drop existing trigger temporarily
DROP TRIGGER IF EXISTS session_cleanup_trigger ON user_sessions;

-- Add stricter validation
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
  ),
  ADD CONSTRAINT valid_location CHECK (
    jsonb_typeof(location) = 'object'
    AND (
      (location ? 'city' AND (jsonb_typeof(location->'city') = 'string' OR location->'city' = 'null'))
      AND (location ? 'country' AND (jsonb_typeof(location->'country') = 'string' OR location->'country' = 'null'))
      AND (location ? 'timezone' AND (jsonb_typeof(location->'timezone') = 'string' OR location->'timezone' = 'null'))
    )
  );

-- Recreate the trigger
CREATE TRIGGER session_cleanup_trigger
  AFTER INSERT OR UPDATE
  ON user_sessions
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION handle_session_cleanup();