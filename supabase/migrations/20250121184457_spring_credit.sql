/*
  # Add missing RLS policies for user metadata

  1. Changes
    - Add policy to allow users to update their own metadata
    - Add policy to allow users to delete their own metadata

  2. Security
    - Ensures users can only modify their own metadata records
    - Maintains data isolation between users
*/

-- Add missing policy for users_metadata updates
CREATE POLICY "Users can update own metadata"
  ON users_metadata
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add missing policy for users_metadata deletes
CREATE POLICY "Users can delete own metadata"
  ON users_metadata
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure the handle_new_user function has proper permissions
ALTER FUNCTION handle_new_user() SECURITY DEFINER;

-- Grant necessary permissions to authenticated users
GRANT ALL ON users_metadata TO authenticated;