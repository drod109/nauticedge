/*
  # Test Functions for Database Validation

  1. New Functions
    - test_rls_policies(): Tests RLS policies for all tables
    - test_validation_triggers(): Tests data validation triggers
    - test_rate_limiting(): Tests API rate limiting
    - test_audit_logging(): Tests audit logging system

  2. Purpose
    - Provide easy ways to verify database functionality
    - Help diagnose potential issues
    - Ensure security measures are working
*/

-- Function to test RLS policies
CREATE OR REPLACE FUNCTION test_rls_policies()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
  test_user_id uuid;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Create a test user ID
  test_user_id := gen_random_uuid();

  -- Test users_metadata RLS
  BEGIN
    INSERT INTO users_metadata (user_id, full_name)
    VALUES (test_user_id, 'Test User');
    result = result || jsonb_build_object('users_metadata_rls', false);
  EXCEPTION
    WHEN insufficient_privilege THEN
      result = result || jsonb_build_object('users_metadata_rls', true);
  END;

  -- Test subscriptions RLS
  BEGIN
    INSERT INTO subscriptions (user_id, plan, status, current_period_start, current_period_end)
    VALUES (test_user_id, 'basic', 'active', now(), now() + interval '1 month');
    result = result || jsonb_build_object('subscriptions_rls', false);
  EXCEPTION
    WHEN insufficient_privilege THEN
      result = result || jsonb_build_object('subscriptions_rls', true);
  END;

  -- Test surveys RLS
  BEGIN
    INSERT INTO surveys (user_id, vessel_id, title, survey_type, status)
    VALUES (test_user_id, gen_random_uuid(), 'Test Survey', 'annual', 'draft');
    result = result || jsonb_build_object('surveys_rls', false);
  EXCEPTION
    WHEN insufficient_privilege THEN
      result = result || jsonb_build_object('surveys_rls', true);
  END;

  RETURN result;
END;
$$;

-- Function to test validation triggers
CREATE OR REPLACE FUNCTION test_validation_triggers()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
  test_vessel_id uuid;
  test_survey_id uuid;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Test vessel validation
  BEGIN
    INSERT INTO vessels (name, vessel_type, length, beam, year_built)
    VALUES ('Test Vessel', 'Sailboat', -1, 10, 2025)
    RETURNING id INTO test_vessel_id;
    result = result || jsonb_build_object('vessel_validation', false);
  EXCEPTION
    WHEN OTHERS THEN
      result = result || jsonb_build_object('vessel_validation', true);
  END;

  -- Test survey validation
  BEGIN
    INSERT INTO surveys (
      user_id,
      vessel_id,
      title,
      survey_type,
      status,
      scheduled_date
    )
    VALUES (
      auth.uid(),
      gen_random_uuid(),
      'Test Survey',
      'annual',
      'draft',
      CURRENT_DATE - interval '1 day'
    )
    RETURNING id INTO test_survey_id;
    result = result || jsonb_build_object('survey_validation', false);
  EXCEPTION
    WHEN OTHERS THEN
      result = result || jsonb_build_object('survey_validation', true);
  END;

  RETURN result;
END;
$$;

-- Function to test rate limiting
CREATE OR REPLACE FUNCTION test_rate_limiting()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
  rate_limit_result boolean;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Test rate limiting for basic plan
  FOR i IN 1..110 LOOP
    rate_limit_result := track_api_rate_limit(auth.uid(), '/api/test');
    IF NOT rate_limit_result THEN
      result = result || jsonb_build_object(
        'rate_limiting',
        true,
        'limit_reached_at',
        i
      );
      EXIT;
    END IF;
  END LOOP;

  IF rate_limit_result THEN
    result = result || jsonb_build_object('rate_limiting', false);
  END IF;

  RETURN result;
END;
$$;

-- Function to test audit logging
CREATE OR REPLACE FUNCTION test_audit_logging()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
  test_resource_id uuid;
  audit_entry_exists boolean;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Generate test resource ID
  test_resource_id := gen_random_uuid();

  -- Create test audit log entry
  PERFORM log_audit_event(
    auth.uid(),
    'test',
    'test_resource',
    test_resource_id,
    jsonb_build_object('test', true)
  );

  -- Verify audit log entry was created
  SELECT EXISTS (
    SELECT 1 FROM audit_log
    WHERE user_id = auth.uid()
    AND resource_id = test_resource_id
  ) INTO audit_entry_exists;

  result = jsonb_build_object(
    'audit_logging',
    audit_entry_exists,
    'resource_id',
    test_resource_id
  );

  RETURN result;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION test_rls_policies() TO authenticated;
GRANT EXECUTE ON FUNCTION test_validation_triggers() TO authenticated;
GRANT EXECUTE ON FUNCTION test_rate_limiting() TO authenticated;
GRANT EXECUTE ON FUNCTION test_audit_logging() TO authenticated;