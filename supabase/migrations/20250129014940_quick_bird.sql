-- Enable pgcrypto extension in the public schema
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- Verify extension is enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_extension 
    WHERE extname = 'pgcrypto'
  ) THEN
    RAISE EXCEPTION 'pgcrypto extension not enabled';
  END IF;
END $$;