/*
  # Helper Functions for System Monitoring and Testing
  
  1. New Functions
    - get_system_status(): Returns overall system status
    - get_table_stats(): Returns statistics about table usage
    - get_api_usage_stats(): Returns API usage statistics
    - get_audit_summary(): Returns summary of audit log entries

  2. Purpose
    - Provide easy ways to monitor system health
    - Track usage patterns
    - Help diagnose potential issues
*/

-- Function to get overall system status
CREATE OR REPLACE FUNCTION get_system_status()
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

  -- Get active users count
  SELECT jsonb_build_object(
    'active_users',
    COUNT(DISTINCT user_id)
  )
  FROM subscriptions
  WHERE status = 'active'
  AND current_period_end > CURRENT_TIMESTAMP
  INTO result;

  -- Get surveys statistics
  result = result || jsonb_build_object(
    'surveys', (
      SELECT jsonb_build_object(
        'total', COUNT(*),
        'draft', COUNT(*) FILTER (WHERE status = 'draft'),
        'in_progress', COUNT(*) FILTER (WHERE status = 'in_progress'),
        'completed', COUNT(*) FILTER (WHERE status = 'completed')
      )
      FROM surveys
    )
  );

  -- Get API usage statistics
  result = result || jsonb_build_object(
    'api_usage', (
      SELECT jsonb_build_object(
        'total_requests', COUNT(*),
        'average_response_time', AVG(response_time),
        'error_rate', (
          COUNT(*) FILTER (WHERE status_code >= 400)::float / 
          NULLIF(COUNT(*), 0)::float
        )
      )
      FROM api_usage
      WHERE timestamp > CURRENT_TIMESTAMP - interval '24 hours'
    )
  );

  RETURN result;
END;
$$;

-- Function to get table statistics
CREATE OR REPLACE FUNCTION get_table_stats()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
  table_name text;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  FOR table_name IN
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('
      SELECT jsonb_build_object(
        ''total_rows'', (SELECT COUNT(*) FROM %I),
        ''last_updated'', (
          SELECT updated_at 
          FROM %I 
          ORDER BY updated_at DESC 
          LIMIT 1
        )
      )', table_name, table_name)
    INTO result;
    
    result = result || jsonb_build_object(table_name, result);
  END LOOP;

  RETURN result;
END;
$$;

-- Function to get API usage statistics
CREATE OR REPLACE FUNCTION get_api_usage_stats(
  p_days integer DEFAULT 7
)
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

  -- Validate input
  IF p_days <= 0 OR p_days > 30 THEN
    RAISE EXCEPTION 'Days parameter must be between 1 and 30';
  END IF;

  SELECT jsonb_build_object(
    'daily_stats', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'date', date,
          'total_requests', total_requests,
          'average_response_time', avg_response_time,
          'error_rate', error_rate
        )
      )
      FROM (
        SELECT
          DATE(timestamp) as date,
          COUNT(*) as total_requests,
          AVG(response_time) as avg_response_time,
          (COUNT(*) FILTER (WHERE status_code >= 400)::float / 
           NULLIF(COUNT(*), 0)::float) as error_rate
        FROM api_usage
        WHERE timestamp > CURRENT_TIMESTAMP - (p_days || ' days')::interval
        GROUP BY DATE(timestamp)
        ORDER BY date DESC
      ) daily
    ),
    'endpoint_stats', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'endpoint', endpoint,
          'total_requests', total_requests,
          'average_response_time', avg_response_time
        )
      )
      FROM (
        SELECT
          endpoint,
          COUNT(*) as total_requests,
          AVG(response_time) as avg_response_time
        FROM api_usage
        WHERE timestamp > CURRENT_TIMESTAMP - (p_days || ' days')::interval
        GROUP BY endpoint
        ORDER BY total_requests DESC
        LIMIT 10
      ) endpoints
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- Function to get audit log summary
CREATE OR REPLACE FUNCTION get_audit_summary(
  p_days integer DEFAULT 7
)
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

  -- Validate input
  IF p_days <= 0 OR p_days > 30 THEN
    RAISE EXCEPTION 'Days parameter must be between 1 and 30';
  END IF;

  SELECT jsonb_build_object(
    'action_summary', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'action', action,
          'count', count
        )
      )
      FROM (
        SELECT action, COUNT(*) as count
        FROM audit_log
        WHERE created_at > CURRENT_TIMESTAMP - (p_days || ' days')::interval
        GROUP BY action
        ORDER BY count DESC
      ) actions
    ),
    'resource_summary', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'resource_type', resource_type,
          'count', count
        )
      )
      FROM (
        SELECT resource_type, COUNT(*) as count
        FROM audit_log
        WHERE created_at > CURRENT_TIMESTAMP - (p_days || ' days')::interval
        GROUP BY resource_type
        ORDER BY count DESC
      ) resources
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_system_status() TO authenticated;
GRANT EXECUTE ON FUNCTION get_table_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_api_usage_stats(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION get_audit_summary(integer) TO authenticated;