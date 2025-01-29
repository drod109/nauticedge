/*
  # Add Storage Bucket for Profile Photos

  1. Changes
    - Create storage bucket for profile photos
    - Add storage policies for authenticated users

  2. Purpose
    - Enable profile photo uploads
    - Secure access to uploaded files
*/

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload profile photos
CREATE POLICY "Users can upload own profile photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own profile photos
CREATE POLICY "Users can update own profile photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own profile photos
CREATE POLICY "Users can delete own profile photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public access to profile photos
CREATE POLICY "Public read access to profile photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-photos');