/*
  # Create Secure Keys Table

  1. New Tables
    - `secure_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `key_name` (text)
      - `encrypted_value` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `secure_keys` table
    - Add policies for authenticated users to manage their own keys
*/

-- Create secure_keys table
CREATE TABLE IF NOT EXISTS secure_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  key_name text NOT NULL,
  encrypted_value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, key_name)
);

-- Enable RLS
ALTER TABLE secure_keys ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own secure keys"
  ON secure_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own secure keys"
  ON secure_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own secure keys"
  ON secure_keys
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own secure keys"
  ON secure_keys
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_secure_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER secure_keys_updated_at
  BEFORE UPDATE ON secure_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_secure_keys_updated_at();