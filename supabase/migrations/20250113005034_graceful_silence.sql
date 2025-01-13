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

-- Create storage bucket for profile photos if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'profile-photos'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('profile-photos', 'profile-photos', true);
  END IF;
END $$;

-- Enable storage policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Profile photos are publicly accessible'
  ) THEN
    CREATE POLICY "Profile photos are publicly accessible"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'profile-photos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload their own profile photo'
  ) THEN
    CREATE POLICY "Users can upload their own profile photo"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'profile-photos' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;

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

-- Add photo_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users_metadata' AND column_name = 'photo_url'
  ) THEN
    ALTER TABLE users_metadata ADD COLUMN photo_url text;
  END IF;
END $$;

-- Create function to clean up old profile photos
CREATE OR REPLACE FUNCTION handle_profile_photo_cleanup()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete old photo from storage if it exists and is different from new photo
  IF OLD.photo_url IS NOT NULL AND OLD.photo_url != NEW.photo_url THEN
    DELETE FROM storage.objects
    WHERE bucket_id = 'profile-photos'
    AND name = REPLACE(OLD.photo_url, 'https://' || current_setting('app.settings.storage_url') || '/profile-photos/', '');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for photo cleanup if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'profile_photo_cleanup_trigger'
  ) THEN
    CREATE TRIGGER profile_photo_cleanup_trigger
      AFTER UPDATE OF photo_url ON users_metadata
      FOR EACH ROW
      WHEN (OLD.photo_url IS DISTINCT FROM NEW.photo_url)
      EXECUTE FUNCTION handle_profile_photo_cleanup();
  END IF;
END $$;

-- Add index for photo lookups if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'users_metadata' AND indexname = 'idx_users_metadata_photo_url'
  ) THEN
    CREATE INDEX idx_users_metadata_photo_url 
    ON users_metadata(photo_url)
    WHERE photo_url IS NOT NULL;
  END IF;
END $$;