/*
  # Fix Database Test Functions

  1. Changes
    - Drop and recreate test functions with proper security
    - Add proper error handling
    - Fix parameter handling
    - Add proper return types
*/

-- Drop existing functions
DROP FUNCTION IF EXISTS test_database();
DROP FUNCTION IF EXISTS test_table_permissions(text);

-- Function to test database connection and RLS
CREATE OR REPLACE FUNCTION test_database()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Test connection
  result = result || jsonb_build_object('connection', true);

  -- Test RLS on subscriptions
  BEGIN
    -- Try to select from subscriptions table
    PERFORM * FROM subscriptions LIMIT 1;
    
    -- If we get here, RLS might be disabled
    result = result || jsonb_build_object('rls_enabled', false);
  EXCEPTION
    WHEN insufficient_privilege THEN
      -- This is good - RLS is working
      result = result || jsonb_build_object('rls_enabled', true);
  END;

  RETURN result;
END;
$$;

-- Function to test table permissions
CREATE OR REPLACE FUNCTION test_table_permissions(table_name text)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Validate input
  IF table_name IS NULL OR table_name = '' THEN
    RAISE EXCEPTION 'Table name is required';
  END IF;

  -- Test if table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = table_name
  ) THEN
    RETURN jsonb_build_object('exists', false);
  END IF;

  -- Test RLS
  result = result || jsonb_build_object(
    'exists', true,
    'has_rls', EXISTS (
      SELECT 1 FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename = table_name
      AND rowsecurity = true
    )
  );

  -- Test policies
  result = result || jsonb_build_object(
    'policies', (
      SELECT jsonb_agg(jsonb_build_object(
        'name', polname,
        'command', cmd,
        'roles', roles
      ))
      FROM pg_policies
      WHERE schemaname = 'public'
      AND tablename = table_name
    )
  );

  RETURN result;
END;
$$;

-- Revoke all existing permissions
REVOKE ALL ON FUNCTION test_database() FROM PUBLIC;
REVOKE ALL ON FUNCTION test_table_permissions(text) FROM PUBLIC;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION test_database() TO authenticated;
GRANT EXECUTE ON FUNCTION test_table_permissions(text) TO authenticated;