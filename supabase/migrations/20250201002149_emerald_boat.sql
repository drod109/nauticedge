/*
  # Create login attempts table

  1. New Tables
    - `login_attempts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `success` (boolean)
      - `device_info` (jsonb)
      - `location` (jsonb)
      - `created_at` (timestamptz)
      - `ip_address` (text)
      - `user_agent` (text)

  2. Security
    - Enable RLS on `login_attempts` table
    - Add policy for authenticated users to read their own login attempts
*/

-- Create login attempts table
CREATE TABLE IF NOT EXISTS login_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  success boolean NOT NULL DEFAULT false,
  device_info jsonb,
  location jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  ip_address text,
  user_agent text
);

-- Enable RLS
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own login attempts
CREATE POLICY "Users can read own login attempts"
  ON login_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index on user_id and created_at for faster queries
CREATE INDEX IF NOT EXISTS login_attempts_user_id_created_at_idx 
  ON login_attempts(user_id, created_at DESC);

-- Create function to clean up old login attempts
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS trigger AS $$
BEGIN
  -- Delete attempts beyond the maximum per user
  DELETE FROM login_attempts
  WHERE id IN (
    SELECT id
    FROM (
      SELECT id,
             ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
      FROM login_attempts
      WHERE user_id = NEW.user_id
    ) ranked
    WHERE ranked.rn > 50
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically clean up old attempts
CREATE TRIGGER cleanup_login_attempts_trigger
  AFTER INSERT ON login_attempts
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_old_login_attempts();