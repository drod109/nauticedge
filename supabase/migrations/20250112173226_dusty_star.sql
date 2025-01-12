/*
  # RLS Verification and Testing

  1. Changes
    - Adds comprehensive RLS verification functions
    - Adds test functions for each table's policies
    - Adds a unified test runner for all RLS checks

  2. Security
    - All functions are security definer
    - Proper search path restrictions
    - Authentication checks
*/

-- Function to test RLS for each table
CREATE OR REPLACE FUNCTION test_table_rls(table_name text)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
  test_user_id uuid = gen_random_uuid();
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Test SELECT
  BEGIN
    EXECUTE format('SELECT * FROM %I LIMIT 1', table_name);
    result = result || jsonb_build_object('select_protected', false);
  EXCEPTION
    WHEN insufficient_privilege THEN
      result = result || jsonb_build_object('select_protected', true);
  END;

  -- Test INSERT
  BEGIN
    CASE table_name
      WHEN 'users_metadata' THEN
        INSERT INTO users_metadata (user_id, full_name)
        VALUES (test_user_id, 'Test User');
      WHEN 'subscriptions' THEN
        INSERT INTO subscriptions (user_id, plan, status, current_period_start, current_period_end)
        VALUES (test_user_id, 'basic', 'active', now(), now() + interval '1 month');
      WHEN 'vessels' THEN
        INSERT INTO vessels (name, vessel_type, length, beam)
        VALUES ('Test Vessel', 'Sailboat', 30, 10);
      ELSE
        RAISE EXCEPTION 'Unsupported table for testing: %', table_name;
    END CASE;
    result = result || jsonb_build_object('insert_protected', false);
  EXCEPTION
    WHEN insufficient_privilege THEN
      result = result || jsonb_build_object('insert_protected', true);
  END;

  RETURN result;
END;
$$;

-- Function to verify all RLS policies
CREATE OR REPLACE FUNCTION verify_all_rls()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
  table_record record;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check RLS status for all tables
  FOR table_record IN
    SELECT tablename
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
  LOOP
    -- Check if RLS is enabled
    result = result || jsonb_build_object(
      table_record.tablename,
      jsonb_build_object(
        'rls_enabled', (
          SELECT rowsecurity
          FROM pg_tables
          WHERE tablename = table_record.tablename
        ),
        'policies', (
          SELECT jsonb_agg(jsonb_build_object(
            'name', polname,
            'command', cmd,
            'roles', roles
          ))
          FROM pg_policies
          WHERE tablename = table_record.tablename
        ),
        'tests', test_table_rls(table_record.tablename)
      )
    );
  END LOOP;

  RETURN result;
END;
$$;

-- Function to run comprehensive RLS tests
CREATE OR REPLACE FUNCTION run_comprehensive_rls_tests()
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

  -- Run all RLS tests
  SELECT jsonb_build_object(
    'rls_verification', verify_all_rls(),
    'rls_tests', run_rls_tests(),
    'timestamp', now()
  ) INTO result;

  RETURN result;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION test_table_rls(text) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_all_rls() TO authenticated;
GRANT EXECUTE ON FUNCTION run_comprehensive_rls_tests() TO authenticated;