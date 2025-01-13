/*
  # Simplify storage policies

  1. Changes
    - Remove complex path parsing
    - Use simple bucket-level policies
    - Remove cleanup triggers
*/

-- Drop existing complex policies
DROP POLICY IF EXISTS "Public read access for profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can insert their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;

-- Create simple bucket-level policies
CREATE POLICY "Anyone can read profile photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-photos');

CREATE POLICY "Authenticated users can upload profile photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profile-photos');

CREATE POLICY "Authenticated users can update profile photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'profile-photos');

CREATE POLICY "Authenticated users can delete profile photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'profile-photos');