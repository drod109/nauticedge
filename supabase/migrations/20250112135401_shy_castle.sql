/*
  # API Service Tables

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `key_hash` (text)
      - `name` (text)
      - `scopes` (text[])
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)
      - `last_used_at` (timestamptz)
    
    - `api_usage`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `api_key_id` (uuid, references api_keys)
      - `endpoint` (text)
      - `method` (text)
      - `status_code` (integer)
      - `timestamp` (timestamptz)
      - `response_time` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- API Keys table
CREATE TABLE api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  key_hash text NOT NULL,
  name text NOT NULL,
  scopes text[] NOT NULL DEFAULT '{}',
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz,
  UNIQUE (user_id, name)
);

-- API Usage tracking
CREATE TABLE api_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  api_key_id uuid REFERENCES api_keys NOT NULL,
  endpoint text NOT NULL,
  method text NOT NULL,
  status_code integer NOT NULL,
  timestamp timestamptz DEFAULT now(),
  response_time integer NOT NULL
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Policies for api_keys
CREATE POLICY "Users can view their own API keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API keys"
  ON api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys"
  ON api_keys
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys"
  ON api_keys
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for api_usage
CREATE POLICY "Users can view their own API usage"
  ON api_usage
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert API usage"
  ON api_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX idx_api_usage_timestamp ON api_usage(timestamp);
CREATE INDEX idx_api_keys_last_used ON api_keys(last_used_at);