/*
  # Add client phone to invoices table

  1. Changes
    - Add client_phone column to invoices table
    - Make column nullable since not all clients may have phone numbers
    - Add comment for documentation

  2. Security
    - No changes to RLS policies needed
    - Existing row-level security remains in place
*/

-- Add client_phone column to invoices table
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS client_phone TEXT;

-- Add helpful comment
COMMENT ON COLUMN invoices.client_phone IS 'Client phone number in E.164 format';