/*
  # Simplify storage policies for profile photos

  1. Changes
    - Simplify storage policies to basic CRUD operations
    - Remove complex path parsing
    - Focus on user ownership validation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Profile photos are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photo" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photo" ON storage.objects;

-- Recreate bucket with simpler configuration
DO $$ 
BEGIN
  DELETE FROM storage.buckets WHERE id = 'profile-photos';
  
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('profile-photos', 'profile-photos', true);
END $$;

-- Create simplified policies
CREATE POLICY "Anyone can view profile photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can manage their own profile photos"
  ON storage.objects FOR ALL 
  TO authenticated
  USING (
    bucket_id = 'profile-photos' 
    AND auth.uid()::text = (regexp_split_to_array(name, '/'))[1]
  );