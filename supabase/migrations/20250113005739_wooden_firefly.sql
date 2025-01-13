/*
  # Add Profile Photos Storage

  1. New Storage Bucket
    - Creates a public bucket for profile photos
    - Sets up appropriate access policies
  
  2. Security
    - Enables RLS policies for storage access
    - Users can only manage their own photos
    - Public read access for all profile photos
  
  3. Cleanup
    - Adds trigger to clean up old photos when updated
*/

-- Create storage bucket for profile photos if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'profile-photos'
  ) THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'profile-photos',
      'profile-photos',
      true,
      5242880, -- 5MB limit
      ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    );
  END IF;
END $$;

-- Enable storage policies
DO $$ 
BEGIN
  -- Public read access for profile photos
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Profile photos are publicly accessible'
  ) THEN
    CREATE POLICY "Profile photos are publicly accessible"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'profile-photos');
  END IF;

  -- Users can upload their own photos
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload their own profile photo'
  ) THEN
    CREATE POLICY "Users can upload their own profile photo"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'profile-photos' AND
        (storage.foldername(name))[1] = auth.uid()::text AND
        (CASE WHEN metadata->>'content-type' IS NOT NULL 
              THEN metadata->>'content-type' = ANY(ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
              ELSE true
         END)
      );
  END IF;

  -- Users can update their own photos
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own profile photo'
  ) THEN
    CREATE POLICY "Users can update their own profile photo"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'profile-photos' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;

  -- Users can delete their own photos
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own profile photo'
  ) THEN
    CREATE POLICY "Users can delete their own profile photo"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'profile-photos' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;
END $$;

-- Create function to handle photo cleanup
CREATE OR REPLACE FUNCTION handle_profile_photo_cleanup()
RETURNS TRIGGER AS $$
DECLARE
  old_path text;
BEGIN
  -- Extract the path from the old photo URL
  IF OLD.photo_url IS NOT NULL AND OLD.photo_url != NEW.photo_url THEN
    old_path := REPLACE(OLD.photo_url, 'https://' || current_setting('app.settings.storage_url', true) || '/profile-photos/', '');
    
    -- Delete old photo from storage
    DELETE FROM storage.objects
    WHERE bucket_id = 'profile-photos'
    AND name = old_path;
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