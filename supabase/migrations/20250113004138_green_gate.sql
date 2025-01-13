/*
  # Add company information fields to users_metadata

  1. Changes
    - Add company_name column
    - Add company_position column
    - Add registration_number column
    - Add tax_id column
    - Add indexes for improved query performance

  2. Security
    - No changes to RLS policies needed as they are already set up for the table
*/

-- Add new columns for company information
ALTER TABLE users_metadata
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS company_position text,
  ADD COLUMN IF NOT EXISTS registration_number text,
  ADD COLUMN IF NOT EXISTS tax_id text;

-- Add indexes for improved query performance
CREATE INDEX IF NOT EXISTS idx_users_metadata_company_name ON users_metadata(company_name);
CREATE INDEX IF NOT EXISTS idx_users_metadata_registration_number ON users_metadata(registration_number);