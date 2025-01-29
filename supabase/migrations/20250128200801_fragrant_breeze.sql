/*
  # Fix API Key Creation Function - Part 1
  
  1. Enable pgcrypto extension
  2. Add missing indexes and constraints
*/

-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active) WHERE is_active = true;

-- Add missing constraints
ALTER TABLE api_keys
  ADD CONSTRAINT api_keys_name_length CHECK (length(trim(name)) > 0),
  ADD CONSTRAINT api_keys_key_hash_length CHECK (length(key_hash) = 64);