/*
  # Add client address fields to invoices table
  
  1. New Columns
    - client_address
    - client_address_line1
    - client_address_line2
    - client_city
    - client_state
    - client_postal_code
    - client_country
*/

-- Add new address fields to invoices table
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS client_address text,
  ADD COLUMN IF NOT EXISTS client_address_line1 text,
  ADD COLUMN IF NOT EXISTS client_address_line2 text,
  ADD COLUMN IF NOT EXISTS client_city text,
  ADD COLUMN IF NOT EXISTS client_state text,
  ADD COLUMN IF NOT EXISTS client_postal_code text,
  ADD COLUMN IF NOT EXISTS client_country text;