-- Add function to safely cleanup MFA temp data
CREATE OR REPLACE FUNCTION cleanup_mfa_temp(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete any existing temporary setup data
  DELETE FROM mfa_temp
  WHERE user_id = p_user_id;
  
  -- Delete any expired temporary data
  DELETE FROM mfa_temp
  WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$;

-- Add index for expired records cleanup
CREATE INDEX IF NOT EXISTS idx_mfa_temp_expires_at 
ON mfa_temp(expires_at);

-- Add trigger to automatically clean up expired records
CREATE OR REPLACE FUNCTION cleanup_expired_mfa_temp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM mfa_temp
  WHERE expires_at < CURRENT_TIMESTAMP;
  RETURN NULL;
END;
$$;

-- Create trigger to run cleanup periodically
DROP TRIGGER IF EXISTS trigger_cleanup_expired_mfa_temp ON mfa_temp;
CREATE TRIGGER trigger_cleanup_expired_mfa_temp
  AFTER INSERT OR UPDATE ON mfa_temp
  FOR EACH STATEMENT
  EXECUTE FUNCTION cleanup_expired_mfa_temp();