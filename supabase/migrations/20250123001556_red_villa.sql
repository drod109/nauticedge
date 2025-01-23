/*
  # Fix phone number validation

  1. Changes
    - Update phone number validation to be more flexible
    - Allow international phone numbers
    - Allow spaces, dashes, parentheses, and plus signs
    - Keep validation but make it more permissive

  2. Security
    - Maintains RLS policies
    - No data loss
*/

-- Drop existing phone check constraint
ALTER TABLE clients
  DROP CONSTRAINT IF EXISTS clients_phone_check;

-- Add new more permissive phone check constraint
ALTER TABLE clients
  ADD CONSTRAINT clients_phone_check 
  CHECK (
    phone IS NULL OR 
    phone ~ '^\+?[0-9][0-9\s\-\(\)\+]{0,}$'
  );

-- Update create_client function with new validation
CREATE OR REPLACE FUNCTION create_client(
  p_name text,
  p_email text,
  p_phone text DEFAULT NULL,
  p_address text DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_state text DEFAULT NULL,
  p_country text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_client_id uuid;
BEGIN
  -- Validate email format
  IF p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Validate phone format if provided
  IF p_phone IS NOT NULL AND p_phone !~ '^\+?[0-9][0-9\s\-\(\)\+]{0,}$' THEN
    RAISE EXCEPTION 'Invalid phone format. Please use only numbers, spaces, dashes, plus signs, and parentheses';
  END IF;

  -- Insert new client
  INSERT INTO clients (
    user_id,
    name,
    email,
    phone,
    address,
    city,
    state,
    country,
    created_at,
    updated_at
  )
  VALUES (
    auth.uid(),
    p_name,
    p_email,
    p_phone,
    p_address,
    p_city,
    p_state,
    p_country,
    now(),
    now()
  )
  RETURNING id INTO v_client_id;

  RETURN v_client_id;
END;
$$;