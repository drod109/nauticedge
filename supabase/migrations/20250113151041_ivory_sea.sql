/*
  # Add Billing History Table

  1. New Tables
    - `billing_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `payment_method_id` (uuid, references payment_methods)
      - `amount` (numeric)
      - `description` (text)
      - `status` (text)
      - `invoice_number` (text)
      - `transaction_date` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `billing_history` table
    - Add policies for users to view their own billing history
*/

-- Create billing_history table
CREATE TABLE billing_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  payment_method_id uuid REFERENCES payment_methods,
  amount numeric(10,2) NOT NULL CHECK (amount >= 0),
  description text NOT NULL,
  status text NOT NULL CHECK (status IN ('paid', 'pending', 'failed', 'refunded')),
  invoice_number text NOT NULL UNIQUE,
  transaction_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_invoice_number CHECK (invoice_number ~ '^INV-\d{4}-\d{4}$')
);

-- Enable RLS
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own billing history"
  ON billing_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_billing_history_user_id ON billing_history(user_id);
CREATE INDEX idx_billing_history_transaction_date ON billing_history(transaction_date);
CREATE INDEX idx_billing_history_status ON billing_history(status);
CREATE INDEX idx_billing_history_invoice_number ON billing_history(invoice_number);