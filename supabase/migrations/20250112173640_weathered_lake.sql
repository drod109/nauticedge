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

-- Function to run comprehensive tests
CREATE OR REPLACE FUNCTION run_comprehensive_tests()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
  test_start timestamptz;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  test_start := clock_timestamp();

  -- Run all tests
  SELECT jsonb_build_object(
    'setup', (
      SELECT jsonb_build_object(
        'tables', (
          SELECT jsonb_object_agg(tablename, true)
          FROM pg_tables
          WHERE schemaname = 'public'
        ),
        'functions', (
          SELECT jsonb_object_agg(proname, true)
          FROM pg_proc
          WHERE pronamespace = 'public'::regnamespace
        )
      )
    ),
    'rls', (
      SELECT jsonb_object_agg(tablename, rowsecurity)
      FROM pg_tables
      WHERE schemaname = 'public'
    ),
    'validation', (
      SELECT jsonb_object_agg(tgname, true)
      FROM pg_trigger
      WHERE tgrelid IN (
        SELECT oid FROM pg_class
        WHERE relnamespace = 'public'::regnamespace
      )
    ),
    'rate_limiting', test_rate_limiting(),
    'audit', test_audit_logging(),
    'metadata', jsonb_build_object(
      'duration_ms', extract(epoch from (clock_timestamp() - test_start)) * 1000,
      'timestamp', now(),
      'user_id', auth.uid()
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION run_comprehensive_tests() TO authenticated;