/*
  # Comprehensive Test Runner

  1. Changes
    - Adds a unified test runner function that combines all tests
    - Adds helper functions for specific test categories
    - Improves test result reporting

  2. Security
    - All functions are security definer
    - Proper search path restrictions
    - Authentication checks
*/

-- Function to test database connection
CREATE OR REPLACE FUNCTION test_connection()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT jsonb_build_object(
    'connection', true,
    'version', version(),
    'current_user', current_user,
    'current_database', current_database()
  ) INTO result;

  RETURN result;
END;
$$;

-- Function to test RLS configuration
CREATE OR REPLACE FUNCTION test_rls_configuration()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Run RLS tests
  SELECT jsonb_build_object(
    'rls_enabled', verify_rls_status(),
    'rls_effectiveness', test_rls_effectiveness(),
    'rls_comprehensive', run_comprehensive_rls_tests()
  ) INTO result;

  RETURN result;
END;
$$;

-- Function to test database functions
CREATE OR REPLACE FUNCTION test_database_functions()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
  func record;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Test each function
  FOR func IN
    SELECT proname, proargtypes::regtype[] as argtypes
    FROM pg_proc
    WHERE pronamespace = 'public'::regnamespace
    AND proname NOT LIKE 'test_%'
  LOOP
    BEGIN
      -- Try to execute function with NULL parameters
      EXECUTE format(
        'SELECT %I(%s)',
        func.proname,
        array_to_string(array_fill('NULL'::text, array[array_length(func.argtypes, 1)]), ',')
      );
      result = result || jsonb_build_object(
        func.proname,
        jsonb_build_object('exists', true, 'executable', true)
      );
    EXCEPTION
      WHEN insufficient_privilege THEN
        result = result || jsonb_build_object(
          func.proname,
          jsonb_build_object('exists', true, 'executable', false, 'reason', 'insufficient_privilege')
        );
      WHEN OTHERS THEN
        -- Function exists but might need specific parameters
        result = result || jsonb_build_object(
          func.proname,
          jsonb_build_object('exists', true, 'executable', false, 'reason', SQLERRM)
        );
    END;
  END LOOP;

  RETURN result;
END;
$$;

-- Function to test triggers
CREATE OR REPLACE FUNCTION test_triggers()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
  tbl record;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Test triggers on each table
  FOR tbl IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    result = result || jsonb_build_object(
      tbl.tablename,
      (
        SELECT jsonb_agg(jsonb_build_object(
          'trigger_name', tgname,
          'trigger_type', tgtype,
          'trigger_enabled', tgenabled = 'O'
        ))
        FROM pg_trigger
        WHERE tgrelid = (tbl.tablename::regclass)
      )
    );
  END LOOP;

  RETURN result;
END;
$$;

-- Main test runner function
CREATE OR REPLACE FUNCTION run_all_tests()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  start_time timestamptz;
  end_time timestamptz;
  result jsonb;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  start_time := clock_timestamp();

  -- Run all tests
  SELECT jsonb_build_object(
    'connection', test_connection(),
    'rls', test_rls_configuration(),
    'functions', test_database_functions(),
    'triggers', test_triggers(),
    'metadata', jsonb_build_object(
      'timestamp', now(),
      'duration_ms', extract(epoch from (clock_timestamp() - start_time)) * 1000,
      'user_id', auth.uid()
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION test_connection() TO authenticated;
GRANT EXECUTE ON FUNCTION test_rls_configuration() TO authenticated;
GRANT EXECUTE ON FUNCTION test_database_functions() TO authenticated;
GRANT EXECUTE ON FUNCTION test_triggers() TO authenticated;
GRANT EXECUTE ON FUNCTION run_all_tests() TO authenticated;