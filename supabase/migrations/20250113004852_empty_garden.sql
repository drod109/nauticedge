/*
  # Add profile photo support
  
  1. Changes
    - Add photo_url column to users_metadata table
    - Add index for photo_url lookups
    - Add validation constraint for photo_url format

  2. Notes
    - photo_url is nullable to support users without profile photos
    - Index improves lookup performance when querying by photo_url
    - URL format validation ensures only valid URLs are stored
*/

-- Add photo_url column with URL validation
ALTER TABLE users_metadata
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD CONSTRAINT valid_photo_url CHECK (
    photo_url IS NULL OR 
    photo_url ~ '^https?://[^\s/$.?#].[^\s]*$'
  );

-- Add index for photo lookups
CREATE INDEX IF NOT EXISTS idx_users_metadata_photo_url 
ON users_metadata(photo_url)
WHERE photo_url IS NOT NULL;

-- Add policy for photo URL updates
CREATE POLICY "Users can update their own photo"
  ON users_metadata
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);