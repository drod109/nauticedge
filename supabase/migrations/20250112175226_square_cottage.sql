/*
  # Email Configuration Migration

  1. New Functions
    - `handle_new_user`: Trigger function to handle new user registration
    - `handle_email_confirm`: Function to process email confirmation

  2. Security
    - Functions are SECURITY DEFINER to ensure proper access
    - Proper search_path set to prevent search path attacks
    
  3. Triggers
    - Trigger on auth.users to handle new registrations
*/

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create initial metadata entry
  INSERT INTO public.users_metadata (
    user_id,
    full_name,
    company_name,
    company_position
  ) VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'company_name',
    NEW.raw_user_meta_data->>'company_position'
  );

  -- Create initial subscription
  INSERT INTO public.subscriptions (
    user_id,
    plan,
    status,
    current_period_start,
    current_period_end
  ) VALUES (
    NEW.id,
    'basic',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + interval '30 days'
  );

  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();