/*
  # Create Users Metadata Table

  1. New Tables
    - `users_metadata`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text)
      - `phone` (text)
      - `company_name` (text)
      - `company_position` (text)
      - `location` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `users_metadata` table
    - Add policies for users to manage their own metadata
*/

-- Users Metadata
CREATE TABLE users_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  full_name text,
  phone text,
  company_name text,
  company_position text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE users_metadata ENABLE ROW LEVEL SECURITY;

-- Users Metadata Policies
CREATE POLICY "Users can view their own metadata"
  ON users_metadata FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own metadata"
  ON users_metadata FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metadata"
  ON users_metadata FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_users_metadata_user_id ON users_metadata(user_id);