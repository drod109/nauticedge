/*
  # Core Application Tables

  1. New Tables
    - `users_metadata`
      - Extended user profile information
      - Linked to auth.users
      - Stores additional user details

    - `subscriptions`
      - User subscription information
      - Tracks plan type and status
      - Required for API access control

    - `surveys`
      - Core survey data
      - Links to users and vessels
      - Includes status tracking

    - `vessels`
      - Vessel information
      - Linked to surveys
      - Stores vessel specifications

    - `survey_sections`
      - Survey content organization
      - Hierarchical structure
      - Customizable templates

    - `survey_items`
      - Individual inspection points
      - Linked to survey sections
      - Includes findings and ratings

    - `survey_analyses`
      - AI-generated analyses
      - Linked to surveys
      - Different analysis types

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
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

-- Enable Row Level Security
ALTER TABLE users_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vessels ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_analyses ENABLE ROW LEVEL SECURITY;

-- Users Metadata Policies
CREATE POLICY "Users can view their own metadata"
  ON users_metadata FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own metadata"
  ON users_metadata FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Subscriptions Policies
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Vessels Policies
CREATE POLICY "Users can view vessels"
  ON vessels FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create vessels"
  ON vessels FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Surveys Policies
CREATE POLICY "Users can view their own surveys"
  ON surveys FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own surveys"
  ON surveys FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own surveys"
  ON surveys FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Survey Sections Policies
CREATE POLICY "Users can view survey sections they own"
  ON survey_sections FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.id = survey_sections.survey_id
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Users can create survey sections they own"
  ON survey_sections FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.id = survey_sections.survey_id
    AND surveys.user_id = auth.uid()
  ));

-- Survey Items Policies
CREATE POLICY "Users can view survey items they own"
  ON survey_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM survey_sections
    JOIN surveys ON surveys.id = survey_sections.survey_id
    WHERE survey_sections.id = survey_items.section_id
    AND surveys.user_id = auth.uid()
  ));

CREATE POLICY "Users can create survey items they own"
  ON survey_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM survey_sections
    JOIN surveys ON surveys.id = survey_sections.survey_id
    WHERE survey_sections.id = survey_items.section_id
    AND surveys.user_id = auth.uid()
  ));

-- Survey Analyses Policies
CREATE POLICY "Users can view their own analyses"
  ON survey_analyses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analyses"
  ON survey_analyses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_users_metadata_user_id ON users_metadata(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_surveys_user_id ON surveys(user_id);
CREATE INDEX idx_surveys_vessel_id ON surveys(vessel_id);
CREATE INDEX idx_survey_sections_survey_id ON survey_sections(survey_id);
CREATE INDEX idx_survey_items_section_id ON survey_items(section_id);
CREATE INDEX idx_survey_analyses_survey_id ON survey_analyses(survey_id);
CREATE INDEX idx_survey_analyses_user_id ON survey_analyses(user_id);