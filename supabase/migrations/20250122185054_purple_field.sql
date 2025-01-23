/*
  # Fix appointments table schema

  1. Changes
    - Rename columns to use snake_case (PostgreSQL convention)
    - Add safety checks for existing policies
    - Update function to use new column names
*/

-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
  DROP POLICY IF EXISTS "Users can create own appointments" ON appointments;
  DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;
  DROP POLICY IF EXISTS "Users can delete own appointments" ON appointments;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Rename columns to follow PostgreSQL conventions
ALTER TABLE IF EXISTS appointments
  RENAME COLUMN startTime TO start_time;

ALTER TABLE IF EXISTS appointments  
  RENAME COLUMN endTime TO end_time;

ALTER TABLE IF EXISTS appointments
  RENAME COLUMN clientEmail TO client_email;

-- Drop existing constraints
ALTER TABLE IF EXISTS appointments
  DROP CONSTRAINT IF EXISTS appointments_time_check,
  DROP CONSTRAINT IF EXISTS appointments_email_check;

-- Add constraints with new column names
ALTER TABLE IF EXISTS appointments
  ADD CONSTRAINT appointments_time_check 
    CHECK (end_time > start_time),
  ADD CONSTRAINT appointments_email_check 
    CHECK (client_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Create RLS policies
CREATE POLICY "Users can view own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments"
  ON appointments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update function to use new column names
CREATE OR REPLACE FUNCTION create_appointment(
  p_title text,
  p_date date,
  p_start_time time,
  p_end_time time,
  p_client_email text,
  p_description text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_appointment_id uuid;
BEGIN
  -- Validate inputs
  IF p_end_time <= p_start_time THEN
    RAISE EXCEPTION 'End time must be after start time';
  END IF;

  IF p_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Cannot create appointments in the past';
  END IF;

  -- Check for overlapping appointments
  IF EXISTS (
    SELECT 1 FROM appointments
    WHERE user_id = auth.uid()
    AND date = p_date
    AND (
      (start_time, end_time) OVERLAPS (p_start_time, p_end_time)
    )
  ) THEN
    RAISE EXCEPTION 'Appointment overlaps with existing appointment';
  END IF;

  -- Insert appointment
  INSERT INTO appointments (
    user_id,
    title,
    date,
    start_time,
    end_time,
    client_email,
    description,
    created_at,
    updated_at
  )
  VALUES (
    auth.uid(),
    p_title,
    p_date,
    p_start_time,
    p_end_time,
    p_client_email,
    p_description,
    now(),
    now()
  )
  RETURNING id INTO v_appointment_id;

  RETURN v_appointment_id;
END;
$$;