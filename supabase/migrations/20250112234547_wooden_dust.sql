/*
  # Fix users_metadata RLS policies

  1. Changes
    - Drop existing RLS policies for users_metadata
    - Create new comprehensive RLS policies for users_metadata
    - Add missing indexes

  2. Security
    - Enable RLS
    - Add policies for insert/update/select operations
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own metadata" ON users_metadata;
DROP POLICY IF EXISTS "Users can update their own metadata" ON users_metadata;
DROP POLICY IF EXISTS "Users can insert their own metadata" ON users_metadata;

-- Ensure RLS is enabled
ALTER TABLE users_metadata ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Users can manage their own metadata"
  ON users_metadata
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_users_metadata_user_id ON users_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_users_metadata_updated_at ON users_metadata(updated_at);