/*
  # Fix RLS Policies

  1. Changes
    - Re-enables RLS for all tables
    - Recreates RLS policies with proper permissions
    - Adds missing policies for some tables
  
  2. Security
    - Ensures proper row-level security for all tables
    - Adds proper authentication checks
*/

-- Re-enable RLS for all tables
ALTER TABLE users_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for users_metadata
DROP POLICY IF EXISTS "Enable read for users" ON users_metadata;
DROP POLICY IF EXISTS "Enable insert for users" ON users_metadata;
DROP POLICY IF EXISTS "Enable update for users" ON users_metadata;

CREATE POLICY "Users can read own metadata"
  ON users_metadata
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own metadata"
  ON users_metadata
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own metadata"
  ON users_metadata
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Drop and recreate policies for subscriptions
DROP POLICY IF EXISTS "Enable read for users" ON subscriptions;
DROP POLICY IF EXISTS "Enable insert for users" ON subscriptions;
DROP POLICY IF EXISTS "Enable update for users" ON subscriptions;
DROP POLICY IF EXISTS "Enable delete for users" ON subscriptions;

CREATE POLICY "Users can read own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscription"
  ON subscriptions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop and recreate policies for vessels
DROP POLICY IF EXISTS "Enable read for users" ON vessels;
DROP POLICY IF EXISTS "Enable insert for users" ON vessels;

CREATE POLICY "Users can read vessels"
  ON vessels
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert vessels"
  ON vessels
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update vessels"
  ON vessels
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.vessel_id = vessels.id
    AND surveys.user_id = auth.uid()
  ));

-- Drop and recreate policies for surveys
DROP POLICY IF EXISTS "Enable read for users" ON surveys;
DROP POLICY IF EXISTS "Enable insert for users" ON surveys;
DROP POLICY IF EXISTS "Enable update for users" ON surveys;
DROP POLICY IF EXISTS "Enable delete for users" ON surveys;

CREATE POLICY "Users can read own surveys"
  ON surveys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own surveys"
  ON surveys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own surveys"
  ON surveys
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own surveys"
  ON surveys
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop and recreate policies for survey_sections
DROP POLICY IF EXISTS "Enable read for users" ON survey_sections;
DROP POLICY IF EXISTS "Enable insert for users" ON survey_sections;
DROP POLICY IF EXISTS "Enable update for users" ON survey_sections;
DROP POLICY IF EXISTS "Enable delete for users" ON survey_sections;

CREATE POLICY "Users can read own survey sections"
  ON survey_sections
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.id = survey_sections.survey_id
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own survey sections"
  ON survey_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.id = survey_sections.survey_id
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own survey sections"
  ON survey_sections
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.id = survey_sections.survey_id
    AND surveys.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.id = survey_sections.survey_id
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own survey sections"
  ON survey_sections
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.id = survey_sections.survey_id
    AND surveys.user_id = auth.uid()
  ));

-- Drop and recreate policies for survey_items
DROP POLICY IF EXISTS "Enable read for users" ON survey_items;
DROP POLICY IF EXISTS "Enable insert for users" ON survey_items;
DROP POLICY IF EXISTS "Enable update for users" ON survey_items;
DROP POLICY IF EXISTS "Enable delete for users" ON survey_items;

CREATE POLICY "Users can read own survey items"
  ON survey_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM survey_sections
    JOIN surveys ON surveys.id = survey_sections.survey_id
    WHERE survey_sections.id = survey_items.section_id
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own survey items"
  ON survey_items
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM survey_sections
    JOIN surveys ON surveys.id = survey_sections.survey_id
    WHERE survey_sections.id = survey_items.section_id
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Users can update own survey items"
  ON survey_items
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM survey_sections
    JOIN surveys ON surveys.id = survey_sections.survey_id
    WHERE survey_sections.id = survey_items.section_id
    AND surveys.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM survey_sections
    JOIN surveys ON surveys.id = survey_sections.survey_id
    WHERE survey_sections.id = survey_items.section_id
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own survey items"
  ON survey_items
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM survey_sections
    JOIN surveys ON surveys.id = survey_sections.survey_id
    WHERE survey_sections.id = survey_items.section_id
    AND surveys.user_id = auth.uid()
  ));

-- Drop and recreate policies for survey_analyses
DROP POLICY IF EXISTS "Enable read for users" ON survey_analyses;
DROP POLICY IF EXISTS "Enable insert for users" ON survey_analyses;
DROP POLICY IF EXISTS "Enable update for users" ON survey_analyses;
DROP POLICY IF EXISTS "Enable delete for users" ON survey_analyses;

CREATE POLICY "Users can read own analyses"
  ON survey_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON survey_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON survey_analyses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON survey_analyses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop and recreate policies for api_keys
DROP POLICY IF EXISTS "Enable read for users" ON api_keys;
DROP POLICY IF EXISTS "Enable insert for users" ON api_keys;
DROP POLICY IF EXISTS "Enable update for users" ON api_keys;
DROP POLICY IF EXISTS "Enable delete for users" ON api_keys;

CREATE POLICY "Users can read own API keys"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own API keys"
  ON api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
  ON api_keys
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys"
  ON api_keys
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop and recreate policies for api_usage
DROP POLICY IF EXISTS "Enable read for users" ON api_usage;
DROP POLICY IF EXISTS "Enable insert for users" ON api_usage;

CREATE POLICY "Users can read own API usage"
  ON api_usage
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API usage"
  ON api_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Drop and recreate policies for audit_log
DROP POLICY IF EXISTS "Enable read for users" ON audit_log;

CREATE POLICY "Users can read own audit logs"
  ON audit_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert audit logs"
  ON audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);