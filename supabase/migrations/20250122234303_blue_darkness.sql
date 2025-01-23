/*
  # Create clients table and related functions

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `country` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `clients` table
    - Add policies for CRUD operations
    - Add validation constraints

  3. Functions
    - Create function for client statistics
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  city text,
  state text,
  country text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Add constraints
  CONSTRAINT clients_email_check CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT clients_phone_check CHECK (phone IS NULL OR phone ~ '^\+?[0-9][0-9 -]*$')
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_city ON clients(city);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients"
  ON clients
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to get client statistics
CREATE OR REPLACE FUNCTION get_client_statistics(client_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_surveys', COALESCE((SELECT COUNT(*) FROM surveys WHERE client_id = $1), 0),
    'total_invoices', COALESCE((SELECT COUNT(*) FROM invoices WHERE client_id = $1), 0),
    'total_amount', COALESCE((SELECT SUM(amount) FROM invoices WHERE client_id = $1), 0)
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Function to create a new client
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
  IF p_phone IS NOT NULL AND p_phone !~ '^\+?[0-9][0-9 -]*$' THEN
    RAISE EXCEPTION 'Invalid phone format';
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