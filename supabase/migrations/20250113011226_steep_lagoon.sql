/*
  # Fix storage policies for profile photos

  1. Changes
    - Drop and recreate storage bucket with proper configuration
    - Add proper MIME type validation
    - Fix policy conditions for file uploads
    - Add proper path validation
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Profile photos are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photo" ON storage.objects;

-- Drop and recreate the bucket to ensure clean configuration
DO $$ 
BEGIN
  DELETE FROM storage.buckets WHERE id = 'profile-photos';
  
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'profile-photos',
    'profile-photos',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  );
END $$;

-- Create comprehensive storage policies
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
    auth.uid()::text = SPLIT_PART(name, '/', 1) AND
    (CASE 
      WHEN metadata->>'content-type' IS NOT NULL THEN
        metadata->>'content-type' = ANY(ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
      ELSE false
    END)
  );

CREATE POLICY "Users can update their own profile photo"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = SPLIT_PART(name, '/', 1)
  );

CREATE POLICY "Users can delete their own profile photo"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = SPLIT_PART(name, '/', 1)
  );

-- Create function to handle photo cleanup
CREATE OR REPLACE FUNCTION handle_profile_photo_cleanup()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete old photo from storage if it exists
  IF OLD.photo_url IS NOT NULL AND OLD.photo_url != NEW.photo_url THEN
    DELETE FROM storage.objects
    WHERE bucket_id = 'profile-photos'
    AND auth.uid()::text = SPLIT_PART(name, '/', 1);
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