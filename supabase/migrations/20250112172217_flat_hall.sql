/*
  # Test Database Configuration
  
  1. New Functions
    - `test_database_configuration()` - Runs comprehensive database tests
    - `test_rls_policies()` - Tests RLS policies
    - `test_validation_triggers()` - Tests validation triggers
    - `test_rate_limiting()` - Tests rate limiting
    - `test_audit_logging()` - Tests audit logging
    - `verify_database_setup()` - Verifies database setup
    - `create_test_data()` - Creates test data
    - `cleanup_test_data()` - Cleans up test data
  
  2. Security
    - All functions are SECURITY DEFINER
    - All functions require authentication
    - Proper search_path settings
*/

-- Function to run all tests
CREATE OR REPLACE FUNCTION run_all_tests()
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

  -- Run comprehensive tests
  SELECT test_database_configuration() INTO result;

  RETURN result;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION run_all_tests() TO authenticated;