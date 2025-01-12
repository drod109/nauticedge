/*
  # Validation Functions and Performance Optimizations

  1. New Functions
    - Add vessel validation function
    - Add survey validation function
    - Add rate limiting function
    - Add audit logging function

  2. Additional Indexes
    - Composite indexes for common queries
    - Partial indexes for active records
*/

-- Function to validate vessel data
CREATE OR REPLACE FUNCTION validate_vessel_data()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  -- Validate length
  IF NEW.length <= 0 THEN
    RAISE EXCEPTION 'Vessel length must be greater than 0';
  END IF;

  -- Validate beam
  IF NEW.beam <= 0 THEN
    RAISE EXCEPTION 'Vessel beam must be greater than 0';
  END IF;

  -- Validate year built
  IF NEW.year_built < 1800 OR NEW.year_built > EXTRACT(YEAR FROM CURRENT_DATE) THEN
    RAISE EXCEPTION 'Invalid year built';
  END IF;

  RETURN NEW;
END;
$$;

-- Function to validate survey data
CREATE OR REPLACE FUNCTION validate_survey_data()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  -- Ensure scheduled_date is not in the past for new surveys
  IF TG_OP = 'INSERT' AND NEW.scheduled_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Scheduled date cannot be in the past';
  END IF;

  -- Validate status transitions
  IF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
      RAISE EXCEPTION 'Cannot change status of completed survey';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Function to track API rate limits
CREATE OR REPLACE FUNCTION track_api_rate_limit(
  p_user_id uuid,
  p_endpoint text
)
RETURNS boolean
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  v_count integer;
  v_limit integer;
  v_subscription_plan text;
BEGIN
  -- Get user's subscription plan
  SELECT plan INTO v_subscription_plan
  FROM subscriptions
  WHERE user_id = p_user_id
  AND status = 'active'
  AND current_period_end > CURRENT_TIMESTAMP;

  -- Set limit based on plan
  v_limit := CASE v_subscription_plan
    WHEN 'basic' THEN 100
    WHEN 'professional' THEN 1000
    WHEN 'enterprise' THEN 10000
    ELSE 50
  END;

  -- Count requests in the last hour
  SELECT COUNT(*) INTO v_count
  FROM api_usage
  WHERE user_id = p_user_id
  AND timestamp > CURRENT_TIMESTAMP - INTERVAL '1 hour';

  RETURN v_count < v_limit;
END;
$$;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id uuid,
  p_action text,
  p_resource_type text,
  p_resource_id uuid,
  p_details jsonb DEFAULT NULL
)
RETURNS void
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    p_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_details
  );
END;
$$;

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on audit log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Audit log policies
CREATE POLICY "Enable read for users"
  ON audit_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add triggers
CREATE TRIGGER validate_vessel_data_trigger
  BEFORE INSERT OR UPDATE ON vessels
  FOR EACH ROW
  EXECUTE FUNCTION validate_vessel_data();

CREATE TRIGGER validate_survey_data_trigger
  BEFORE INSERT OR UPDATE ON surveys
  FOR EACH ROW
  EXECUTE FUNCTION validate_survey_data();

-- Create composite indexes
CREATE INDEX IF NOT EXISTS idx_surveys_user_status ON surveys(user_id, status);
CREATE INDEX IF NOT EXISTS idx_surveys_vessel_status ON surveys(vessel_id, status);
CREATE INDEX IF NOT EXISTS idx_survey_items_section_order ON survey_items(section_id, order_index);

-- Create partial indexes
CREATE INDEX IF NOT EXISTS idx_active_subscriptions 
  ON subscriptions(user_id, current_period_end)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_active_surveys
  ON surveys(user_id, scheduled_date)
  WHERE status IN ('draft', 'in_progress');

CREATE INDEX IF NOT EXISTS idx_audit_log_user_date
  ON audit_log(user_id, created_at DESC);

-- Grant permissions
GRANT EXECUTE ON FUNCTION track_api_rate_limit(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION log_audit_event(uuid, text, text, uuid, jsonb) TO authenticated;