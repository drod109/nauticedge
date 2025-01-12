/*
  # Fix Remaining RLS Policies

  1. Changes
    - Add missing RLS policies for survey_analyses table
    - Add missing delete policies for all tables
    - Ensure consistent policy naming across all tables
    
  2. Security
    - Maintains RLS protection
    - Ensures users can only access their own data
    - Adds proper cascading delete permissions
*/

-- Survey analyses policies
DROP POLICY IF EXISTS "Enable read for users" ON survey_analyses;
DROP POLICY IF EXISTS "Enable insert for users" ON survey_analyses;
DROP POLICY IF EXISTS "Enable update for users" ON survey_analyses;
DROP POLICY IF EXISTS "Enable delete for users" ON survey_analyses;

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

-- Add missing delete policies for survey_sections
CREATE POLICY "Enable delete for users"
  ON survey_sections
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM surveys
    WHERE surveys.id = survey_sections.survey_id
    AND surveys.user_id = auth.uid()
  ));

-- Add missing delete policies for survey_items
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

-- Add missing delete policies for surveys
CREATE POLICY "Enable delete for users"
  ON surveys
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);