/*
  # Add profile photo storage support
  
  1. Changes
    - Create storage bucket for profile photos
    - Add storage policies for profile photos
    - Add trigger to clean up old photos

  2. Security
    - Only authenticated users can upload their own photos
    - Public read access for profile photos
    - Automatic cleanup of old photos when updated
*/

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true);

-- Enable storage policies
CREATE POLICY "Profile photos are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload their own profile photo"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own profile photo"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own profile photo"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create function to clean up old profile photos
CREATE OR REPLACE FUNCTION handle_profile_photo_cleanup()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete old photo from storage if it exists
  IF OLD.photo_url IS NOT NULL AND OLD.photo_url != NEW.photo_url THEN
    DELETE FROM storage.objects
    WHERE bucket_id = 'profile-photos'
    AND name = REPLACE(OLD.photo_url, 'https://' || current_setting('app.settings.storage_url') || '/profile-photos/', '');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for photo cleanup
DROP TRIGGER IF EXISTS profile_photo_cleanup_trigger ON users_metadata;
CREATE TRIGGER profile_photo_cleanup_trigger
  AFTER UPDATE OF photo_url ON users_metadata
  FOR EACH ROW
  WHEN (OLD.photo_url IS DISTINCT FROM NEW.photo_url)
  EXECUTE FUNCTION handle_profile_photo_cleanup();