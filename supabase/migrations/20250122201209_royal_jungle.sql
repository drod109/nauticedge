-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invoice_number text NOT NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  amount numeric(10,2) NOT NULL,
  issue_date date NOT NULL,
  due_date date NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  notes text,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT invoices_status_check 
    CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  CONSTRAINT invoices_email_check 
    CHECK (client_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT invoices_dates_check 
    CHECK (due_date >= issue_date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_dates ON invoices(issue_date, due_date);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own invoices"
  ON invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices"
  ON invoices
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices"
  ON invoices
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to create invoice
CREATE OR REPLACE FUNCTION create_invoice(
  p_client_name text,
  p_client_email text,
  p_amount numeric,
  p_issue_date date,
  p_due_date date,
  p_items jsonb DEFAULT '[]',
  p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_invoice_id uuid;
  v_invoice_number text;
BEGIN
  -- Generate invoice number
  SELECT 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
         LPAD(COALESCE(
           (SELECT COUNT(*) + 1 
            FROM invoices 
            WHERE user_id = auth.uid() AND 
                  created_at >= DATE_TRUNC('day', NOW())),
           1)::text, 
         3, '0')
  INTO v_invoice_number;

  -- Insert invoice
  INSERT INTO invoices (
    user_id,
    invoice_number,
    client_name,
    client_email,
    amount,
    issue_date,
    due_date,
    items,
    notes,
    status,
    created_at,
    updated_at
  )
  VALUES (
    auth.uid(),
    v_invoice_number,
    p_client_name,
    p_client_email,
    p_amount,
    p_issue_date,
    p_due_date,
    p_items,
    p_notes,
    'draft',
    now(),
    now()
  )
  RETURNING id INTO v_invoice_id;

  RETURN v_invoice_id;
END;
$$;