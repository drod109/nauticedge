/*
  # Security Enhancements

  1. Changes
    - Add trigger for updating timestamps
    - Add security functions for subscription validation
    - Add function to verify user ownership
    - Add additional indexes for performance

  2. Security
    - All functions are SECURITY DEFINER
    - Proper search_path settings
    - Input validation
*/

-- Function to automatically update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- Add update timestamp triggers
CREATE TRIGGER update_users_metadata_timestamp
  BEFORE UPDATE ON users_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_vessels_timestamp
  BEFORE UPDATE ON vessels
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_surveys_timestamp
  BEFORE UPDATE ON surveys
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_survey_sections_timestamp
  BEFORE UPDATE ON survey_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_survey_items_timestamp
  BEFORE UPDATE ON survey_items
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- Function to verify subscription status
CREATE OR REPLACE FUNCTION verify_subscription(user_id uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  subscription_status text;
BEGIN
  SELECT status INTO subscription_status
  FROM subscriptions
  WHERE subscriptions.user_id = verify_subscription.user_id
  AND current_period_end > CURRENT_TIMESTAMP;

  RETURN subscription_status = 'active';
END;
$$;

-- Function to verify user ownership of a survey
CREATE OR REPLACE FUNCTION verify_survey_ownership(survey_id uuid, user_id uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.id = survey_id
    AND surveys.user_id = user_id
  );
END;
$$;

-- Additional indexes for common queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period_end ON subscriptions(current_period_end);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON surveys(status);
CREATE INDEX IF NOT EXISTS idx_surveys_scheduled_date ON surveys(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_survey_items_rating ON survey_items(rating);

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION verify_subscription(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_survey_ownership(uuid, uuid) TO authenticated;