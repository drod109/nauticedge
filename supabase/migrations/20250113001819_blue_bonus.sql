/*
  # Fix session management

  1. Changes
    - Add unique constraint on user_id + device combination
    - Add trigger to automatically end conflicting sessions
    - Add function to handle session cleanup
*/

-- Create function to handle session cleanup
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
    AND device_info->>'browser' = NEW.device_info->>'browser'
    AND device_info->>'os' = NEW.device_info->>'os'
    AND ip_address = NEW.ip_address;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for session cleanup
DROP TRIGGER IF EXISTS session_cleanup_trigger ON user_sessions;
CREATE TRIGGER session_cleanup_trigger
  AFTER INSERT OR UPDATE
  ON user_sessions
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION handle_session_cleanup();

-- Add composite index for device info lookup
CREATE INDEX IF NOT EXISTS idx_user_sessions_device_lookup 
ON user_sessions USING btree (
  user_id,
  ip_address,
  ((device_info->>'browser')),
  ((device_info->>'os')),
  is_active
);