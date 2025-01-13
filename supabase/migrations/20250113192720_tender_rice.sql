-- Create function to handle session creation
CREATE OR REPLACE FUNCTION create_user_session(
  p_user_id uuid,
  p_session_id text,
  p_user_agent text,
  p_device_info jsonb,
  p_location jsonb
) RETURNS void AS $$
BEGIN
  -- First try to update existing session
  UPDATE user_sessions
  SET 
    is_active = true,
    last_active_at = NOW(),
    ended_at = NULL,
    user_agent = p_user_agent,
    device_info = p_device_info,
    location = p_location
  WHERE session_id = p_session_id;

  -- If no session was updated, create a new one
  IF NOT FOUND THEN
    INSERT INTO user_sessions (
      user_id,
      session_id,
      ip_address,
      user_agent,
      device_info,
      location,
      is_active
    ) VALUES (
      p_user_id,
      p_session_id,
      '0.0.0.0',
      p_user_agent,
      p_device_info,
      p_location,
      true
    );
  END IF;
END;
$$ LANGUAGE plpgsql;