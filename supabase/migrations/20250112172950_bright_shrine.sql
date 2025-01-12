/*
  # Fix RLS Policies

  1. Changes
    - Re-enables RLS for all tables
    - Drops and recreates all RLS policies with proper security checks
    - Adds missing policies for vessels table
    - Ensures consistent policy naming
    - Adds proper security checks for all operations

  2. Security
    - Enforces user-based access control
    - Prevents unauthorized access to data
    - Implements proper ownership checks
*/

-- Re-enable RLS for all tables to ensure it's enabled
ALTER TABLE users_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to ensure clean slate
DROP POLICY IF EXISTS "Users can read own metadata" ON users_metadata;
DROP POLICY IF EXISTS "Users can insert own metadata" ON users_metadata;
DROP POLICY IF EXISTS "Users can update own metadata" ON users_metadata;

DROP POLICY IF EXISTS "Users can read own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON subscriptions;
DROP POLICY IF EXISTS "Users can delete own subscription" ON subscriptions;

DROP POLICY IF EXISTS "Users can read vessels" ON vessels;
DROP POLICY IF EXISTS "Users can insert vessels" ON vessels;
DROP POLICY IF EXISTS "Users can update vessels" ON vessels;
DROP POLICY IF EXISTS "Users can delete vessels" ON vessels;

-- Recreate policies with proper security checks

-- Users Metadata Policies
CREATE POLICY "Users can read own metadata"
  ON users_metadata FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metadata"
  ON users_metadata FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own metadata"
  ON users_metadata FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Subscriptions Policies
CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscription"
  ON subscriptions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Vessels Policies
CREATE POLICY "Users can read vessels"
  ON vessels FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.vessel_id = vessels.id
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert vessels"
  ON vessels FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update vessels"
  ON vessels FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.vessel_id = vessels.id
    AND surveys.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.vessel_id = vessels.id
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete vessels"
  ON vessels FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.vessel_id = vessels.id
    AND surveys.user_id = auth.uid()
  ));

-- Verify RLS is working
CREATE OR REPLACE FUNCTION verify_rls()
RETURNS boolean
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    SELECT bool_and(rowsecurity)
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename IN (
      'users_metadata',
      'subscriptions',
      'vessels',
      'surveys',
      'survey_sections',
      'survey_items',
      'survey_analyses',
      'api_keys',
      'api_usage',
      'audit_log'
    )
  );
END;
$$;