/*
  # Fix RLS Policies for All Tables

  1. Changes
    - Drop and recreate RLS policies for all tables
    - Ensure proper authentication checks
    - Allow proper data access based on user_id
    - Fix subscription table policies
    
  2. Security
    - Maintains RLS protection
    - Ensures users can only access their own data
    - Allows proper subscription management
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read for users" ON subscriptions;
DROP POLICY IF EXISTS "Enable insert for users" ON subscriptions;
DROP POLICY IF EXISTS "Enable update for users" ON subscriptions;
DROP POLICY IF EXISTS "Enable delete for users" ON subscriptions;

-- Subscriptions policies
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

-- Users metadata policies
DROP POLICY IF EXISTS "Users can view their own metadata" ON users_metadata;
DROP POLICY IF EXISTS "Users can update their own metadata" ON users_metadata;

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

-- Surveys policies
DROP POLICY IF EXISTS "Users can view their own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can create their own surveys" ON surveys;
DROP POLICY IF EXISTS "Users can update their own surveys" ON surveys;

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

-- Survey sections policies
DROP POLICY IF EXISTS "Users can view survey sections they own" ON survey_sections;
DROP POLICY IF EXISTS "Users can create survey sections they own" ON survey_sections;

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

-- Survey items policies
DROP POLICY IF EXISTS "Users can view survey items they own" ON survey_items;
DROP POLICY IF EXISTS "Users can create survey items they own" ON survey_items;

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