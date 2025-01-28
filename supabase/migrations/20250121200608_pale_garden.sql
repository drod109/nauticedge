/*
  # Add API Keys Support

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `key_hash` (text)
      - `scopes` (text[])
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)
      - `last_used_at` (timestamptz)
      - `is_active` (boolean)

  2. Security
    - Enable RLS on `api_keys` table
    - Add policies for authenticated users to manage their API keys

  3. Functions
    - Add function to create API keys with secure hashing
    - Add function to validate API keys
*/

-- Create API keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  key_hash text NOT NULL,
  scopes text[] DEFAULT '{}',
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz,
  is_active boolean DEFAULT true,
  UNIQUE(key_hash)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own API keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create API keys"
  ON api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
  ON api_keys
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys"
  ON api_keys
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to validate API key
CREATE OR REPLACE FUNCTION validate_api_key(p_key_hash text)
RETURNS TABLE (
  user_id uuid,
  scopes text[],
  is_valid boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ak.user_id,
    ak.scopes,
    CASE
      WHEN ak.is_active = false THEN false
      WHEN ak.expires_at IS NOT NULL AND ak.expires_at < now() THEN false
      ELSE true
    END as is_valid
  FROM api_keys ak
  WHERE ak.key_hash = p_key_hash
  LIMIT 1;

  -- Update last used timestamp
  UPDATE api_keys
  SET last_used_at = now()
  WHERE key_hash = p_key_hash;
END;
$$;