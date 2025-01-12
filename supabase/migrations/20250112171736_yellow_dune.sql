/*
  # Test Data and Verification Functions
  
  1. New Functions
    - create_test_data(): Creates sample data for testing
    - verify_database_setup(): Comprehensive verification of database setup
    - cleanup_test_data(): Removes test data

  2. Purpose
    - Provide sample data for testing
    - Verify database configuration
    - Enable easy cleanup
*/

-- Function to create test data
CREATE OR REPLACE FUNCTION create_test_data()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  test_user_id uuid;
  test_vessel_id uuid;
  test_survey_id uuid;
  test_section_id uuid;
  result jsonb = '{}'::jsonb;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Create test user metadata
  INSERT INTO users_metadata (
    user_id,
    full_name,
    phone,
    company_name,
    company_position,
    location
  ) VALUES (
    auth.uid(),
    'Test User',
    '+1234567890',
    'Test Company',
    'Surveyor',
    'Test Location'
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Create test subscription
  INSERT INTO subscriptions (
    user_id,
    plan,
    status,
    current_period_start,
    current_period_end
  ) VALUES (
    auth.uid(),
    'professional',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + interval '1 month'
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Create test vessel
  INSERT INTO vessels (
    name,
    registration_number,
    vessel_type,
    length,
    beam,
    draft,
    year_built,
    manufacturer,
    model,
    hull_material
  ) VALUES (
    'Test Vessel',
    'REG123',
    'Sailboat',
    35.5,
    12.3,
    6.2,
    2020,
    'Test Manufacturer',
    'Test Model',
    'Fiberglass'
  )
  RETURNING id INTO test_vessel_id;

  -- Create test survey
  INSERT INTO surveys (
    user_id,
    vessel_id,
    title,
    description,
    survey_type,
    status,
    scheduled_date,
    location
  ) VALUES (
    auth.uid(),
    test_vessel_id,
    'Test Survey',
    'Test survey description',
    'annual',
    'draft',
    CURRENT_TIMESTAMP + interval '1 day',
    'Test Location'
  )
  RETURNING id INTO test_survey_id;

  -- Create test survey section
  INSERT INTO survey_sections (
    survey_id,
    title,
    description,
    order_index
  ) VALUES (
    test_survey_id,
    'Test Section',
    'Test section description',
    1
  )
  RETURNING id INTO test_section_id;

  -- Create test survey items
  INSERT INTO survey_items (
    section_id,
    title,
    description,
    finding,
    rating,
    recommendation,
    order_index
  ) VALUES (
    test_section_id,
    'Test Item 1',
    'Test item description',
    'Test finding',
    'good',
    'Test recommendation',
    1
  );

  -- Create test API key
  INSERT INTO api_keys (
    user_id,
    key_hash,
    name,
    scopes
  ) VALUES (
    auth.uid(),
    'test_key_hash',
    'Test API Key',
    ARRAY['read', 'write']
  );

  -- Record success
  result = jsonb_build_object(
    'success', true,
    'vessel_id', test_vessel_id,
    'survey_id', test_survey_id
  );

  RETURN result;
END;
$$;

-- Function to verify database setup
CREATE OR REPLACE FUNCTION verify_database_setup()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check tables exist
  result = result || jsonb_build_object(
    'tables', (
      SELECT jsonb_object_agg(table_name, EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = tables.table_name
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
      ) AS tables(table_name)
    )
  );

  -- Check RLS is enabled
  result = result || jsonb_build_object(
    'rls_enabled', (
      SELECT jsonb_object_agg(tablename, rowsecurity)
      FROM pg_tables
      WHERE schemaname = 'public'
    )
  );

  -- Check indexes exist
  result = result || jsonb_build_object(
    'indexes', (
      SELECT jsonb_object_agg(indexname, true)
      FROM pg_indexes
      WHERE schemaname = 'public'
    )
  );

  -- Check triggers exist
  result = result || jsonb_build_object(
    'triggers', (
      SELECT jsonb_object_agg(tgname, true)
      FROM pg_trigger
      WHERE tgrelid IN (
        SELECT oid FROM pg_class
        WHERE relnamespace = (
          SELECT oid FROM pg_namespace
          WHERE nspname = 'public'
        )
      )
    )
  );

  RETURN result;
END;
$$;

-- Function to cleanup test data
CREATE OR REPLACE FUNCTION cleanup_test_data()
RETURNS void
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete test data in reverse order of dependencies
  DELETE FROM api_usage
  WHERE user_id = auth.uid();

  DELETE FROM api_keys
  WHERE user_id = auth.uid();

  DELETE FROM survey_items
  WHERE section_id IN (
    SELECT id FROM survey_sections
    WHERE survey_id IN (
      SELECT id FROM surveys
      WHERE user_id = auth.uid()
    )
  );

  DELETE FROM survey_sections
  WHERE survey_id IN (
    SELECT id FROM surveys
    WHERE user_id = auth.uid()
  );

  DELETE FROM surveys
  WHERE user_id = auth.uid();

  DELETE FROM vessels
  WHERE id IN (
    SELECT vessel_id FROM surveys
    WHERE user_id = auth.uid()
  );

  DELETE FROM subscriptions
  WHERE user_id = auth.uid();

  DELETE FROM users_metadata
  WHERE user_id = auth.uid();
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION create_test_data() TO authenticated;
GRANT EXECUTE ON FUNCTION verify_database_setup() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_test_data() TO authenticated;