-- Add email column to users_metadata if it doesn't exist
ALTER TABLE users_metadata ADD COLUMN IF NOT EXISTS email text;

-- Create trigger to sync email from auth.users
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users_metadata
  SET email = NEW.email
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS sync_user_email_trigger ON auth.users;
CREATE TRIGGER sync_user_email_trigger
  AFTER INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_email();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_metadata_email ON users_metadata(email);
CREATE INDEX IF NOT EXISTS idx_users_metadata_phone ON users_metadata(phone);

-- Create view for user lookup
CREATE OR REPLACE VIEW user_contact_info AS
SELECT 
  u.email,
  um.phone,
  um.user_id
FROM auth.users u
JOIN users_metadata um ON u.id = um.user_id;

-- Grant access to the view
GRANT SELECT ON user_contact_info TO authenticated;