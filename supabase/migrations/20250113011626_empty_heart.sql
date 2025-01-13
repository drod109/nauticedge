/*
  # Fix storage policies with simplified approach

  1. Changes
    - Recreate bucket with minimal configuration
    - Create simple, direct policies
    - Remove complex path parsing
    - Focus on basic user ownership validation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can manage their own profile photos" ON storage.objects;

-- Recreate bucket with minimal configuration
DO $$ 
BEGIN
  DELETE FROM storage.buckets WHERE id = 'profile-photos';
  
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('profile-photos', 'profile-photos', true);
END $$;

-- Create basic policies
CREATE POLICY "Public read access for profile photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can insert their own profile photos"
  ON storage.objects FOR INSERT 
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (SPLIT_PART(name, '/', 1))
  );

CREATE POLICY "Users can update their own profile photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (SPLIT_PART(name, '/', 1))
  );

CREATE POLICY "Users can delete their own profile photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    auth.uid()::text = (SPLIT_PART(name, '/', 1))
  );