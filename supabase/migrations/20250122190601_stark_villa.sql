-- Add address fields to appointments table
ALTER TABLE appointments
  ADD COLUMN address_line1 text,
  ADD COLUMN address_line2 text,
  ADD COLUMN city text,
  ADD COLUMN state text,
  ADD COLUMN postal_code text,
  ADD COLUMN country text;

-- Update create_appointment function to include address fields
CREATE OR REPLACE FUNCTION create_appointment(
  p_title text,
  p_date date,
  p_start_time time,
  p_end_time time,
  p_client_email text,
  p_address_line1 text DEFAULT NULL,
  p_address_line2 text DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_state text DEFAULT NULL,
  p_postal_code text DEFAULT NULL,
  p_country text DEFAULT NULL,
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
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
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
    p_address_line1,
    p_address_line2,
    p_city,
    p_state,
    p_postal_code,
    p_country,
    p_description,
    now(),
    now()
  )
  RETURNING id INTO v_appointment_id;

  RETURN v_appointment_id;
END;
$$;