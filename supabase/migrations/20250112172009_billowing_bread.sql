/*
  # Test Database Setup
  
  1. Purpose
    - Verify database configuration
    - Test RLS policies
    - Test validation triggers
    - Test rate limiting
    - Test audit logging

  2. Functions
    - test_database_configuration(): Comprehensive test of database setup
*/

-- Function to test database configuration
CREATE OR REPLACE FUNCTION test_database_configuration()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
  setup_result jsonb;
  test_data_result jsonb;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Step 1: Verify database setup
  SELECT verify_database_setup() INTO setup_result;
  result = result || jsonb_build_object('setup', setup_result);

  -- Step 2: Test RLS policies
  result = result || jsonb_build_object('rls', test_rls_policies());

  -- Step 3: Test validation triggers
  result = result || jsonb_build_object('validation', test_validation_triggers());

  -- Step 4: Test rate limiting
  result = result || jsonb_build_object('rate_limiting', test_rate_limiting());

  -- Step 5: Test audit logging
  result = result || jsonb_build_object('audit', test_audit_logging());

  -- Step 6: Create test data
  SELECT create_test_data() INTO test_data_result;
  result = result || jsonb_build_object('test_data', test_data_result);

  -- Step 7: Get system status
  result = result || jsonb_build_object('system_status', get_system_status());

  -- Step 8: Cleanup test data
  PERFORM cleanup_test_data();

  RETURN result;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION test_database_configuration() TO authenticated;