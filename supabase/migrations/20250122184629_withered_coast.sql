/*
  # Create appointments table and related functions

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `date` (date)
      - `startTime` (time)
      - `endTime` (time)
      - `clientEmail` (text)
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `appointments` table
    - Add policies for CRUD operations
    - Add indexes for performance

  3. Functions
    - Add function to handle appointment creation with validation
*/

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  date date NOT NULL,
  startTime time NOT NULL,
  endTime time NOT NULL,
  clientEmail text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Add constraint to ensure end time is after start time
  CONSTRAINT appointments_time_check CHECK (endTime > startTime),
  -- Add constraint for valid email format
  CONSTRAINT appointments_email_check CHECK (clientEmail ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_user_date ON appointments(user_id, date);

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

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

-- Function to create appointment with validation
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
      (startTime, endTime) OVERLAPS (p_start_time, p_end_time)
    )
  ) THEN
    RAISE EXCEPTION 'Appointment overlaps with existing appointment';
  END IF;

  -- Insert appointment
  INSERT INTO appointments (
    user_id,
    title,
    date,
    startTime,
    endTime,
    clientEmail,
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