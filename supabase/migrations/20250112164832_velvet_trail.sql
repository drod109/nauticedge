/*
  # Fix Diagnostic Functions Permissions

  1. Changes
    - Grant EXECUTE permissions on diagnostic functions
    - Add proper security barriers
    - Ensure functions are accessible to authenticated users
*/

-- Revoke existing permissions
REVOKE EXECUTE ON FUNCTION check_tables(text[]) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION check_rls_enabled(text[]) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION list_policies(text) FROM PUBLIC;

-- Drop and recreate functions with proper security
CREATE OR REPLACE FUNCTION check_tables(table_names text[])
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
  tbl text;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  FOREACH tbl IN ARRAY table_names
  LOOP
    result = result || jsonb_build_object(
      tbl,
      EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = tbl
      )
    );
  END LOOP;
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION check_rls_enabled(table_names text[])
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
  tbl text;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  FOREACH tbl IN ARRAY table_names
  LOOP
    result = result || jsonb_build_object(
      tbl,
      EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = tbl
        AND rowsecurity = true
      )
    );
  END LOOP;
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION list_policies(table_name text)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
  cmd text;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  FOR cmd IN
    SELECT DISTINCT cmd
    FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename = table_name
  LOOP
    result = result || jsonb_build_object(
      cmd,
      ARRAY(
        SELECT polname::text
        FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = table_name
        AND cmd = cmd
      )
    );
  END LOOP;
  RETURN result;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION check_tables(text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION check_rls_enabled(text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION list_policies(text) TO authenticated;