/*
  # User Metadata and Billing Tables

  1. New Tables
    - `users_metadata` - Extended user profile information
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text)
      - `photo_url` (text)
      - `phone` (text)
      - `location` (text)
      - Company information fields
      - Timestamps

    - `payment_methods` - Stored payment methods
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `card_last4` (text)
      - `card_brand` (text)
      - `exp_month` (text)
      - `exp_year` (text)
      - `is_default` (boolean)
      - Timestamps

    - `billing_history` - Transaction history
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `transaction_date` (timestamptz)
      - `amount` (numeric)
      - `description` (text)
      - `status` (text)
      - `invoice_number` (text)

  2. Security
    - RLS policies for secure access
    - Indexes for performance
*/

-- Create users_metadata table
CREATE TABLE IF NOT EXISTS users_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name text,
  photo_url text,
  phone text,
  location text,
  company_name text,
  company_position text,
  registration_number text,
  tax_id text,
  company_address_line1 text,
  company_address_line2 text,
  company_city text,
  company_state text,
  company_postal_code text,
  company_country text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_last4 text NOT NULL,
  card_brand text NOT NULL,
  exp_month text NOT NULL,
  exp_year text NOT NULL,
  cardholder_name text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create billing_history table
CREATE TABLE IF NOT EXISTS billing_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transaction_date timestamptz DEFAULT now(),
  amount numeric(10,2) NOT NULL,
  description text NOT NULL,
  status text NOT NULL,
  invoice_number text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_metadata_user_id ON users_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_user_id ON billing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_date ON billing_history(transaction_date DESC);

-- Enable RLS
ALTER TABLE users_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users_metadata
CREATE POLICY "Users can view own metadata"
  ON users_metadata
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own metadata"
  ON users_metadata
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metadata"
  ON users_metadata
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for payment_methods
CREATE POLICY "Users can view own payment methods"
  ON payment_methods
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment methods"
  ON payment_methods
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods"
  ON payment_methods
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods"
  ON payment_methods
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for billing_history
CREATE POLICY "Users can view own billing history"
  ON billing_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to handle user metadata after signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO users_metadata (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

-- Trigger to create user metadata after signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();