/*
  # Add Company Address Fields

  This migration adds address-related fields to the users_metadata table to store company address information.

  1. New Fields:
    - company_address_line1: Primary address line
    - company_address_line2: Secondary address line (optional)
    - company_city: City
    - company_state: State/Province/Region
    - company_postal_code: Postal/ZIP code
    - company_country: Country
*/

ALTER TABLE users_metadata
  ADD COLUMN IF NOT EXISTS company_address_line1 text,
  ADD COLUMN IF NOT EXISTS company_address_line2 text,
  ADD COLUMN IF NOT EXISTS company_city text,
  ADD COLUMN IF NOT EXISTS company_state text,
  ADD COLUMN IF NOT EXISTS company_postal_code text,
  ADD COLUMN IF NOT EXISTS company_country text;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_users_metadata_company_city 
ON users_metadata(company_city) 
WHERE company_city IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_metadata_company_country 
ON users_metadata(company_country) 
WHERE company_country IS NOT NULL;