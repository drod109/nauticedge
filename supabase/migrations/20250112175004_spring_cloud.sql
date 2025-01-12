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
          SELECT jsonb_object_agg(tablename, EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = t.tablename
          ))
          FROM (VALUES 
            ('users_metadata'),
            ('subscriptions'),
            ('vessels'),
            ('surveys'),
            ('survey_sections'),
            ('survey_items'),
            ('survey_analyses'),
            ('api_keys'),
            ('api_usage'),
            ('audit_log')
          ) AS t(tablename)
        ),
        'functions', (
          SELECT jsonb_object_agg(funcname, EXISTS (
            SELECT 1 FROM pg_proc 
            WHERE proname = f.funcname
            AND pronamespace = 'public'::regnamespace
          ))
          FROM (VALUES 
            ('test_database'),
            ('test_table_permissions'),
            ('verify_rls_status'),
            ('test_rls_effectiveness')
          ) AS f(funcname)
        )
      )
    ),
    'rls', (
      SELECT jsonb_object_agg(tablename, rowsecurity)
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
    ),
    'validation', (
      SELECT jsonb_object_agg(tgname, tgenabled = 'O')
      FROM pg_trigger
      WHERE tgrelid IN (
        SELECT oid FROM pg_class
        WHERE relnamespace = 'public'::regnamespace
      )
    ),
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