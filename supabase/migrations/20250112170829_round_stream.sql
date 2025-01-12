/*
  # Initial Database Schema

  1. Tables
    - users_metadata: Extended user profile information
    - subscriptions: User subscription plans and status
    - vessels: Vessel information
    - surveys: Marine survey records
    - survey_sections: Survey structure and organization
    - survey_items: Individual survey findings
    - survey_analyses: AI-powered survey analysis
    - api_keys: API access management
    - api_usage: API usage tracking

  2. Security
    - RLS enabled on all tables
    - Policies for authenticated users
    - Security functions for diagnostics

  3. Functions
    - Database testing and diagnostics
    - Table permission verification
*/

-- Users Metadata
CREATE TABLE users_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  full_name text,
  phone text,
  company_name text,
  company_position text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

-- Subscriptions
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  plan text NOT NULL CHECK (plan IN ('basic', 'professional', 'enterprise')),
  status text NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

-- Vessels
CREATE TABLE vessels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  registration_number text,
  vessel_type text NOT NULL,
  length numeric,
  beam numeric,
  draft numeric,
  year_built integer,
  manufacturer text,
  model text,
  hull_material text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Surveys
CREATE TABLE surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  vessel_id uuid REFERENCES vessels NOT NULL,
  title text NOT NULL,
  description text,
  survey_type text NOT NULL CHECK (survey_type IN ('annual', 'condition', 'damage', 'pre-purchase')),
  status text NOT NULL CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),
  scheduled_date timestamptz,
  completed_date timestamptz,
  location text,
  weather_conditions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Survey Sections
CREATE TABLE survey_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid REFERENCES surveys NOT NULL,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  parent_section_id uuid REFERENCES survey_sections,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Survey Items
CREATE TABLE survey_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES survey_sections NOT NULL,
  title text NOT NULL,
  description text,
  finding text,
  rating text CHECK (rating IN ('good', 'fair', 'poor', 'critical')),
  recommendation text,
  photos text[],
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Survey Analyses
CREATE TABLE survey_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid REFERENCES surveys NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  analysis_type text NOT NULL CHECK (analysis_type IN ('risk', 'recommendations', 'compliance')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- API Keys
CREATE TABLE api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  key_hash text NOT NULL,
  name text NOT NULL,
  scopes text[] NOT NULL DEFAULT '{}',
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz,
  UNIQUE (user_id, name)
);

-- API Usage
CREATE TABLE api_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  api_key_id uuid REFERENCES api_keys NOT NULL,
  endpoint text NOT NULL,
  method text NOT NULL,
  status_code integer NOT NULL,
  timestamp timestamptz DEFAULT now(),
  response_time integer NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Users Metadata Policies
CREATE POLICY "Enable read for users"
  ON users_metadata
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users"
  ON users_metadata
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users"
  ON users_metadata
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Subscriptions Policies
CREATE POLICY "Enable read for users"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users"
  ON subscriptions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Vessels Policies
CREATE POLICY "Enable read for users"
  ON vessels
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for users"
  ON vessels
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Surveys Policies
CREATE POLICY "Enable read for users"
  ON surveys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users"
  ON surveys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users"
  ON surveys
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users"
  ON surveys
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Survey Sections Policies
CREATE POLICY "Enable read for users"
  ON survey_sections
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.id = survey_sections.survey_id
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Enable insert for users"
  ON survey_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.id = survey_sections.survey_id
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Enable update for users"
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

CREATE POLICY "Enable delete for users"
  ON survey_sections
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.id = survey_sections.survey_id
    AND surveys.user_id = auth.uid()
  ));

-- Survey Items Policies
CREATE POLICY "Enable read for users"
  ON survey_items
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM survey_sections
    JOIN surveys ON surveys.id = survey_sections.survey_id
    WHERE survey_sections.id = survey_items.section_id
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Enable insert for users"
  ON survey_items
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM survey_sections
    JOIN surveys ON surveys.id = survey_sections.survey_id
    WHERE survey_sections.id = survey_items.section_id
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Enable update for users"
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

CREATE POLICY "Enable delete for users"
  ON survey_items
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM survey_sections
    JOIN surveys ON surveys.id = survey_sections.survey_id
    WHERE survey_sections.id = survey_items.section_id
    AND surveys.user_id = auth.uid()
  ));

-- Survey Analyses Policies
CREATE POLICY "Enable read for users"
  ON survey_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users"
  ON survey_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users"
  ON survey_analyses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users"
  ON survey_analyses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- API Keys Policies
CREATE POLICY "Enable read for users"
  ON api_keys
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users"
  ON api_keys
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users"
  ON api_keys
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users"
  ON api_keys
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- API Usage Policies
CREATE POLICY "Enable read for users"
  ON api_usage
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users"
  ON api_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Diagnostic Functions
CREATE OR REPLACE FUNCTION test_database()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Test connection
  result = result || jsonb_build_object('connection', true);

  -- Test RLS on subscriptions
  BEGIN
    -- Try to select from subscriptions table
    PERFORM * FROM subscriptions LIMIT 1;
    
    -- If we get here, RLS might be disabled
    result = result || jsonb_build_object('rls_enabled', false);
  EXCEPTION
    WHEN insufficient_privilege THEN
      -- This is good - RLS is working
      result = result || jsonb_build_object('rls_enabled', true);
  END;

  RETURN result;
END;
$$;

-- Function to test table permissions
CREATE OR REPLACE FUNCTION test_table_permissions(table_name text)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb = '{}'::jsonb;
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Validate input
  IF table_name IS NULL OR table_name = '' THEN
    RAISE EXCEPTION 'Table name is required';
  END IF;

  -- Test if table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = table_name
  ) THEN
    RETURN jsonb_build_object('exists', false);
  END IF;

  -- Test RLS
  result = result || jsonb_build_object(
    'exists', true,
    'has_rls', EXISTS (
      SELECT 1 FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename = table_name
      AND rowsecurity = true
    )
  );

  -- Test policies
  result = result || jsonb_build_object(
    'policies', (
      SELECT jsonb_agg(jsonb_build_object(
        'name', polname,
        'command', cmd,
        'roles', roles
      ))
      FROM pg_policies
      WHERE schemaname = 'public'
      AND tablename = table_name
    )
  );

  RETURN result;
END;
$$;

-- Revoke all existing permissions
REVOKE ALL ON FUNCTION test_database() FROM PUBLIC;
REVOKE ALL ON FUNCTION test_table_permissions(text) FROM PUBLIC;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION test_database() TO authenticated;
GRANT EXECUTE ON FUNCTION test_table_permissions(text) TO authenticated;

-- Create indexes for performance
CREATE INDEX idx_users_metadata_user_id ON users_metadata(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_surveys_user_id ON surveys(user_id);
CREATE INDEX idx_surveys_vessel_id ON surveys(vessel_id);
CREATE INDEX idx_survey_sections_survey_id ON survey_sections(survey_id);
CREATE INDEX idx_survey_items_section_id ON survey_items(section_id);
CREATE INDEX idx_survey_analyses_survey_id ON survey_analyses(survey_id);
CREATE INDEX idx_survey_analyses_user_id ON survey_analyses(user_id);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX idx_api_usage_timestamp ON api_usage(timestamp);
CREATE INDEX idx_api_keys_last_used ON api_keys(last_used_at);