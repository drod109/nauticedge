/*
  # Add Sample Billing History Data

  This migration adds sample billing history data for December 2024 to demonstrate the billing history functionality.
  The data includes various transaction types and statuses to showcase different scenarios.
*/

-- Function to get the default payment method for a user
CREATE OR REPLACE FUNCTION get_default_payment_method(user_uuid uuid)
RETURNS uuid AS $$
  SELECT id FROM payment_methods 
  WHERE user_id = user_uuid AND is_default = true
  LIMIT 1;
$$ LANGUAGE SQL;

-- Insert sample billing history data
WITH sample_user AS (
  SELECT id FROM auth.users LIMIT 1
)
INSERT INTO billing_history (
  user_id,
  payment_method_id,
  amount,
  description,
  status,
  invoice_number,
  transaction_date
)
SELECT
  id as user_id,
  get_default_payment_method(id) as payment_method_id,
  amount,
  description,
  status,
  invoice_number,
  transaction_date
FROM sample_user,
  (VALUES
    (99.00, 'Professional Plan - December 2024', 'paid', 'INV-2024-0001', '2024-12-01T10:00:00Z'),
    (250.00, 'Additional Survey Credits', 'paid', 'INV-2024-0002', '2024-12-05T14:30:00Z'),
    (150.00, 'Custom Report Templates', 'pending', 'INV-2024-0003', '2024-12-10T09:15:00Z'),
    (75.00, 'API Access - December 2024', 'paid', 'INV-2024-0004', '2024-12-15T11:45:00Z'),
    (199.00, 'Premium Support - Q4 2024', 'failed', 'INV-2024-0005', '2024-12-20T16:20:00Z'),
    (99.00, 'Professional Plan - January 2025', 'pending', 'INV-2024-0006', '2024-12-28T08:00:00Z')
  ) AS sample_data (amount, description, status, invoice_number, transaction_date);